import {writeAndTrackCost} from './write-and-track-cost';

export const editAndTrackCost = (fullText, indexToEdit, editText, maxCost) => {
    const textBeforeEdit = fullText.substring(0, indexToEdit);
    const textAfterEdit = fullText.substring(indexToEdit + editText.length);
    const edit = constructEdit(fullText, indexToEdit, editText);
    const {processedText, remainder} = writeAndTrackCost(edit, maxCost, characterToUseWhenMaxCostExceeded(fullText, indexToEdit));

    return {
        processedText: textBeforeEdit + processedText + textAfterEdit,
        remainder
    }
};

function constructEdit(fullText, indexToEdit, editText) {
    const textToEdit = fullText.substring(indexToEdit).split('');
    
    for (let i=0; i < editText.length; i++) {
        const existingCharacter = textToEdit[i];
        const editCharacter = editText.charAt(i);

        isCollision(existingCharacter) ? textToEdit[i] = '@' : textToEdit[i] = editCharacter;
    }

    return textToEdit.slice(0, editText.length).join('');
}

function isCollision(character) {
    const isNewLine = /\n/.test(character);
    const isSpace = / /.test(character);

    return !isNewLine && !isSpace;
}

function characterToUseWhenMaxCostExceeded(fullText, indexToEdit) {
    return (i) => fullText.charAt(indexToEdit + i);
}
