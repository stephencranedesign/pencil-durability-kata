import {TextMask} from './text-mask';

export class Pencil {
    constructor(config = {}) {
        const {pointDurability} = config;

        this.pointDurability = pointDurability || 10;
        this.length = 10;
        this.eraserDurability = 10;
    }

    write(paper, text) {
        const {enforcedText, remainder} = TextMask.enforceAndTrackCost(text, this.pointDurability);
        this.pointDurability = remainder;
        
        paper.setText(paper.getText() + enforcedText);
    }
};
