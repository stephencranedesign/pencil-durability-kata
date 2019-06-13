import {writeAndTrackCost, eraseAndTrackCost, editAndTrackCost} from './text-processors';

export class Pencil {
    constructor(config = {}) {
        const {pointDurability, length, eraserDurability} = config;

        this.pointDurability = pointDurability || 10;
        this.initialPointDurability = pointDurability || 10;
        this.length = length || 10;
        this.eraserDurability = eraserDurability || 10;
    }

    write(paper, textToWrite) {
        const {processedText, remainder} = writeAndTrackCostHelper(textToWrite, this.pointDurability);
        
        this.pointDurability = remainder;
        paper.setText(paper.getText() + processedText);
    }

    sharpen() {
        if (this.length > 0) {
            this.pointDurability = this.initialPointDurability;
            this.length -= 1;
        }
    }

    erase(paper, textToErase) {
        const currentText = paper.getText();
        const {processedText, remainder, eraseIndex} = eraseAndTrackCost(currentText, textToErase, this.eraserDurability);

        this.eraserDurability = remainder;
        paper.setText(processedText);
        paper.addEditIndex(eraseIndex);
    }

    edit(paper, editText, editIndex) {
        if (!paper.hasEditIndex(editIndex)) {
            throw new Error('need to erase before you can edit');
        }

        const {processedText, remainder} = editAndTrackCost(paper.getText(), editIndex, editText, this.pointDurability);
        
        this.pointDurability = remainder;
        paper.setText(processedText);
        paper.removeEditIndex(editIndex);
    }
};

function writeAndTrackCostHelper(textToWrite, pointDurability) {
    return writeAndTrackCost(textToWrite, pointDurability, () => ' ');
}
