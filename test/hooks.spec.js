import chai from 'chai';
import sinonChai from 'sinon-chai';
import Chance from 'chance';

const chance = new Chance();

chai.should();
chai.use(sinonChai);
global.chance = chance;

chance.array = () => chance.n(chance.string, chance.integer({min: 1, max: 20}));
chance.object = () => Array(chance.d20() + 1).fill().reduce((acc, curr) => ({
    ...acc,
    [chance.string()]: chance.string()
}), {});
