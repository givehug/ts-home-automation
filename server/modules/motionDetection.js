const {sendEmail} = require('./emailMessenger');
const {User} = require('./../models/user');
const {Settings} = require('./../models/settings');

async function notifyDetection(lastDetected) {
	let settings;

	try {
		settings = await Settings.find();
	} catch (error) {
		return console.error(error);
	}

	// send email to each user who has 'notifyOnMotionDetection' turned on in settings
	settings.forEach(async setting => {
		if (setting.userId && setting.settings.notifyOnMotionDetection) {
			try {
				const user = await User.findById(setting.userId);

				sendEmail({
					to: user.email,
					subject: 'Home Security Motion Detected',
					text: 'Motion Detected: ' + lastDetected, // TODO should be user location based
				});
			} catch (error) {
				return console.error(error);
			}
		}
	});
}

module.exports = {notifyDetection};
