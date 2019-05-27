import {expect} from 'chai';
import {Pencil} from '../../src/pencil';
import {Paper} from '../../src/paper';
import sinon from 'sinon';

const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseLetters = lowerCaseLetters.toUpperCase();
const FIVE_SPACES = '     ';
const NEW_LINE = '\n';
const WHITE_SPACE = ' ';

describe('Pencil', () => {
    afterEach(sinon.restore);

    describe('default constructor', () => {
        let pencil;

        describe('default constructor', () => {
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

        describe('constructor can set pointDurability', () => {
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
        let givenText, paperStub, pencil;

        beforeEach(() => {
            pencil = new Pencil();
            paperStub = sinon.createStubInstance(Paper);
        });

        describe('when paper has no text', () => {
            beforeEach(() => {
                givenText = chance.string({length: 5});
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
                givenText = chance.string({length: 5});
                expectedText = chance.string({length: 5});
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

    describe('pointDegredation', () => {
        let givenText, paperStub, pencil, pointDurability;

        describe('when writing text within the pointDurability limit', () => {
            beforeEach(() => {
                pointDurability = 100;
                pencil = new Pencil({pointDurability});
                paperStub = sinon.createStubInstance(Paper);
                paperStub.getText.returns('');
            });
    
            describe('AND handling lowercase letters', () => {
                beforeEach(() => {
                    givenText = chance.string({pool: lowerCaseLetters, length: 5});
                    pencil.write(paperStub, givenText);
                });
    
                it('should write all the characters', () => {
                    assertWhitespaceRespected(paperStub.setText, givenText);
                });

                it('should correctly track pointDurability', () => {
                    expect(pencil.pointDurability).to.equal(95);
                });
            });
    
            describe('AND handling uppercase letters', () => {
                beforeEach(() => {
                    givenText = chance.string({pool: upperCaseLetters, length: 5});
                    pencil.write(paperStub, givenText);
                });
    
                it('should write all the characters', () => {
                    assertWhitespaceRespected(paperStub.setText, givenText);
                });

                it('should correctly track pointDurability', () => {
                    expect(pencil.pointDurability).to.equal(90);
                });
            });

            describe('AND handling mixedcase letters', () => {
                beforeEach(() => {
                    const uppercase = chance.n(() => chance.character({pool: upperCaseLetters}), 3);
                    const lowercase = chance.n(() => chance.character({pool: lowerCaseLetters}), 3);
                    givenText = chance.shuffle([...uppercase, ...lowercase]).join('');
                    pencil.write(paperStub, givenText);
                });
    
                it('should write all the characters', () => {
                    assertWhitespaceRespected(paperStub.setText, givenText);
                });

                it('should correctly track pointDurability', () => {
                    expect(pencil.pointDurability).to.equal(91);
                });
            });

            describe('AND handling newlines', () => {
                beforeEach(() => {
                    const givenText1 = chance.string({pool: lowerCaseLetters, length: 5});
                    const givenText2 = chance.string({pool: lowerCaseLetters, length: 5});
                    
                    givenText =  NEW_LINE + givenText1 + NEW_LINE + givenText2 + NEW_LINE;
                    pencil.write(paperStub, givenText);
                });
    
                it('should write all the characters', () => {
                    assertWhitespaceRespected(paperStub.setText, givenText);
                });

                it('should correctly track pointDurability', () => {
                    expect(pencil.pointDurability).to.equal(90);
                });
            });

            describe('AND handling spaces', () => {
                beforeEach(() => {
                    const givenText1 = chance.string({pool: lowerCaseLetters, length: 5});
                    const givenText2 = chance.string({pool: lowerCaseLetters, length: 5});

                    givenText =  WHITE_SPACE + givenText1 + WHITE_SPACE + givenText2 + WHITE_SPACE;
                    pencil.write(paperStub, givenText);
                });
    
                it('should write all the characters', () => {
                    assertWhitespaceRespected(paperStub.setText, givenText);
                });

                it('should correctly track pointDurability', () => {
                    expect(pencil.pointDurability).to.equal(90);
                });
            });
        });

        describe('when writing text outside the pointDurability limit', () => {
            let actualText;

            beforeEach(() => {
                pointDurability = 5;
                pencil = new Pencil({pointDurability});
                paperStub = sinon.createStubInstance(Paper);
                paperStub.getText.returns('');
            });
    
            describe('AND handling lowercase letters', () => {
                beforeEach(() => {
                    givenText = chance.string({pool: lowerCaseLetters, length: 10});
                    actualText = givenText.substring(0, pointDurability) + getUnmaskableCharacters(5, WHITE_SPACE);
                    pencil.write(paperStub, givenText);
                });
    
                it('should write 5 characters & 5 white spaces', () => {
                    assertWhitespaceRespected(paperStub.setText, actualText);
                });

                it('should correctly track pointDurability', () => {
                    expect(pencil.pointDurability).to.equal(0);
                });
            });
    
            describe('AND handling uppercase letters', () => {
                beforeEach(() => {
                    givenText = chance.string({pool: upperCaseLetters, length: 10});
                    actualText = givenText.substring(0, 2) + getUnmaskableCharacters(8, WHITE_SPACE);
                    pencil.write(paperStub, givenText);
                });
    
                it('should only write 2 characters & 8 white spaces', () => {
                    assertWhitespaceRespected(paperStub.setText, actualText);
                });

                it('should correctly track pointDurability', () => {
                    expect(pencil.pointDurability).to.equal(0);
                });
            });

            describe('AND handling mixedcase letters', () => {
                beforeEach(() => {
                    const givenText1 = chance.character({pool: upperCaseLetters});
                    const givenText2 = chance.string({pool: lowerCaseLetters, length: 10});

                    givenText = givenText1 + givenText2;
                    actualText = givenText.substring(0, 4) + getUnmaskableCharacters(7, WHITE_SPACE);
                    pencil.write(paperStub, givenText);
                });
    
                it('should only write 4 characters & 7 white spaces', () => {
                    assertWhitespaceRespected(paperStub.setText, actualText);
                });

                it('should correctly track pointDurability', () => {
                    expect(pencil.pointDurability).to.equal(0);
                });
            });

            describe('AND handling newlines', () => {
                beforeEach(() => {
                    const givenText1 = chance.string({pool: lowerCaseLetters, length: 5});
                    const givenText2 = chance.string({pool: lowerCaseLetters, length: 5});
                    
                    givenText =  NEW_LINE + givenText1 + NEW_LINE + givenText2 + NEW_LINE;
                    actualText = NEW_LINE + givenText1 + NEW_LINE + getUnmaskableCharacters(5, WHITE_SPACE) + NEW_LINE;
                    pencil.write(paperStub, givenText);
                });
    
                it('should write all the characters', () => {
                    assertWhitespaceRespected(paperStub.setText, actualText);
                });

                it('should correctly track pointDurability', () => {
                    expect(pencil.pointDurability).to.equal(0);
                });
            });

            describe('AND handling spaces', () => {
                beforeEach(() => {
                    const givenText1 = chance.string({pool: lowerCaseLetters, length: 5});
                    const givenText2 = chance.string({pool: lowerCaseLetters, length: 5});

                    givenText =  WHITE_SPACE + givenText1 + WHITE_SPACE + givenText2 + WHITE_SPACE;
                    actualText = WHITE_SPACE + givenText1 + getUnmaskableCharacters(7, WHITE_SPACE);
                    pencil.write(paperStub, givenText);
                });
    
                it('should write all the characters', () => {
                    assertWhitespaceRespected(paperStub.setText, actualText);
                });

                it('should correctly track pointDurability', () => {
                    expect(pencil.pointDurability).to.equal(0);
                });
            });
        });
    });

    function assertWhitespaceRespected(stub, actualText) {
        expect(stub.firstCall.args).to.deep.equal([actualText]);
    }

    function getUnmaskableCharacters(number, character) {
        return Array(number + 1).join(character);
    }
});
