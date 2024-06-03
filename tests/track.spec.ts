import Track from '../models/Track';
import { Document } from 'mongoose';


describe("Track Tests", () => {
  it("should save when Title and ISRC populated", () => {

    const track: Document = new Track({
      Title: 'New Track',
      Version: '',
      Artist: '',
      ISRC: 'PLine',
      PLine: '',
      Aliases: []
    });

    const err = track.validateSync();

    assert.equal(err, null);
  });
});
