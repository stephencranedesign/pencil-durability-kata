import {Paper} from '../../src/paper';
import {Pencil} from '../../src/pencil';
import Chance from 'chance';
import {expect} from 'chai';

const chance = new Chance();
const NEW_LINE = '\n';

describe('Pencil Durability Kata Acceptance Tests', () => {
    let pencil, paper, givenText, expectedText;

    beforeEach(() => {
        paper = new Paper();
    });

    describe('write', () => {
        let givenTextToAdd;

        beforeEach(() => {
            pencil = new Pencil({pointDurability: 50});

            givenText = 'She sells sea shells';
            givenTextToAdd = ' down by the sea shore';
            expectedText = givenText + givenTextToAdd;

            paper.setText(givenText);
            pencil.write(paper, givenTextToAdd);
        });

        it('should add text to the paper', () => {
            expect(paper.getText()).to.equal(expectedText);
        });
    });

    describe('Point Degradation', () => {
        let givenTextToAdd;

        describe('when not dealing with capitol letters', () => {
            beforeEach(() => {
                pencil = new Pencil({pointDurability: 15});
    
                givenText = 'She sells sea shells';
                givenTextToAdd = ' down by the sea shore';
                expectedText = givenText + ' down by the sea sho  ';
    
                paper.setText(givenText);
                pencil.write(paper, givenTextToAdd);
            });
    
            it('should add text to the paper', () => {
                expect(paper.getText()).to.equal(expectedText);
            });
        });

        describe('when dealing with capitol letters', () => {
            beforeEach(() => {
                pencil = new Pencil({pointDurability: 15});
    
                givenText = 'She sells sea shells';
                givenTextToAdd = ' Down by the Sea Shore';
                expectedText = givenText + ' Down by the Sea      ';
    
                paper.setText(givenText);
                pencil.write(paper, givenTextToAdd);
            });
    
            it('should add text to the paper', () => {
                expect(paper.getText()).to.equal(expectedText);
            });
        });

        describe('when dealing with new lines', () => {
            beforeEach(() => {
                pencil = new Pencil({pointDurability: 15});
    
                givenText = 'She sells sea shells';
                givenTextToAdd = ` down ${NEW_LINE} by the ${NEW_LINE} sea shore ${NEW_LINE}`;
                expectedText = givenText + ` down ${NEW_LINE} by the ${NEW_LINE} sea sho   ${NEW_LINE}`;
    
                paper.setText(givenText);
                pencil.write(paper, givenTextToAdd);
            });
    
            it('should add text to the paper', () => {
                expect(paper.getText()).to.equal(expectedText);
            });
        });
    });

    describe('Erase', () => {
        let textToErase, expectedTextFirstCall, expectedTextSecondCall, actualTextFirstCall, actualTextSecondCall;

        beforeEach(() => {
            pencil = new Pencil({pointDurability: 100});

            givenText = 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?';
            textToErase = 'chuck';
            expectedTextFirstCall = 'How much wood would a woodchuck chuck if a woodchuck could       wood?';
            expectedTextSecondCall = 'How much wood would a woodchuck chuck if a wood      could       wood?';

            paper.setText(givenText);

            pencil.erase(paper, textToErase);
            actualTextFirstCall = paper.getText();

            pencil.erase(paper, textToErase);
            actualTextSecondCall = paper.getText();
        });

        it('should delete the last occurance of the text', () => {
            expect(actualTextFirstCall).to.equal(expectedTextFirstCall);
        });

        it('should delete the last occurance of the text', () => {
            expect(actualTextSecondCall).to.equal(expectedTextSecondCall);
        });
    });

    describe('Eraser Degradation', () => {
        let textToErase;

        beforeEach(() => {
            pencil = new Pencil({eraserDurability: 3});

            givenText = 'Buffalo Bill';
            textToErase = 'Bill';
            expectedText = 'Buffalo B   ';

            paper.setText(givenText);
            pencil.erase(paper, textToErase);
        });

        it('should not erase if eraserDurability has reached 0', () => {
            expect(paper.getText()).to.equal(expectedText);
        });
    });

    describe('Editing', () => {
        let givenEditIndex, givenTextToAdd;

        describe('when there are no character collisions', () => {
            beforeEach(() => {
                pencil = new Pencil({pointDurability: 15});
    
                givenText = 'An       a day keeps the doctor away';
                givenTextToAdd = 'onion';
                givenEditIndex = 3;
                expectedText = 'An onion a day keeps the doctor away';
    
                paper.addEditIndex(givenEditIndex);
                paper.setText(givenText);
                pencil.edit(paper, givenTextToAdd, givenEditIndex);
            });
    
            it('should add text to the paper', () => {
                expect(paper.getText()).to.equal(expectedText);
            });
        });

        describe('when there are character collisions', () => {
            beforeEach(() => {
                pencil = new Pencil({pointDurability: 15});
    
                givenText = 'An       a day keeps the doctor away';
                givenTextToAdd = 'artichoke';
                givenEditIndex = 3;
                expectedText = 'An artich@k@ay keeps the doctor away';
    
                paper.addEditIndex(givenEditIndex);
                paper.setText(givenText);
                pencil.edit(paper, givenTextToAdd, givenEditIndex);
            });
    
            it('should mask character collisions with @', () => {
                expect(paper.getText()).to.equal(expectedText);
            });
        });
    });
});