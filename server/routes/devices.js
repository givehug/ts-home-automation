const express = require('express');
const {ObjectID} = require('mongodb');
const {Device} = require('./../models/device');
const {authenticate} = require('./../middleware/authenticate');

const router = express.Router();

router.use('/devices', authenticate);
router.route('/devices')
	// GET ALL DEVICES
	.get(async(req, res) => {
		try {
			const devices = await Device.find();

			res.send({devices});
		} catch (error) {
			res.sendStatus(400);
		}
	})
	// CREATE NEW DEVICE
	.post(async(req, res) => {
		const device = new Device(req.body);

		try {
			const newDev = await device.save();

			res.send(newDev);
		} catch (error) {
			res.sendStatus(400);
		}
	});

router.route('/devices/:id')
	// UPDATE DEVICE DATA
	.patch(async(req, res) => {
		try {
			const device = await Device.findByIdAndUpdate(
				req.params.id,
				req.body,
				{new: true}
			);

			if (device) {
				res.send(device);
			} else {
				res.sendStatus(404);
			}
		} catch (error) {
			res.sendStatus(400);
		}
	})
	// DELETE DEVICE
	.delete(async(req, res) => {
		if (!ObjectID.isValid(req.params.id)) {
			res.sendStatus(404);
		}

		try {
			const device = await Device.findByIdAndRemove(req.params.id);

			if (device) {
				res.send({device});
			} else {
				res.sendStatus(404);
			}
		} catch (error) {
			res.sendStatus(400);
		}
	});

module.exports = router;
