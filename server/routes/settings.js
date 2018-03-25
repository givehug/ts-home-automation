const express = require('express');
const {Settings} = require('./../models/settings');
const {authenticate} = require('./../middleware/authenticate');

const router = express.Router();

router.use('/settings', authenticate);
router.route('/settings')
	// GET USER SETTINGS
	.get(async(req, res) => {
		try {
			const settings = await Settings.findOne({userId: req.user._id});

			if (settings) {
				res.send(settings);
			} else {
				const newSettings = new Settings({userId: req.user._id});
				const doc = await newSettings.save();

				res.send(doc);
			}
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
