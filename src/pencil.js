import {TextMask} from './text-mask';

export class Pencil {
    constructor(config = {}) {
        const {pointDurability, length} = config;

        this.pointDurability = pointDurability || 10;
        this.initialPointDurability = pointDurability || 10;
        this.length = length || 10;
        this.eraserDurability = 10;
    }

    write(paper, text) {
        const {enforcedText, remainder} = TextMask.enforceAndTrackCost(text, this.pointDurability);
        this.pointDurability = remainder;
        
        paper.setText(paper.getText() + enforcedText);
    }

    sharpen() {
        if (this.length > 0) {
            this.pointDurability = this.initialPointDurability;
            this.length -= 1;
        }
    }
};
