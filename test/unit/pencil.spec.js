import {expect} from 'chai';
import {Pencil} from '../../src/pencil';
import {Paper} from '../../src/paper';
import sinon from 'sinon';

describe('Pencil', () => {
    afterEach(sinon.restore);

    describe('constructor', () => {
        let pencil;

        beforeEach(() => {
            pencil = new Pencil();
        });

        it('should be an instance of the Pencil class', () => {
            expect(pencil).to.be.instanceOf(Pencil);
        });

        it('should set properites', () => {
            expect(pencil).to.have.property('pointDurability', 10);
            expect(pencil).to.have.property('length', 10);
            expect(pencil).to.have.property('eraserDurability', 10);
        });
    });

    describe('write', () => {
        let paperStub, givenText, pencil;

        beforeEach(() => {
            pencil = new Pencil();
            paperStub = sinon.createStubInstance(Paper);
        });

        describe('when paper has no text', () => {
            beforeEach(() => {
                givenText = chance.string();
                paperStub.getText.returns('');
                pencil.write(paperStub, givenText);
            });

            it('should call paper.getText', () => {
                expect(paperStub.getText).to.have.callCount(1);
            });

            it('should call setText with givenText', () => {
                expect(paperStub.setText).to.have.callCount(1);
                expect(paperStub.setText).to.be.calledWithExactly(givenText);
            });
        });

        describe('when paper has text', () => {
            let expectedText;

            beforeEach(() => {
                givenText = chance.string();
                expectedText = chance.string();
                paperStub.getText.returns(expectedText);
                pencil.write(paperStub, givenText);
            });

            it('should call paper.getText', () => {
                expect(paperStub.getText).to.have.callCount(1);
            });

            it('should call setText with givenText', () => {
                expect(paperStub.setText).to.have.callCount(1);
                expect(paperStub.setText).to.be.calledWithExactly(expectedText+givenText);
            });
        });
    });
});
