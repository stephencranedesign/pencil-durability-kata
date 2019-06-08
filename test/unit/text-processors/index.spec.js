import {writeAndTrackCost} from '../../../src/text-processors/write-and-track-cost';
import {eraseAndTrackCost} from '../../../src/text-processors/erase-and-track-cost';
import * as textProcessors from '../../../src/text-processors';

describe('Text Processors: index', () => {
    it('should export correct functions', () => {
        expect(textProcessors.writeAndTrackCost).to.equal(writeAndTrackCost);
        expect(textProcessors.eraseAndTrackCost).to.equal(eraseAndTrackCost);
    });
});