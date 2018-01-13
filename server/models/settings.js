const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	settings: {
		annyangActive: {
			type: Boolean,
			required: true,
			default: false,
		},
		notifyOnMotionDetection: {
			type: Boolean,
			default: false,
		},
	},
});

const Settings = mongoose.model('Settings', SettingsSchema);

module.exports = {Settings};
