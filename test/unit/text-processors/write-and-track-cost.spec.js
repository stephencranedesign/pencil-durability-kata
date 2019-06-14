import {writeAndTrackCost} from '../../../src/text-processors/write-and-track-cost';
import {lowerCaseLetters, upperCaseLetters, NEW_LINE, WHITE_SPACE, getSpecifiedNumberOfCharacters} from '../helpers';

const MASK_CHARACTER = chance.character({symbols: true});

describe('Text Processors: writeAndTrackCost', () => {
    let givenMaxCost, givenText, givenApplyMaskAtIndex, results;

    describe('when cost of text to write is less than or equal to the provided maxCost', () => {
        let expectedRemainder;

        beforeEach(() => {
            givenMaxCost = chance.integer({min: 10, max: 100});
            givenApplyMaskAtIndex = sinon.stub();
            const textLength = chance.integer({min: 2, max: givenMaxCost});

            givenText = chance.string({pool: lowerCaseLetters, length: textLength});
            expectedRemainder = givenMaxCost - textLength;
            results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);
        });

        it('should not mask characters', () => {
            expect(results.processedText).to.equal(givenText);
        });

        it('should correctly assign remainder', () => {
            expect(results.remainder).to.equal(expectedRemainder);
        });

        it('should not call givenApplyMaskAtIndex', () => {
            expect(givenApplyMaskAtIndex).to.have.callCount(0);
        });
    });

    describe('when cost of text to write is greater than the provided maxCost', () => {
        let expectedText, lengthOfMaskedText;

        beforeEach(() => {
            givenMaxCost = chance.integer({min: 10, max: 100});
            lengthOfMaskedText = chance.integer({min: 1, max: 20});
            givenApplyMaskAtIndex = sinon.stub().returns(MASK_CHARACTER);
        });

        describe('AND given text with lowercase letters', () => {
            beforeEach(() => {
                const givenText1 = chance.string({pool: lowerCaseLetters, length: givenMaxCost});
                const givenText2 = chance.string({pool: lowerCaseLetters, length: lengthOfMaskedText});

                givenText = givenText1 + givenText2;
                expectedText = givenText1 + getMaskForLength(lengthOfMaskedText);
                results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);
            });

            it('should correctly mask text', () => {
                expect(results.processedText).to.equal(expectedText);
            });

            it('should set remainder to 0', () => {
                expect(results.remainder).to.equal(0);
            });

            it('should call givenApplyMaskAtIndex correctly', () => {
                assertGivenApplyMaskAtIndex(givenApplyMaskAtIndex, lengthOfMaskedText, givenMaxCost);
            });
        });

        describe('AND given text with uppercase letters', () => {
            let halfOfGivenMaxCost;

            beforeEach(() => {
                halfOfGivenMaxCost = Math.floor(givenMaxCost/2);

                const givenText1 = chance.string({pool: upperCaseLetters, length: halfOfGivenMaxCost});
                const givenText2 = chance.string({pool: upperCaseLetters, length: lengthOfMaskedText});

                givenText = givenText1 + givenText2;
                expectedText = givenText1 + getMaskForLength(lengthOfMaskedText);
                results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);
            });

            it('should correctly mask text', () => {
                expect(results.processedText).to.equal(expectedText);
            });

            it('should set remainder to 0', () => {
                expect(results.remainder).to.equal(0);
            });

            it('should call givenApplyMaskAtIndex correctly', () => {
                assertGivenApplyMaskAtIndex(givenApplyMaskAtIndex, lengthOfMaskedText, halfOfGivenMaxCost);
            });
        });

        describe('AND given text with mixedcase letters', () => {
            describe('AND first character is a capitol letter', () => {
                const {full, char1, char2, char3} = getThreeRandomCharactersAndCapitolizeIndex(0);

                assertMixedCase(full, 1, '', 3);
                assertMixedCase(full, 2, char1, 2);
                assertMixedCase(full, 3, char1 + char2, 1);
                assertMixedCase(full, 4, full, 0);
            });

            describe('AND second character is a capitol letter', () => {
                const {full, char1, char2, char3} = getThreeRandomCharactersAndCapitolizeIndex(1);

                assertMixedCase(full, 1, char1, 2);
                assertMixedCase(full, 2, char1, 2);
                assertMixedCase(full, 3, char1 + char2, 1);
                assertMixedCase(full, 4, full, 0);
            });

            describe('AND third character is a capitol letter', () => {
                const {full, char1, char2, char3} = getThreeRandomCharactersAndCapitolizeIndex(2);

                assertMixedCase(full, 1, char1, 2);
                assertMixedCase(full, 2, char1 + char2, 1);
                assertMixedCase(full, 3, char1 + char2, 1);
                assertMixedCase(full, 4, full, 0);
            });
        });

        describe('AND handling newlines', () => {
            beforeEach(() => {
                const givenText1 = chance.string({pool: lowerCaseLetters, length: givenMaxCost});
                const givenText2 = chance.string({pool: lowerCaseLetters, length: lengthOfMaskedText});
                
                givenText =  NEW_LINE + givenText1 + NEW_LINE + givenText2 + NEW_LINE;
                expectedText = NEW_LINE + givenText1 + NEW_LINE + getMaskForLength(lengthOfMaskedText) + NEW_LINE;
                results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);
            });

            it('should not mask characters', () => {
                expect(results.processedText).to.equal(expectedText);
            });

            it('should set remainder to 0', () => {
                expect(results.remainder).to.equal(0);
            });

            it('should call givenApplyMaskAtIndex correctly', () => {
                assertGivenApplyMaskAtIndex(givenApplyMaskAtIndex, lengthOfMaskedText, givenMaxCost + 2);
            });
        });

        describe('AND handling spaces', () => {
            beforeEach(() => {
                const givenText1 = chance.string({pool: lowerCaseLetters, length: givenMaxCost});
                const givenText2 = chance.string({pool: lowerCaseLetters, length: lengthOfMaskedText});

                givenText =  WHITE_SPACE + givenText1 + WHITE_SPACE + givenText2 + WHITE_SPACE;
                expectedText = WHITE_SPACE + givenText1 + WHITE_SPACE + getMaskForLength(lengthOfMaskedText) + WHITE_SPACE;
                results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);
            });

            it('should not mask characters', () => {
                expect(results.processedText).to.equal(expectedText);
            });

            it('should set remainder to 0', () => {
                expect(results.remainder).to.equal(0);
            });

            it('should call givenApplyMaskAtIndex correctly', () => {
                assertGivenApplyMaskAtIndex(givenApplyMaskAtIndex, lengthOfMaskedText, givenMaxCost + 2);
            });
        });
    });

    describe('when givenApplyMaskAtIndex returns more then one character', () => {
        beforeEach(() => {
            const givenApplyMaskAtIndexResponse = chance.n(chance.character, 2 + chance.d6());

            givenMaxCost = chance.integer({min: 10, max: 100});
            givenText = chance.string({length: givenMaxCost + 1 + chance.d6()});

            givenApplyMaskAtIndex = sinon.stub().returns(givenApplyMaskAtIndexResponse);
        });

        it('should throw error', () => {
            const action = () => writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);
            expect(action).to.throw('applyMaskAtIndex can not return more then one character');
        });
    });
});

