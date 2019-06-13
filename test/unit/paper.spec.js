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
            expect(paper.editIndexes).to.instanceOf(Set);
            expect(paper.editIndexes.size).to.equal(0);
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

    describe('addEditIndex', () => {
        let paper, givenIndex;

        beforeEach(() => {
            givenIndex = chance.integer({min: 0});
            paper = new Paper();
            paper.addEditIndex(givenIndex);
        });

        it('should add index', () => {
            expect(paper.editIndexes.has(givenIndex)).to.equal(true);
        });
    });

    describe('removeEditIndex', () => {
        let paper, givenIndex;

        beforeEach(() => {
            givenIndex = chance.integer({min: 0});
            paper = new Paper();
            paper.addEditIndex(givenIndex);
            paper.removeEditIndex(givenIndex);
        });

        it('should remove index', () => {
            expect(paper.editIndexes.has(givenIndex)).to.equal(false);
        });
    });

    describe('hasEditIndex', () => {
        let paper, givenIndex, result;

        describe('when an index is available for editing', () => {
            beforeEach(() => {
                givenIndex = chance.integer({min: 0});
                paper = new Paper();
                paper.addEditIndex(givenIndex);
                result = paper.hasEditIndex(givenIndex);
            });
    
            it('should return true', () => {
                expect(result).to.equal(true);
            });
        });

        describe('when an index is unavailable for editing', () => {
            beforeEach(() => {
                givenIndex = chance.integer({min: 0});
                paper = new Paper();
                result = paper.hasEditIndex(givenIndex);
            });
    
            it('should return false', () => {
                expect(result).to.equal(false);
            });
        });
    });
});