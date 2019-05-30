function getTextCost(text) {
    const charactersWithCost = text.replace(/\n/g, '').replace(/ /g, '');
    const uppercase = charactersWithCost.replace(/[^A-Z]/g, '').length;
    const lowercase = Math.abs(charactersWithCost.length - uppercase);
    const textCost = uppercase*2 + lowercase;

    return textCost;
}

function isTooExpensive(textCost, maxCost) {
    return maxCost - textCost < 0;
}

const WHITE_SPACE = ' ';

function getMaskedText(text, maxCost) {
    let costForText = 0,
        newText = [];

    for (var i = 0; i < text.length; i++) {
        const character = text.charAt(i);

        if (unmaskableCharacter(character)) {
            newText.push(character);
            continue;
        }

        isUpperCase(character) ? costForText += 2 : costForText += 1;

        if (costForText > maxCost) {
            newText.push(WHITE_SPACE);
        } else {
            newText.push(character);
        }
    }

    return newText.join('');
}

function unmaskableCharacter(character) {
    return /\n/.test(character) || / /.test(character);
}

function isUpperCase(character) {
    return /[A-Z]/.test(character);
}

export class TextMask {
    static enforceAndTrackCost(text, maxCost) {
        const textCost = getTextCost(text);
    
        if (isTooExpensive(textCost, maxCost)) {
            return {
                enforcedText: getMaskedText(text, maxCost),
                remainder: 0
            }
        }

        return {
            enforcedText: text,
            remainder: maxCost - textCost
        }
    }
}
