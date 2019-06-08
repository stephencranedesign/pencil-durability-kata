export const eraseAndTrackCost = (text, textToErase, maxCost) => {
    const lastIndex = text.lastIndexOf(textToErase);
    const indexToEndMask = lastIndex + textToErase.length;
    let lengthOfMask = textToErase.length,
        indexToStartMask = lastIndex,
        remainder = maxCost - textToErase.length;

    if (isTooExpensive(textToErase, maxCost)) {
        lengthOfMask = textToErase.length - maxCost;
        indexToStartMask = lastIndex + lengthOfMask;
        remainder = 0;
    }

    const processedText = text.slice(0, indexToStartMask) +
        getWhiteSpaces(lengthOfMask) +
        text.slice(indexToEndMask);

    return {
        processedText,
        remainder
    };
};

function getWhiteSpaces(number) {
    return Array(number + 1).join(' ');
}

function isTooExpensive(textToErase, maxCost) {
    return textToErase.length > maxCost;
}