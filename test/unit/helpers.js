export function getWhiteSpaces(number) {
    const stringToBe = [];

    for (var i = 1; i <= number; i++) {
        stringToBe.push(' ');
    }

    return stringToBe.join('');
}