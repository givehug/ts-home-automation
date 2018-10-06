import * as express from 'express';
import {keyBy, pick} from 'lodash/fp';
import mongoose from '../db/mongoose';
import {authenticate} from '../middleware/authenticate';
import {Device} from '../models/device';
import {Settings} from '../models/settings';
import {HomeSettings} from '../models/homeSettings';
import {User} from '../models/user';
import getMapBy from '../../../common/utils/getMapBy';

import {UserData} from '../../../common/@types/store';

const userProps = ['name', 'email', '_id', 'admin'];
const deviceProps = ['name', 'type', '_id', 'description'];
const settingsProps = ['annyangActive', 'deviceIdentifiers', 'notifyOnMotionDetection'];
const homeSettingsProps = ['networkCustomNames'];

const router = express.Router();

router.use('/app', authenticate);
router.route('/app')
  // GET ALL APPLICATION DATA
  .get(async (req, res) => {
    try {
      const settingsMap = keyBy('userId', await Settings.find());
      const homeSettings = await HomeSettings.find();

      res.send({
        devices: getMapBy('_id', pick(deviceProps), await Device.find()),
        homeSettings: pick(homeSettingsProps, homeSettings[0]),
        settings: pick(settingsProps, settingsMap[req['user']._id]),
        user: pick(userProps, req['user']),
        users: getMapBy('_id', (u: UserData) => ({
          ...pick(userProps, u),
          deviceIdentifiers: settingsMap[u._id].deviceIdentifiers,
        }), await User.find()),
      });
    } catch (error) {
      res.status(400).send(error);
    }
  });

export default router;
