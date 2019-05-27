export class Pencil {
    constructor() {
        this.pointDurability = 10;
        this.length = 10;
        this.eraserDurability = 10;
    }

    write(paper, text) {
        paper.setText(paper.getText() + text);
    }
};