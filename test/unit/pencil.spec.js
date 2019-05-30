import {expect} from 'chai';
import {Pencil} from '../../src/pencil';
import {Paper} from '../../src/paper';
import sinon from 'sinon';
import {TextMask} from '../../src/text-mask';

describe('Pencil', () => {
    let pencil;
    beforeEach(() => {
        sinon.stub(TextMask, 'enforceAndTrackCost');
    });

    afterEach(sinon.restore);

    describe('constructor', () => {
        describe('setting default properties', () => {
            beforeEach(() => {
                pencil = new Pencil();
            });
    
            it('should be an instance of the Pencil class', () => {
                expect(pencil).to.be.instanceOf(Pencil);
            });
    
            it('should set default properites', () => {
                expect(pencil).to.have.property('pointDurability', 10);
                expect(pencil).to.have.property('initialPointDurability', 10);
                expect(pencil).to.have.property('length', 10);
                expect(pencil).to.have.property('eraserDurability', 10);
            });
        });

        describe('when config has pointDurability', () => {
            let pointDurability;

            beforeEach(() => {
                pointDurability = chance.integer({min: 0, max: 100});
                pencil = new Pencil({pointDurability});
            });
    
            it('should set pointDurability', () => {
                expect(pencil).to.have.property('pointDurability', pointDurability);
            });

            it('should set initialPointDurability to the same value', () => {
                expect(pencil).to.have.property('initialPointDurability', pointDurability);
            });
        });

        describe('when config has length', () => {
            let length;

            beforeEach(() => {
                length = chance.integer({min: 0, max: 100});
                pencil = new Pencil({length});
            });
    
            it('should set pointDurability', () => {
                expect(pencil).to.have.property('length', length);
            });
        });
    });

    describe('write', () => {
        let givenText, givenPointDurability, paperStub, expectedTextMask;

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

    describe('sharpen', () => {
        let givenLength, givenInitialPointDurability;

        beforeEach(() => {
            pencil = new Pencil({});
        });

        describe('when pencil length is > 0', () => {
            beforeEach(() => {
                givenInitialPointDurability = chance.integer({min: 2, max: 100});
                givenLength = chance.integer({min: 2, max: 100});

                pencil.length = givenLength;
                pencil.initialPointDurability = givenInitialPointDurability;
                pencil.sharpen();
            });

            it('should reset pointDurability to initialPoint durability', () => {
                expect(pencil).to.have.property('pointDurability', givenInitialPointDurability);
            });

            it('should subtract 1 from length', () => {
                expect(pencil).to.have.property('length', givenLength - 1);
            });
        });

        describe('when pencil length === 0', () => {
            let givenPointDurability;

            beforeEach(() => {
                givenPointDurability = chance.integer({min: 2, max: 100});
                givenInitialPointDurability = chance.integer({min: 2, max: 100});
                givenLength = chance.integer({min: 2, max: 100});
                pencil.length = 0;
                pencil.initialPointDurability = givenInitialPointDurability;
                pencil.pointDurability = givenPointDurability;
                pencil.sharpen();
            });

            it('should not modify pointDurability', () => {
                expect(pencil).to.have.property('pointDurability', givenPointDurability);
            });
            
            it('should not modify length', () => {
                expect(pencil).to.have.property('length', 0);
            });
        });
    });
});