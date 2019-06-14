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

export function fail(message) {
    throw new Error(message);
}

export const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
export const upperCaseLetters = lowerCaseLetters.toUpperCase();
export const NEW_LINE = '\n';
export const WHITE_SPACE = ' ';