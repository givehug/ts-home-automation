import * as express from 'express';
import {authenticate} from '../middleware/authenticate';
import {Settings} from '../models/settings';

const router = express.Router();

router.use('/settings', authenticate);
router.route('/settings')
  // UPDATE USER SETTINGS
  .patch(async (req, res) => {
    const query = {userId: req['user']._id};
    const update = req.body;
    const options = {
      new: true,
      setDefaultsOnInsert: true,
      upsert: true,
    };

    try {
      await Settings.findOneAndUpdate(query, update, options);

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(400);
    }
  });

export default router;
