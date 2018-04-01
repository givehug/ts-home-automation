import mongoose from '../db/mongoose';

const DeviceSchema = new mongoose.Schema({
  description: {
    trim: true,
    type: String,
  },
  name: {
    minlength: 3,
    required: true,
    trim: true,
    type: String,
    unique: true,
  },
  type: {
    trim: true,
    type: String,
  },
});

export const Device = mongoose.model('Device', DeviceSchema);
