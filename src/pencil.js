import {writeAndTrackCost} from './text-processors';

export class Pencil {
    constructor(config = {}) {
        const {pointDurability, length} = config;

        this.pointDurability = pointDurability || 10;
        this.initialPointDurability = pointDurability || 10;
        this.length = length || 10;
        this.eraserDurability = 10;
    }

    write(paper, textToWrite) {
        const {processedText, remainder} = writeAndTrackCost(textToWrite, this.pointDurability);
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
        const lastIndex = currentText.lastIndexOf(textToErase);
        const modifiedText = currentText.slice(0, lastIndex) +
            getWhiteSpaces(textToErase.length) +
            currentText.slice(lastIndex + textToErase.length);

        paper.setText(modifiedText);
    }
};

function getWhiteSpaces(number) {
    return Array(number + 1).join(' ');
}
