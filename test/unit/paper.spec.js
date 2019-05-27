import {expect} from 'chai';
import {Paper} from '../../src/paper';

describe('Paper class', () => {
    describe('constructor', () => {
        let paper;

        beforeEach(() => {
            paper = new Paper();
        });

        it('should be an instance of the Paper class', () => {
            expect(paper).to.be.instanceOf(Paper);
        });

        it('should set properties', () => {
            expect(paper).to.have.property('text', null);
        });
    });

    describe('setText', () => {
        let paper, givenText;

        beforeEach(() => {
            givenText = chance.string();
            paper = new Paper();
        });

        it('should have method', () => {
            expect(paper).to.have.property('setText');
        });

        it('should set text property', () => {
            paper.setText(givenText);
            expect(paper.text).to.equal(givenText);
        });
    });

    describe('getText', () => {
        let paper, givenText;

        beforeEach(() => {
            givenText = chance.string();
            paper = new Paper();
            paper.setText(givenText);
        });

        it('should have method', () => {
            expect(paper).to.have.property('getText');
        });

        it('should get text property', () => {
            expect(paper.getText()).to.equal(givenText);
        });
    });
});