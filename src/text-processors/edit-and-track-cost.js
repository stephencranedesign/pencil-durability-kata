import {writeAndTrackCost} from './write-and-track-cost';

export const editAndTrackCost = (fullText, indexToEdit, editText, maxCost) => {
    const textBeforeEdit = fullText.substring(0, indexToEdit);
    const edit = constructEdit(fullText, indexToEdit, editText);
    const {processedText, remainder} = writeAndTrackCost(edit, maxCost, getCharacterWhenMaxCostExceeded(fullText, indexToEdit));
    const textAfterEdit = fullText.substring(indexToEdit + editText.length);

    return {
        processedText: textBeforeEdit + processedText + textAfterEdit,
        remainder
    }
};

function constructEdit(fullText, indexToEdit, editText) {
    const textToEdit = fullText.substring(indexToEdit).split('');
    
    editText.split('').forEach((editCharacter, i) => {
        const existingCharacter = textToEdit[i];

        isCollision(existingCharacter) ? textToEdit[i] = '@' : textToEdit[i] = editCharacter;
    });

    return textToEdit.slice(0, editText.length).join('');
}

function isCollision(character) {
    const isNewLine = /\n/.test(character);
    const isSpace = / /.test(character);

    return !isNewLine && !isSpace;
}

function getCharacterWhenMaxCostExceeded(fullText, indexToEdit) {
    return (i) => fullText.charAt(indexToEdit + i);
}
