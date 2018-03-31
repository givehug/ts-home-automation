import mongoose from '../db/mongoose';

const SettingsSchema = new mongoose.Schema({
	annyangActive: {
		default: false,
		required: true,
		type: Boolean,
	},
	deviceIdentifiers: [{type: String}],
	notifyOnMotionDetection: {
		default: false,
		type: Boolean,
	},
	userId: {
		required: true,
		type: String,
	},
});

export const Settings = mongoose.model('Settings', SettingsSchema);
