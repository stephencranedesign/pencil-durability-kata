import {Paper} from '../../src/paper';
import * as textProcessors from '../../src/text-processors';
import {getWhiteSpaces, fail} from './helpers';
import proxyquire from 'proxyquire';

describe('Pencil', () => {
    let Pencil, pencil, paperStub, writeAndTrackCostStub, eraseAndTrackCostStub, editAndTrackCostStub;

    beforeEach(() => {
        writeAndTrackCostStub = sinon.stub();
        eraseAndTrackCostStub = sinon.stub();
        editAndTrackCostStub = sinon.stub();
        paperStub = sinon.createStubInstance(Paper);

        const MODULE = proxyquire('../../src/pencil', {
            './text-processors': {
                writeAndTrackCost: writeAndTrackCostStub,
                eraseAndTrackCost: eraseAndTrackCostStub,
                editAndTrackCost: editAndTrackCostStub
            }
        })

        Pencil = MODULE.Pencil;
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
                pointDurability = chance.integer({min: 1, max: 100});
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
                length = chance.integer({min: 1, max: 100});
                pencil = new Pencil({length});
            });
    
            it('should set length', () => {
                expect(pencil).to.have.property('length', length);
            });
        });

        describe('when config has eraserDurability', () => {
            let eraserDurability;

            beforeEach(() => {
                eraserDurability = chance.integer({min: 1, max: 100});
                pencil = new Pencil({eraserDurability});
            });
    
            it('should set eraserDurability', () => {
                expect(pencil).to.have.property('eraserDurability', eraserDurability);
            });
        });

        describe('when passed 0 for default properties', () => {
            beforeEach(() => {
                pencil = new Pencil({
                    pointDurability: 0,
                    length: 0,
                    eraserDurability: 0
                });
            });

            it('should not set properties to default values', () => {
                expect(pencil).to.have.property('pointDurability', 0);
                expect(pencil).to.have.property('initialPointDurability', 0);
                expect(pencil).to.have.property('length', 0);
                expect(pencil).to.have.property('eraserDurability', 0);
            });
        });
    });

    describe('write', () => {
        let givenText, givenPointDurability, getTextResponse, writeAndTrackCostResponse;

        beforeEach(() => {
            pencil = new Pencil();

            givenText = chance.string({length: 5});
            givenPointDurability = chance.integer({min: 0, max: 200});
            getTextResponse = chance.string();
            writeAndTrackCostResponse = {
                processedText: chance.string(),
                remainder: chance.integer({min: 0})
            };

            paperStub.getText.returns(getTextResponse);
            writeAndTrackCostStub.returns(writeAndTrackCostResponse);

            pencil.pointDurability = givenPointDurability;
            pencil.write(paperStub, givenText);
        });

        it('should call paper.getText', () => {
            expect(paperStub.getText).to.have.callCount(1);
            expect(paperStub.getText).to.be.calledWithExactly();
        });

        it('should call textProcessors.writeAndTrackCost with correctly', () => {
            expect(writeAndTrackCostStub).to.have.callCount(1);
            expect(writeAndTrackCostStub).to.be.calledWithMatch(givenText, givenPointDurability);
        });

        it('third argument should be a function that returns white space', () => {
            const thirdArgument = writeAndTrackCostStub.firstCall.args[2];
            const callsToMake = 2 + chance.d6();

            for (let i = i; i < callsToMake; i++) {
                expect(thirdArgument(i)).to.equal(' ');
            }
        });

        it('should set pointDurability to the remainder', () => {
            expect(pencil.pointDurability).to.equal(writeAndTrackCostResponse.remainder);
        });

        it('should call setText', () => {
            expect(paperStub.setText).to.have.callCount(1);
            expect(paperStub.setText).to.be.calledWithExactly(getTextResponse + writeAndTrackCostResponse.processedText);
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

    describe('erase', () => {
        let givenWord, givenEraserDurability, getTextResponse, eraseAndTrackCostResponse;

        beforeEach(() => {
            givenEraserDurability = chance.integer({min: 10});
            pencil = new Pencil({eraserDurability: givenEraserDurability});
            givenWord = chance.string();

            getTextResponse = chance.string();
            eraseAndTrackCostResponse = {
                processedText: chance.string(),
                remainer: chance.integer({min: 1}),
                eraseIndex: chance.integer({min: 1})
            };

            paperStub.getText.returns(getTextResponse);
            eraseAndTrackCostStub.returns(eraseAndTrackCostResponse);
            pencil.erase(paperStub, givenWord);
        });

        it('should call paper.getText', () => {
            expect(paperStub.getText).to.have.callCount(1);
            expect(paperStub.getText).to.be.calledWithExactly();
            expect(paperStub.getText).calledBefore(paperStub.setText);
        });

        it('should call the eraseAndTrackCost textProcessor', () => {
            expect(eraseAndTrackCostStub).to.have.callCount(1);
            expect(eraseAndTrackCostStub).to.be.calledWithExactly(getTextResponse, givenWord, givenEraserDurability);
            expect(eraseAndTrackCostStub).calledBefore(paperStub.setText);
        });

        it('should call paper.setText with the processedText', () => {
            expect(paperStub.setText).to.have.callCount(1);
            expect(paperStub.setText).to.be.calledWithExactly(eraseAndTrackCostResponse.processedText);
        });

        it('should set the remainer', () => {
            expect(pencil.eraserDurability).to.equal(eraseAndTrackCostResponse.remainder);
        });

        it('should call paper.addEditIndex', () => {
            expect(paperStub.addEditIndex).to.have.callCount(1);
            expect(paperStub.addEditIndex).to.be.calledWithExactly(eraseAndTrackCostResponse.eraseIndex);
            expect(paperStub.addEditIndex).calledAfter(paperStub.getText);
        });
    });

    describe('edit', () => {
        let givenEdit, givenEditIndex, givenPointDurability, getTextResponse, editAndTrackCostResponse;

        beforeEach(() => {
            pencil = new Pencil();

            givenEdit = chance.string({length: 20});
            givenEditIndex = chance.integer({min: 0, max: 50});
            givenPointDurability = chance.integer({min: 0, max: 200});
            getTextResponse = chance.string();
            editAndTrackCostResponse = {
                processedText: chance.string(),
                remainder: chance.integer({min: 0})
            };

            paperStub.getText.returns(getTextResponse);
            editAndTrackCostStub.returns(editAndTrackCostResponse);

            pencil.pointDurability = givenPointDurability;
        });

        describe('when paper has an edit at the given edit index', () => {
            beforeEach(() => {
                paperStub.hasEditIndex.returns(true);
                pencil.edit(paperStub, givenEdit, givenEditIndex);
            });

            it('should call paper.hasEditIndex', () => {
                expect(paperStub.hasEditIndex).to.have.callCount(1);
                expect(paperStub.hasEditIndex).to.be.calledWithExactly(givenEditIndex);
            });

            it('should call paper.hasEditIndex before making any other calls', () => {
                expect(paperStub.hasEditIndex).to.be.calledBefore(paperStub.getText);
                expect(paperStub.hasEditIndex).to.be.calledBefore(editAndTrackCostStub);
                expect(paperStub.hasEditIndex).to.be.calledBefore(paperStub.setText);
                expect(paperStub.hasEditIndex).to.be.calledBefore(paperStub.removeEditIndex);
            });

            it('should call paper.getText', () => {
                expect(paperStub.getText).to.have.callCount(1);
                expect(paperStub.getText).to.be.calledWithExactly();
            });
    
            it('should call textProcessors.editAndTrackCost with correctly', () => {
                expect(editAndTrackCostStub).to.have.callCount(1);
                expect(editAndTrackCostStub).to.be.calledWithMatch(getTextResponse, givenEditIndex, givenEdit, givenPointDurability);
            });
    
            it('should set pointDurability to the remainder', () => {
                expect(pencil.pointDurability).to.equal(editAndTrackCostResponse.remainder);
            });
    
            it('should call setText', () => {
                expect(paperStub.setText).to.have.callCount(1);
                expect(paperStub.setText).to.be.calledWithExactly(editAndTrackCostResponse.processedText);
            });
    
            it('should call removeEditIndex', () => {
                expect(paperStub.removeEditIndex).to.have.callCount(1);
                expect(paperStub.removeEditIndex).to.be.calledWithExactly(givenEditIndex);
            });
        });

        describe('when paper does not have an edit at the given edit index', () => {
            let action, expectedError;

            beforeEach(() => {
                paperStub.hasEditIndex.returns(false);
                action = () => pencil.edit(paperStub, givenEdit, givenEditIndex);
            });

            it('should throw error', () => {
                try {
                    action();
                    fail('should not have got here');
                } catch(err) {
                    expect(err.message).to.equal('need to erase before you can edit');
                }
            });

            it('should not make any calls', () => {
                expect(paperStub.getText).to.have.callCount(0);
                expect(editAndTrackCostStub).to.have.callCount(0);
                expect(paperStub.setText).to.have.callCount(0);
                expect(paperStub.removeEditIndex).to.have.callCount(0);
            });
        });
    });
});
