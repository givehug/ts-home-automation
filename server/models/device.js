const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		minlength: 3,
		trim: true,
	},
	type: {
		type: String,
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
});

const Device = mongoose.model('Device', DeviceSchema);

module.exports = {Device};
