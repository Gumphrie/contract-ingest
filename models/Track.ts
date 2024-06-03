import { Schema, model, Document } from 'mongoose';

interface ITrack extends Document {
  Title: string;
  Version?: string;
  Artist?: string;
  ISRC: string,
  PLine?: String,
  Aliases?: [String],
  ContractID?: Schema.Types.ObjectId
}

// Schema
const TrackSchema = new Schema({
  Title: { type: String, required: true },
  Version: String,
  Artist: String,
  ISRC: { type: String, required: true },
  PLine: String,
  Aliases: [String],
  ContractID: Schema.Types.ObjectId
}, { collection: 'tracks', usePushEach: true });

export default model<ITrack>('Track', TrackSchema, 'tracks');
