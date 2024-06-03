import { Schema, model } from 'mongoose';

// Schema
const ContractSchema = new Schema({
  Name: { type: String, required: true }
}, { collection: 'contracts', usePushEach: true });

export default model('Contract', ContractSchema, 'contracts');

