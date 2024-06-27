import * as mongoose from 'mongoose';

export const SampleSchema = new mongoose.Schema({
    timestamp: Number,
    planet: String,
    value: Number
});
