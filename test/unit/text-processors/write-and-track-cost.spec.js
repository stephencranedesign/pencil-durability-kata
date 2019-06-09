import {writeAndTrackCost} from '../../../src/text-processors/write-and-track-cost';

const MASK_CHARACTER = chance.character({symbols: true});
const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseLetters = lowerCaseLetters.toUpperCase();
const NEW_LINE = '\n';
const WHITE_SPACE = ' ';

describe('Text Processors: writeAndTrackCost', () => {
    let givenMaxCost, givenText, givenApplyMaskAtIndex, results;

    describe('when cost of text to write is less than or equal to the provided maxCost', () => {
        let remainder;

        beforeEach(() => {
            givenMaxCost = chance.integer({min: 10, max: 100});
            givenApplyMaskAtIndex = sinon.stub();
        });

        describe('AND given text with lowercase letters', () => {
            beforeEach(() => {
                const textLength = chance.integer({min: 2, max: givenMaxCost});

                givenText = chance.string({pool: lowerCaseLetters, length: textLength});
                remainder = givenMaxCost - textLength;
                results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);
            });

            it('should not mask characters', () => {
                expect(results.processedText).to.equal(givenText);
            });

            it('should correctly assign remainder', () => {
                expect(results.remainder).to.equal(remainder);
            });

            it('should not call givenApplyMaskAtIndex', () => {
                expect(givenApplyMaskAtIndex).to.have.callCount(0);
            });
        });

        describe('AND given text with uppercase letters', () => {
            beforeEach(() => {
                const halfOfGivenMaxCost = Math.floor(givenMaxCost/2);
                const textLength = chance.integer({min: 2, max: halfOfGivenMaxCost});

                givenText = chance.string({pool: upperCaseLetters, length: textLength});
                remainder = givenMaxCost - (textLength * 2);
                results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);
            });

            it('should not mask characters', () => {
                expect(results.processedText).to.equal(givenText);
            });

            it('should correctly assign remainder', () => {
                expect(results.remainder).to.equal(remainder);
            });

            it('should not call givenApplyMaskAtIndex', () => {
                expect(givenApplyMaskAtIndex).to.have.callCount(0);
            });
        });

        describe('AND given text with mixedcase letters', () => {
            beforeEach(() => {
                const halfOfGivenMaxCost = Math.floor(givenMaxCost/2);
                const quarterOfGivenMaxCost = Math.floor(givenMaxCost/4);
                const textLengthOfLowercase = chance.integer({min: 2, max: halfOfGivenMaxCost});
                const textLengthOfUppercase = chance.integer({min: 2, max: quarterOfGivenMaxCost});

                const uppercase = chance.n(() => chance.character({pool: upperCaseLetters}), textLengthOfUppercase);
                const lowercase = chance.n(() => chance.character({pool: lowerCaseLetters}), textLengthOfLowercase);

                givenText = chance.shuffle([...uppercase, ...lowercase]).join('');
                remainder = givenMaxCost - textLengthOfLowercase - (textLengthOfUppercase*2);
                results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);
            });

            it('should not mask characters', () => {
                expect(results.processedText).to.equal(givenText);
            });

            it('should correctly assign remainder', () => {
                expect(results.remainder).to.equal(remainder);
            });

            it('should not call givenApplyMaskAtIndex', () => {
                expect(givenApplyMaskAtIndex).to.have.callCount(0);
            });
        });

        describe('AND given text with newlines', () => {
            beforeEach(() => {
                const halfOfGivenMaxCost = Math.floor(givenMaxCost/2);
                const textLength1 = chance.integer({min: 2, max: halfOfGivenMaxCost});
                const textLength2 = chance.integer({min: 2, max: halfOfGivenMaxCost});

                const givenText1 = chance.string({pool: lowerCaseLetters, length: textLength1});
                const givenText2 = chance.string({pool: lowerCaseLetters, length: textLength2});

                givenText =  NEW_LINE + givenText1 + NEW_LINE + givenText2 + NEW_LINE;
                remainder = givenMaxCost - textLength1 - textLength2;
                results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);
            });

            it('should not mask characters', () => {
                expect(results.processedText).to.equal(givenText);
            });

            it('should correctly assign remainder', () => {
                expect(results.remainder).to.equal(remainder);
            });

            it('should not call givenApplyMaskAtIndex', () => {
                expect(givenApplyMaskAtIndex).to.have.callCount(0);
            });
        });

        describe('AND given text with spaces', () => {
            beforeEach(() => {
                const halfOfGivenMaxCost = Math.floor(givenMaxCost/2);
                const textLength1 = chance.integer({min: 2, max: halfOfGivenMaxCost});
                const textLength2 = chance.integer({min: 2, max: halfOfGivenMaxCost});

                const givenText1 = chance.string({pool: lowerCaseLetters, length: textLength1});
                const givenText2 = chance.string({pool: lowerCaseLetters, length: textLength2});

                givenText =  WHITE_SPACE + givenText1 + WHITE_SPACE + givenText2 + WHITE_SPACE;
                remainder = givenMaxCost - textLength1 - textLength2;
                results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);
            });

            it('should not mask characters', () => {
                expect(results.processedText).to.equal(givenText);
            });

            it('should correctly assign remainder', () => {
                expect(results.remainder).to.equal(remainder);
            });

            it('should not call givenApplyMaskAtIndex', () => {
                expect(givenApplyMaskAtIndex).to.have.callCount(0);
            });
        });
    });

    describe('when cost of text to write is greater than the provided maxCost', () => {
        let actualText, lengthOfMaskedText;

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
                actualText = givenText1 + getMaskForLength(lengthOfMaskedText);
                results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);
            });

            it('should correctly mask text', () => {
                expect(results.processedText).to.equal(actualText);
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
                actualText = givenText1 + getMaskForLength(lengthOfMaskedText);
                results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);
            });

            it('should correctly mask text', () => {
                expect(results.processedText).to.equal(actualText);
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
                givenText = 'Abc';
                assertMixedCase(givenText, 1, '', 3);
                assertMixedCase(givenText, 2, 'A', 2);
                assertMixedCase(givenText, 3, 'Ab', 1);
                assertMixedCase(givenText, 4, 'Abc', 0);
            });

            describe('AND second character is a capitol letter', () => {
                givenText = 'aBc';
                assertMixedCase(givenText, 1, 'a', 2);
                assertMixedCase(givenText, 2, 'a', 2);
                assertMixedCase(givenText, 3, 'aB', 1);
                assertMixedCase(givenText, 4, 'aBc', 0);
            });

            describe('AND third character is a capitol letter', () => {
                givenText = 'abC';
                assertMixedCase(givenText, 1, 'a', 2);
                assertMixedCase(givenText, 2, 'ab', 1);
                assertMixedCase(givenText, 3, 'ab', 1);
                assertMixedCase(givenText, 4, 'abC', 0);
            });
        });

        describe('AND handling newlines', () => {
            beforeEach(() => {
                const givenText1 = chance.string({pool: lowerCaseLetters, length: givenMaxCost});
                const givenText2 = chance.string({pool: lowerCaseLetters, length: lengthOfMaskedText});
                
                givenText =  NEW_LINE + givenText1 + NEW_LINE + givenText2 + NEW_LINE;
                actualText = NEW_LINE + givenText1 + NEW_LINE + getMaskForLength(lengthOfMaskedText) + NEW_LINE;
                results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);
            });

            it('should not mask characters', () => {
                expect(results.processedText).to.equal(actualText);
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
                actualText = WHITE_SPACE + givenText1 + WHITE_SPACE + getMaskForLength(lengthOfMaskedText) + WHITE_SPACE;
                results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);
            });

            it('should not mask characters', () => {
                expect(results.processedText).to.equal(actualText);
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
    describe(`AND givenMaxCost is ${givenMaxCost}`, () => {
        const actualText = textToShow + getMaskForLength(numberOfCallsToGivenApplyMask);
        const givenApplyMaskAtIndex = sinon.stub().returns(MASK_CHARACTER);
        const results = writeAndTrackCost(givenText, givenMaxCost, givenApplyMaskAtIndex);

        it(`should correctly mask text as: ${actualText}`, () => {
            expect(results.processedText).to.equal(actualText);
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
    const characters = [];

    for (let i=0; i<number; i++) {
        characters.push(MASK_CHARACTER);
    }

    return characters.join('');
}