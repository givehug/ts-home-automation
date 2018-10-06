import mongoose from '../db/mongoose';

const HomeSettingsSchema = new mongoose.Schema({
    networkCustomNames: {type: Object},
});

export const HomeSettings = mongoose.model('HomeSettings', HomeSettingsSchema);
