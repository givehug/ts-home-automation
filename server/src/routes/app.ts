import * as express from 'express';
import {keyBy, pick} from 'lodash';
import mongoose from '../db/mongoose';
import {authenticate} from '../middleware/authenticate';
import {Device} from '../models/device'; 
import {Settings} from '../models/settings'; 
import {User} from '../models/user';

const userProps = ['name', 'email', '_id', 'admin'];
const deviceProps = ['name', 'type', '_id', 'description'];
const settingsProps = ['annyangActive', 'deviceIdentifiers', 'notifyOnMotionDetection'];

const router = express.Router();

router.use('/app', authenticate);
router.route('/app')
	// GET ALL APPLICATION DATA
	.get(async(req, res) => {
		try {
			// Get all required lists
			const users = await User.find();
			const settings = await Settings.find();
			const devices = await Device.find();

			// Map data
			const user = pick(req.user, userProps);
			const settingsMap = keyBy(settings, 'userId');
			const devicesMap = keyBy(devices.map(d => pick(d, deviceProps)), '_id');
			const usersMap = keyBy(users.map(u => Object.assign(
				pick(u, userProps),
				{deviceIdentifiers: settingsMap[u._id].deviceIdentifiers}
			)), '_id');
			const userSettings = pick(settingsMap[user._id], settingsProps);
			
			// Send
			res.send({
				devices: devicesMap,
				settings: userSettings,
				user,
				users: usersMap,
			});
		} catch (error) {
			res.status(400).send(error);
		}
	});

export default router;
