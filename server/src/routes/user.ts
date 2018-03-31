import * as express from 'express';
import {pick} from 'lodash';
import genPass from '../../../common/utils/genPass';
import mongoose from './../db/mongoose';
import {authenticate} from './../middleware/authenticate';
import {Settings} from './../models/settings'; 
import {checkPassword, User} from './../models/user';
import {sendEmail} from './../modules/emailMessenger';

const userPropsToUpdate = ['name', 'email', 'password'];

const router = express.Router();

router.use('/users', authenticate);
router.route('/users')
	// CREATE NEW USER (by admin)
	.post(async(req, res) => {
		// Comment this out and disable auth to easily add initial admin user
		if (!req.user.admin) {
			res.sendStatus(401);

			return;
		}

		const password = genPass();
		const {name, email} = req.body;
		const user = new User({
			email,
			name,
			password,
		});
		const settings = new Settings({userId: user._id});

		try {
			await user.save();
			await settings.save();

			// send email invitation
			sendEmail({
				subject: 'Home Automation Invitation',
				text: `
					${name}, you have been invited to Home Automation dashboard. \n
					Your temporary password is: ${password} \n
					Update it as son as you sign in. \n
				`,
				to: email,
			});

			res.send(user._id);
		} catch (error) {
			res.sendStatus(400);
		}
	});

router.use('/users/:id', authenticate);
router.route('/users/:id')
	// DELETE USER (by admin)
	.delete(async(req, res) => {
		if (!req.user.admin) {
			res.sendStatus(401);

			return;
		}

		try {
			const user = await User.findById(req.params.id);

			if (user.admin) {
				res.sendStatus(401);

				return;
			}

			await Settings.findByIdAndRemove(req.params.id);
			await user.remove();

			res.sendStatus(200);
		} catch (error) {
			res.sendStatus(400);
		}
	});

router.use('/users/me', authenticate);
router.route('/users/me')
	// UPDATE USER DATA
	.patch(async(req, res) => {
		const update = pick(req.body.update, userPropsToUpdate);

		// overwrite user data props
		for (const prop in update) {
			// update password
			if (prop === 'password') { 
				if (
					req.body.update.confirmPassword // confirmPassword provided
					&& req.body.update.oldPassword // old password provided
					&& update.password === req.body.update.confirmPassword // confirmed password correctly
					&& checkPassword(req.body.update.oldPassword, req.user.password) // old password check passed
				) {
					req.user.password = update.password;
				}
			} else {
				req.user[prop] = update[prop];
			}
		}

		try {
			await req.user.save();
			res.sendStatus(200);
		} catch (error) {
			res.status(400).send(error);
		}
	});

router.route('/users/me/token')
	// LOG OUT
	.delete(async(req, res) => {
		try {
			req.user.removeToken(req.headers['x-auth']);
			res.sendStatus(200);
		} catch (error) {
			res.sendStatus(400);
		}
	});

router.route('/login')
	// LOG IN
	.post(async(req, res) => {
		try {
			const user = await User.findByCredential(req.body.email, req.body.password);
			const token = await user.generateAuthToken();

			res.header('x-auth', token).sendStatus(200);
		} catch (error) {
			res.status(400).send(error);
		}
	});

export default router;
