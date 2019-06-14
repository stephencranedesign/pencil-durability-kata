import proxyquire from 'proxyquire';
import {getWhiteSpaces, getSpecifiedNumberOfCharacters, NEW_LINE, WHITE_SPACE} from '../helpers';

describe('Text Processors: editAndTrackCost', () => {
    let textBeforeEdit,
        textAfterEdit,
        spaceForEdit,
        sizeOfEditText,
        expectedWhiteSpaces,
        editAndTrackCost,
        givenText,
        givenEdit,
        givenIndexToEdit,
        givenEditText,
        givenMaxCost,
        expectedTextForStub,
        expectedProcessedText,
        writeAndTrackCostStub,
        writeAndTrackCostStubResponse,
        results;

    beforeEach(() => {
        textBeforeEdit = chance.string();
        textAfterEdit = chance.string();
        spaceForEdit = chance.integer({min: 3, max: 20});
        sizeOfEditText = chance.integer({min: 3, max: spaceForEdit});
        expectedWhiteSpaces = getWhiteSpaces(spaceForEdit - sizeOfEditText);

        writeAndTrackCostStub = sinon.stub();
        editAndTrackCost = loadModule({
            './write-and-track-cost': {writeAndTrackCost: writeAndTrackCostStub}
        });

        givenText = textBeforeEdit + getWhiteSpaces(spaceForEdit) + textAfterEdit;
        givenIndexToEdit = textBeforeEdit.length;
        givenMaxCost = chance.integer({min: 1});

        writeAndTrackCostStubResponse = {
            remainder: chance.integer({min: 1}),
            processedText: chance.string({length: sizeOfEditText})
        };

        writeAndTrackCostStub.returns(writeAndTrackCostStubResponse);
    });

    describe('commonPath', () => {
        beforeEach(() => {
            const stringWithoutSpaces = chance.string({length: textBeforeEdit.length + sizeOfEditText});

            givenEditText = chance.string({length: sizeOfEditText});
            givenText = stringWithoutSpaces;
            results = editAndTrackCost(givenText, givenIndexToEdit, givenEditText, givenMaxCost);
        });

        it('should call writeAndTrackCost once', () => {
            expect(writeAndTrackCostStub).to.have.callCount(1);
        });

        it('should pass maxCost to writeAndTrackCost as second argument', () => {
            expect(writeAndTrackCostStub.firstCall.args[1]).to.equal(givenMaxCost);
        });

        it('should call writeAndTrackCost with correct applyMaskAtIndex as third argument', () => {
            const applyMaskAtIndex = writeAndTrackCostStub.firstCall.args[2];

            for (let i = 0; i < givenEditText.length; i++) {
                const characterBeforeEdit = givenText.charAt(givenIndexToEdit + i);
                expect(applyMaskAtIndex(i)).to.equal(characterBeforeEdit);
            }
        });

        it('should return correct value for remainder', () => {
            expect(results.remainder).to.equal(writeAndTrackCostStubResponse.remainder);
        });
    });

    describe('when the size of the text to edit <= space of the edit', () => {
        beforeEach(() => {
            givenEditText = chance.string({length: sizeOfEditText});

            expectedTextForStub = givenEditText;
            expectedProcessedText = textBeforeEdit + writeAndTrackCostStubResponse.processedText + expectedWhiteSpaces + textAfterEdit;
            results = editAndTrackCost(givenText, givenIndexToEdit, givenEditText, givenMaxCost);
        });

        it('should pass expectedText to writeAndTrackCost as first argument', () => {
            expect(writeAndTrackCostStub).to.be.calledWithMatch(expectedTextForStub, givenMaxCost);
        });

        it('should return correct value for processedText', () => {
            expect(results.processedText).to.equal(expectedProcessedText);
        });
    });

    describe('when the size of the text to edit > space of the edit', () => {
        let numberOfCharacterCollisions;

        describe('common path', () => {
            beforeEach(() => {
                sizeOfEditText = chance.integer({min: spaceForEdit + 1, max: spaceForEdit + textAfterEdit.length});
                numberOfCharacterCollisions = sizeOfEditText - spaceForEdit;
                givenEditText = chance.string({length: sizeOfEditText});

                writeAndTrackCostStubResponse = {
                    cost: chance.integer({min: 1}),
                    processedText: chance.string({length: sizeOfEditText + numberOfCharacterCollisions})
                };
                
                writeAndTrackCostStub.returns(writeAndTrackCostStubResponse);
                expectedProcessedText = textBeforeEdit + writeAndTrackCostStubResponse.processedText + textAfterEdit.substring(numberOfCharacterCollisions);
                results = editAndTrackCost(givenText, givenIndexToEdit, givenEditText, givenMaxCost);
            });
    
            it('should return correct value for processedText', () => {
                expect(results.processedText).to.equal(expectedProcessedText);
            });
        });

        describe('AND the character collides with an existing character', () => {
            beforeEach(() => {
                sizeOfEditText = chance.integer({min: spaceForEdit + 1, max: spaceForEdit + 1 + chance.d10()});
                numberOfCharacterCollisions = sizeOfEditText - spaceForEdit;
                givenEditText = chance.string({length: sizeOfEditText});

                const expectedUnmaskedText = givenEditText.substring(0, sizeOfEditText - numberOfCharacterCollisions);
                const expectedMaskedText = getSpecifiedNumberOfCharacters(numberOfCharacterCollisions, '@');

                expectedTextForStub = expectedUnmaskedText + expectedMaskedText;
                results = editAndTrackCost(givenText, givenIndexToEdit, givenEditText, givenMaxCost);
            });

            it('should mask collision characters with @', () => {
                expect(writeAndTrackCostStub).to.be.calledWithMatch(expectedTextForStub, givenMaxCost);
            });
        });

        describe('AND the character collides with an empty space', () => {
            beforeEach(() => {
                const numberOfWhiteSpaces = chance.integer({min: 1, max: 10});

                textAfterEdit = getWhiteSpaces(numberOfWhiteSpaces) + chance.string();
                sizeOfEditText = spaceForEdit + numberOfWhiteSpaces;
                givenEditText = chance.string({length: sizeOfEditText});
                givenText = textBeforeEdit + getWhiteSpaces(spaceForEdit) + textAfterEdit;

                expectedTextForStub = givenEditText;
                results = editAndTrackCost(givenText, givenIndexToEdit, givenEditText, givenMaxCost);
            });

            it('should not mask white spaces', () => {
                expect(writeAndTrackCostStub).to.be.calledWithMatch(expectedTextForStub, givenMaxCost);
            });
        });

        describe('AND the character collides with a new line', () => {
            beforeEach(() => {
                const numberOfNewLines = chance.integer({min: 1, max: 10});

                textAfterEdit = getSpecifiedNumberOfCharacters(numberOfNewLines, NEW_LINE) + chance.string();
                sizeOfEditText = spaceForEdit + numberOfNewLines;
                givenEditText = chance.string({length: sizeOfEditText});
                givenText = textBeforeEdit + getWhiteSpaces(spaceForEdit) + textAfterEdit;

                expectedTextForStub = givenEditText;
                results = editAndTrackCost(givenText, givenIndexToEdit, givenEditText, givenMaxCost);
            });

            it('should not mask new lines', () => {
                expect(writeAndTrackCostStub).to.be.calledWithMatch(expectedTextForStub, givenMaxCost);
            });
        });
    });
});

function loadModule(stubs) {
    return proxyquire('../../../src/text-processors/edit-and-track-cost', stubs).editAndTrackCost;
}
