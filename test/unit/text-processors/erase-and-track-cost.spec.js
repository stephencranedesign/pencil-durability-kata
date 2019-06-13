import {eraseAndTrackCost} from '../../../src/text-processors/erase-and-track-cost';
import {getWhiteSpaces} from '../helpers';

describe('Text Processors: eraseAndTrackCost', () => {
    let givenWord, givenText, expectedProcessedText, expectedRemainer, expectedEraseIndex, results;

    describe('when the length of the word to erase <= then the maxCost', () => {
        beforeEach(() => {
            const length = chance.integer({min: 10, max: 20});
            const maxCost = chance.integer({min: length, max: length + 10});
            const phrase1 = chance.string();
            const phrase2 = chance.string();
            const phrase3 = chance.string();

            givenWord = chance.string({length});

            givenText = phrase1 + givenWord + phrase2 + givenWord + phrase3;
            expectedProcessedText = phrase1 + givenWord + phrase2 + getWhiteSpaces(givenWord.length) + phrase3;
            expectedRemainer = maxCost - length;
            expectedEraseIndex = phrase1.length + givenWord.length + phrase2.length;

            results = eraseAndTrackCost(givenText, givenWord, maxCost);
        });

        it('should completely erase the last given word', () => {
            expect(results.processedText).to.equal(expectedProcessedText);
        });

        it('should correctly assign remainder', () => {
            expect(results.remainder).to.equal(expectedRemainer);
        });

        it('should correctly assign the edit index', () => {
            expect(results.eraseIndex).to.equal(expectedEraseIndex);
        });
    });

    describe('when the length of the word to erase > then the maxCost', () => {
        beforeEach(() => {
            const length = chance.integer({min: 10, max: 20});
            const maxCost = chance.integer({min: 1, max: length - 1});
            const phrase1 = chance.string();
            const phrase2 = chance.string() + ' | ';
            const phrase3 = ' | ' + chance.string();
            const lengthOfMask = length - maxCost;

            givenWord = chance.string({length});
            const maskedGivenWord = givenWord.substring(0, lengthOfMask) + getWhiteSpaces(lengthOfMask);

            givenText = phrase1 + givenWord + phrase2 + givenWord + phrase3;
            expectedProcessedText = phrase1 + givenWord + phrase2 + maskedGivenWord + phrase3;  
            expectedRemainer = maxCost - length;
            expectedEraseIndex = phrase1.length + givenWord.length + phrase2.length;

            results = eraseAndTrackCost(givenText, givenWord, maxCost);
        });

        it('should partially erase the last given word', () => {
            expect(results.processedText).to.equal(expectedProcessedText);
        });

        it('should set remainder to 0', () => {
            expect(results.remainder).to.equal(0);
        });

        it('should correctly assign the edit index', () => {
            expect(results.eraseIndex).to.equal(expectedEraseIndex);
        });
    });
});