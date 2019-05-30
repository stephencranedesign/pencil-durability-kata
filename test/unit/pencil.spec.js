import {expect} from 'chai';
import {Pencil} from '../../src/pencil';
import {Paper} from '../../src/paper';
import sinon from 'sinon';
import {TextMask} from '../../src/text-mask';

describe('Pencil', () => {
    beforeEach(() => {
        sinon.stub(TextMask, 'enforceAndTrackCost');
    });

    afterEach(sinon.restore);

    describe('constructor', () => {
        let pencil;

        describe('default config', () => {
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

        describe('config can set pointDurability', () => {
            let pointDurability;

            beforeEach(() => {
                pointDurability = chance.integer({min: 0, max: 100});
                pencil = new Pencil({pointDurability});
            });
    
            it('should set pointDurability', () => {
                expect(pencil).to.have.property('pointDurability', pointDurability);
            });
        });
    });

    describe('write', () => {
        let givenText, givenPointDurability, paperStub, pencil, expectedTextMask;

        beforeEach(() => {
            pencil = new Pencil();
            paperStub = sinon.createStubInstance(Paper);
        });

        describe('common functionality', () => {
            beforeEach(() => {
                givenText = chance.string({length: 5});
                givenPointDurability = chance.integer({min: 0, max: 200});
                expectedTextMask = {
                    enforcedText: chance.string(),
                    remainder: chance.integer({min: 0})
                };

                paperStub.getText.returns('');
                TextMask.enforceAndTrackCost.returns(expectedTextMask);

                pencil.pointDurability = givenPointDurability;
                pencil.write(paperStub, givenText);
            });

            it('should call paper.getText', () => {
                expect(paperStub.getText).to.have.callCount(1);
                expect(paperStub.getText).to.be.calledWithExactly();
            });
    
            it('should call TextMask.enforceAndTrackCost', () => {
                expect(TextMask.enforceAndTrackCost).to.have.callCount(1);
                expect(TextMask.enforceAndTrackCost).to.be.calledWithExactly(givenText, givenPointDurability);
            });
    
            it('should set pointDurability to the remainder', () => {
                expect(pencil.pointDurability).to.equal(expectedTextMask.remainder);
            });
        });

        describe('when paper has no text', () => {
            beforeEach(() => {
                expectedTextMask = {
                    enforcedText: chance.string(),
                    remainder: chance.integer({min: 0})
                };

                paperStub.getText.returns('');
                TextMask.enforceAndTrackCost.returns(expectedTextMask);

                pencil.write(paperStub, givenText);
            });

            it('should call setText with givenText', () => {
                expect(paperStub.setText).to.have.callCount(1);
                expect(paperStub.setText).to.be.calledWithExactly(expectedTextMask.enforcedText);
            });
        });

        describe('when paper has text', () => {
            let expectedText;

            beforeEach(() => {
                expectedText = chance.string({length: 5});
                expectedTextMask = {
                    enforcedText: chance.string(),
                    remainder: chance.integer({min: 0})
                };

                paperStub.getText.returns(expectedText);
                TextMask.enforceAndTrackCost.returns(expectedTextMask);

                pencil.write(paperStub, givenText);
            });

            it('should call setText with givenText', () => {
                expect(paperStub.setText).to.have.callCount(1);
                expect(paperStub.setText).to.be.calledWithExactly(expectedText + expectedTextMask.enforcedText);
            });
        });
    });
});