import {writeAndTrackCost, eraseAndTrackCost, editAndTrackCost} from './text-processors';

const defaultValue = value => value === 0 ? value : value || 10;
const getText = paper => paper.getText();
const setText = (paper, text) => paper.setText(text);
const addEditIndex = (paper, index) => paper.addEditIndex(index);
const hasEditIndex = (paper, index) => paper.hasEditIndex(index);
const removeEditIndex = (paper, index) => paper.removeEditIndex(index); 

export class Pencil {
    constructor(config = {}) {
        const {pointDurability, length, eraserDurability} = config;

        this.pointDurability = defaultValue(pointDurability);;
        this.initialPointDurability = defaultValue(pointDurability);
        this.length = defaultValue(length);
        this.eraserDurability = defaultValue(eraserDurability);
    }

    write(paper, textToWrite) {
        const {processedText, remainder} = writeAndTrackCostHelper(textToWrite, this.pointDurability);
        
        this.pointDurability = remainder;
        setText(paper, getText(paper) + processedText);
    }

    sharpen() {
        if (this.length > 0) {
            this.pointDurability = this.initialPointDurability;
            this.length -= 1;
        }
    }

    erase(paper, textToErase) {
        const currentText = getText(paper);
        const {processedText, remainder, eraseIndex} = eraseAndTrackCost(currentText, textToErase, this.eraserDurability);

        this.eraserDurability = remainder;
        setText(paper, processedText);
        addEditIndex(paper, eraseIndex);
    }

    edit(paper, editText, editIndex) {
        if (!paper.hasEditIndex(editIndex)) {
            throw new Error('need to erase before you can edit');
        }

        const {processedText, remainder} = editAndTrackCost(paper.getText(), editIndex, editText, this.pointDurability);
        
        this.pointDurability = remainder;
        setText(paper, processedText);
        removeEditIndex(paper, editIndex);
    }
};

function writeAndTrackCostHelper(textToWrite, pointDurability) {
    return writeAndTrackCost(textToWrite, pointDurability, () => ' ');
}
