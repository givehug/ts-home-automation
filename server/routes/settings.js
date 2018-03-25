const express = require('express');
const pick = require('lodash/pick');
const {Settings} = require('./../models/settings');
const {authenticate} = require('./../middleware/authenticate');

const settingsProps = ['annyangActive', 'deviceIdentifiers', 'notifyOnMotionDetection'];

const router = express.Router();

router.use('/settings', authenticate);
router.route('/settings')
	// GET USER SETTINGS
	.get(async(req, res) => {
		let settings;

		try {
			settings = await Settings.findOne({userId: req.user._id});

			if (!settings) {
				const newSettings = new Settings({userId: req.user._id});
				settings = await newSettings.save();
			}
				
			res.send(pick(settings, settingsProps));
		} catch (error) {
			res.sendStatus(400);
		}
	})
	// UPDATE USER SETTINGS
	.patch(async(req, res) => {
		const query = {userId: req.user._id};
		const update = req.body;
		const options = {
			upsert: true,
			new: true,
			setDefaultsOnInsert: true,
		};

		try {
			await Settings.findOneAndUpdate(query, update, options);

			res.sendStatus(200);
		} catch (error) {
			res.sendStatus(400);
		}
	});

module.exports = router;
