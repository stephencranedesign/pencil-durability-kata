export function getSpecifiedNumberOfCharacters(number, character) {
    const stringToBe = [];

    for (var i = 1; i <= number; i++) {
        stringToBe.push(character);
    }

    return stringToBe.join('');
}

export function getWhiteSpaces(number) {
    return getSpecifiedNumberOfCharacters(number, ' ');
}