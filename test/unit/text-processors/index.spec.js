import {writeAndTrackCost} from '../../../src/text-processors/write-and-track-cost';
import * as textProcessors from '../../../src/text-processors';
import {expect} from 'chai';

describe('Text Processors: index', () => {
    it('should export correct functions', () => {
        expect(textProcessors.writeAndTrackCost).to.equal(writeAndTrackCost);
    });
});