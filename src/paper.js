export class Paper {
    constructor() {
        this.text = null;
        this.editIndexes = new Set();
    }

    setText(text) {
        this.text = text;
    }

    getText() {
        return this.text;
    }

    addEditIndex(index) {
        this.editIndexes.add(index);
    }

    removeEditIndex(index) {
        this.editIndexes.delete(index);
    }

    hasEditIndex(index) {
        return this.editIndexes.has(index);
    }
}