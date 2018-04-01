import {Settings} from '../models/settings';
import {User} from '../models/user';
import {sendEmail} from './emailMessenger';

export async function notifyDetection(lastDetected) {
  let settings;

  try {
    settings = await Settings.find();
  } catch (error) {
    return console.error(error);
  }

  // send email to each user who has 'notifyOnMotionDetection' turned on in settings
  settings.forEach(async (setting) => {
    if (setting.userId && setting.settings.notifyOnMotionDetection) {
      try {
        const user = await User.findById(setting.userId);

        sendEmail({
          subject: 'Home Security Motion Detected',
          text: 'Motion Detected: ' + lastDetected, // TODO should be user location based
          to: user.email,
        });
      } catch (error) {
        return console.error(error);
      }
    }
  });
}
