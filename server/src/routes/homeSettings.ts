import * as express from 'express';
import {authenticate} from '../middleware/authenticate';
import {HomeSettings} from '../models/homeSettings';

const router = express.Router();

router.use('/homeSettings', authenticate);
router.route('/homeSettings')
  // UPDATE HOME SETTINGS
  .patch(async (req, res) => {
    try {
      const hs = await HomeSettings.find();
      Object.assign(hs[0], req.body);
      await hs[0].save();
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(400);
    }
  });

export default router;
