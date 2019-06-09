const WHITE_SPACE = ' ';

export const writeAndTrackCost = (text, maxCost, applyMaskAtIndex) => {
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
            const characterToAdd = applyMaskAtIndex(i);

            ensureOnlyOneCharacterAdded(characterToAdd);
            newText.push(characterToAdd);
        } else {
            newText.push(character);
        }
    }

    return {
        processedText: newText.join(''),
        remainder: costForText > maxCost ? 0 : maxCost - costForText
    }
}

function ensureOnlyOneCharacterAdded(characterToAdd) {
    if (characterToAdd.length > 1) {
        throw new Error('applyMaskAtIndex can not return more then one character');
    }
}

function unmaskableCharacter(character) {
    return /\n/.test(character) || / /.test(character);
}

function isUpperCase(character) {
    return /[A-Z]/.test(character);
}