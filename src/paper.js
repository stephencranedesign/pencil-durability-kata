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

    addEdit(index) {
        this.editIndexes.add(index);
    }

    removeEdit(index) {
        this.editIndexes.delete(index);
    }

    canEditAtIndex(index) {
        return this.editIndexes.has(index);
    }
}