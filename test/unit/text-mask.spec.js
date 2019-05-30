import {TextMask} from '../../src/text-mask';
import {expect} from 'chai';

const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseLetters = lowerCaseLetters.toUpperCase();
const NEW_LINE = '\n';
const WHITE_SPACE = ' ';

describe('Text Mask', () => {
    let givenMaxCost, givenText, results;

    describe('Enforce And Track Cost', () => {
        describe('when cost of text to mask is less than or equal to the provided maxCost', () => {
            let remainder;
    
            beforeEach(() => {
                givenMaxCost = chance.integer({min: 10, max: 100});
            });
    
            describe('AND given text with lowercase letters', () => {
                beforeEach(() => {
                    const textLength = chance.integer({min: 2, max: givenMaxCost});
    
                    givenText = chance.string({pool: lowerCaseLetters, length: textLength});
                    remainder = givenMaxCost - textLength;
                    results = TextMask.enforceAndTrackCost(givenText, givenMaxCost);
                });
    
                it('should not mask characters', () => {
                    expect(results.enforcedText).to.equal(givenText);
                });
    
                it('should correctly assign remainder', () => {
                    expect(results.remainder).to.equal(remainder);
                });
            });
    
            describe('AND given text with uppercase letters', () => {
                beforeEach(() => {
                    const halfOfGivenMaxCost = Math.floor(givenMaxCost/2);
                    const textLength = chance.integer({min: 2, max: halfOfGivenMaxCost});
    
                    givenText = chance.string({pool: upperCaseLetters, length: textLength});
                    remainder = givenMaxCost - (textLength * 2);
                    results = TextMask.enforceAndTrackCost(givenText, givenMaxCost);
                });
    
                it('should not mask characters', () => {
                    expect(results.enforcedText).to.equal(givenText);
                });
    
                it('should correctly assign remainder', () => {
                    expect(results.remainder).to.equal(remainder);
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
                    results = TextMask.enforceAndTrackCost(givenText, givenMaxCost);
                });
    
                it('should not mask characters', () => {
                    expect(results.enforcedText).to.equal(givenText);
                });
    
                it('should correctly assign remainder', () => {
                    expect(results.remainder).to.equal(remainder);
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
                    results = TextMask.enforceAndTrackCost(givenText, givenMaxCost);
                });
    
                it('should not mask characters', () => {
                    expect(results.enforcedText).to.equal(givenText);
                });
    
                it('should correctly assign remainder', () => {
                    expect(results.remainder).to.equal(remainder);
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
                    results = TextMask.enforceAndTrackCost(givenText, givenMaxCost);
                });
    
                it('should not mask characters', () => {
                    expect(results.enforcedText).to.equal(givenText);
                });
    
                it('should correctly assign remainder', () => {
                    expect(results.remainder).to.equal(remainder);
                });
            });
        });
    
        describe('when cost of text to mask is greater than the provided maxCost', () => {
            let actualText;
    
            beforeEach(() => {
                givenMaxCost = chance.integer({min: 10, max: 100});
            });
    
            describe('AND given text with lowercase letters', () => {
                beforeEach(() => {
                    const givenText1 = chance.string({pool: lowerCaseLetters, length: givenMaxCost});
                    const givenText2 = chance.string({pool: lowerCaseLetters, length: givenMaxCost});
    
                    givenText = givenText1 + givenText2;
                    actualText = givenText.substring(0, givenMaxCost) + getWhiteSpaces(givenMaxCost);
                    results = TextMask.enforceAndTrackCost(givenText, givenMaxCost);
                });
    
                it('should correctly mask text', () => {
                    expect(results.enforcedText).to.equal(actualText);
                });
    
                it('should set remainder to 0', () => {
                    expect(results.remainder).to.equal(0);
                });
            });
    
            describe('AND given text with uppercase letters', () => {
                beforeEach(() => {
                    const halfOfGivenMaxCost = Math.floor(givenMaxCost/2);
                    const givenText1 = chance.string({pool: upperCaseLetters, length: halfOfGivenMaxCost});
                    const givenText2 = chance.string({pool: upperCaseLetters, length: halfOfGivenMaxCost});
    
                    givenText = givenText1 + givenText2;
                    actualText = givenText.substring(0, halfOfGivenMaxCost) + getWhiteSpaces(halfOfGivenMaxCost);
                    results = TextMask.enforceAndTrackCost(givenText, givenMaxCost);
                });
    
                it('should correctly mask text', () => {
                    expect(results.enforcedText).to.equal(actualText);
                });
    
                it('should set remainder to 0', () => {
                    expect(results.remainder).to.equal(0);
                });
            });
    
            describe('AND given text with mixedcase letters', () => {
                describe('Abc', () => {
                    givenText = 'Abc';
                    assertMixedCase(givenText, 1, getWhiteSpaces(3));
                    assertMixedCase(givenText, 2, `A${getWhiteSpaces(2)}`);
                    assertMixedCase(givenText, 3, `Ab${getWhiteSpaces(1)}`);
                    assertMixedCase(givenText, 4, 'Abc');
                });
    
                describe('aBc', () => {
                    givenText = 'aBc';
                    assertMixedCase(givenText, 1, `a${getWhiteSpaces(2)}`);
                    assertMixedCase(givenText, 2, `a${getWhiteSpaces(2)}`);
                    assertMixedCase(givenText, 3, `aB${getWhiteSpaces(1)}`);
                    assertMixedCase(givenText, 4, 'aBc');
                });
    
                describe('abC', () => {
                    givenText = 'abC';
                    assertMixedCase(givenText, 1, `a${getWhiteSpaces(2)}`);
                    assertMixedCase(givenText, 2, `ab${getWhiteSpaces(1)}`);
                    assertMixedCase(givenText, 3, `ab${getWhiteSpaces(1)}`);
                    assertMixedCase(givenText, 4, 'abC');
                });
            });
    
            describe('AND handling newlines', () => {
                beforeEach(() => {
                    const givenText1 = chance.string({pool: lowerCaseLetters, length: givenMaxCost});
                    const givenText2 = chance.string({pool: lowerCaseLetters, length: givenMaxCost});
                    
                    givenText =  NEW_LINE + givenText1 + NEW_LINE + givenText2 + NEW_LINE;
                    actualText = NEW_LINE + givenText1 + NEW_LINE + getWhiteSpaces(givenMaxCost) + NEW_LINE;
                    results = TextMask.enforceAndTrackCost(givenText, givenMaxCost);
                });
    
                it('should not mask characters', () => {
                    expect(results.enforcedText).to.equal(actualText);
                });
    
                it('should set remainder to 0', () => {
                    expect(results.remainder).to.equal(0);
                });
            });
    
            describe('AND handling spaces', () => {
                beforeEach(() => {
                    const givenText1 = chance.string({pool: lowerCaseLetters, length: givenMaxCost});
                    const givenText2 = chance.string({pool: lowerCaseLetters, length: givenMaxCost});
    
                    givenText =  WHITE_SPACE + givenText1 + WHITE_SPACE + givenText2 + WHITE_SPACE;
                    actualText = WHITE_SPACE + givenText1 + getWhiteSpaces(givenMaxCost + 2);
                    results = TextMask.enforceAndTrackCost(givenText, givenMaxCost);
                });
    
                it('should not mask characters', () => {
                    expect(results.enforcedText).to.equal(actualText);
                });
    
                it('should set remainder to 0', () => {
                    expect(results.remainder).to.equal(0);
                });
            });
        });
    });
});

function assertMixedCase(givenText, givenMaxCost, actualText) {
    describe(`givenMaxCost is ${givenMaxCost}`, () => {
        let results;

        beforeEach(() => {
            results = TextMask.enforceAndTrackCost(givenText, givenMaxCost);
        });

        it(`should correctly mask text as: ${actualText}`, () => {
            expect(results.enforcedText).to.equal(actualText);
        });

        it('should set remainder to 0', () => {
            expect(results.remainder).to.equal(0);
        });
    });
}

function getWhiteSpaces(number) {
    return Array(number + 1).join(WHITE_SPACE);
}