function assertMixedCase(givenText, givenMaxCost, textToShow, numberOfCallsToGivenApplyMask) {
    describe(`AND givenMaxCost is ${givenMaxCost} with givenText of ${givenText}`, () => {
        const expectedText = textToShow + getMaskForLength(numberOfCallsToGivenApplyMask);
        const givenApplyMaskAtIndex = sinon.stub().returns(MASK_CHARACTER);
        const results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);

        it(`should correctly mask text as: ${expectedText}`, () => {
            expect(results.processedText).to.equal(expectedText);
        });

        it('should set remainder to 0', () => {
            expect(results.remainder).to.equal(0);
        });

        it('should call givenApplyMaskAtIndex correctly', () => {
            const indexToStartMask = 3 - numberOfCallsToGivenApplyMask;

            assertGivenApplyMaskAtIndex(givenApplyMaskAtIndex, numberOfCallsToGivenApplyMask, indexToStartMask);
        });
    });
}

function assertGivenApplyMaskAtIndex(givenApplyMaskAtIndex, expectedCallCount, indexToStartMask) {
    expect(givenApplyMaskAtIndex).to.have.callCount(expectedCallCount);

    givenApplyMaskAtIndex.getCalls().forEach((call, i) => {
        expect(call.args, `should call givenApplyMaskAtIndex with ${indexToStartMask + i} as first argument`).to.deep.equal([indexToStartMask + i]);
    });
}

function getMaskForLength(number) {
    return getSpecifiedNumberOfCharacters(number, MASK_CHARACTER);
}

function getThreeRandomCharactersAndCapitolizeIndex(indexToCapitolize) {
    const characters = [
        chance.character({alpha: true, casing: 'lower'}),
        chance.character({alpha: true, casing: 'lower'}),
        chance.character({alpha: true, casing: 'lower'})
    ];

    characters[indexToCapitolize] = characters[indexToCapitolize].toUpperCase();

    return {
        char1: characters[0],
        char2: characters[1],
        char3: characters[2],
        full: characters.join('')
    }
}