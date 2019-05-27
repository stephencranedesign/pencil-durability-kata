import chai from 'chai';
import sinonChai from 'sinon-chai';
import Chance from 'chance';

const chance = new Chance();

chai.should();
chai.use(sinonChai);
global.chance = chance;
