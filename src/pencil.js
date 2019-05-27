const WHITE_SPACE = ' ';

export class Pencil {
    constructor(config = {}) {
        const {pointDurability} = config;

        this.pointDurability = pointDurability || 10;
        this.length = 10;
        this.eraserDurability = 10;
    }

    write(paper, text) {
        const modifiedText = enforcePointDegredation(this, text);

        paper.setText(paper.getText() + modifiedText);
    }
};

function getTextCost(text) {
    const charactersWithCost = text.replace(/\n/g, '').replace(/ /g, '');
    const uppercase = charactersWithCost.replace(/[^A-Z]/g, '').length;
    const lowercase = Math.abs(charactersWithCost.length - uppercase);
    const textCost = uppercase*2 + lowercase;

    return textCost;
}

function enforcePointDegredation(pencil, text) {
    const textCost = getTextCost(text);

    if (pencil.pointDurability < textCost) {
        const maskedText = getMaskedText(text, pencil.pointDurability);

        pencil.pointDurability = 0;
        return maskedText;
    }

    pencil.pointDurability = pencil.pointDurability - textCost;

    return text;
}

function getMaskedText(text, currPointDurability) {
    let cost = 0,
        newText = [];

    for (var i = 0; i < text.length; i++) {
        const character = text.charAt(i);

        if (unmaskableCharacter(character)) {
            newText.push(character);
            continue;
        }

        isUpperCase(character) ? cost += 2 : cost += 1;

        if (cost > currPointDurability) {
            newText.push(WHITE_SPACE);
        } else {
            newText.push(character);
        }
    }

    return newText.join('');
}

function unmaskableCharacter(character) {
    return /\n/.test(character) || / /.test(character);
}

function isUpperCase(character) {
    return /[A-Z]/.test(character);
}