const express = require('express');
const pick = require('lodash/pick');
const {Settings} = require('./../models/settings');
const {authenticate} = require('./../middleware/authenticate');

const router = express.Router();

router.use('/settings', authenticate);
router.route('/settings')
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
