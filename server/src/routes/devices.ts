import * as express from 'express';
import {ObjectID} from 'mongodb';
import {authenticate} from '../middleware/authenticate';
import {Device} from '../models/device';

const router = express.Router();

router.use('/devices', authenticate);
router.route('/devices')
  // CREATE NEW DEVICE
  .post(async (req, res) => {
    const device = new Device(req.body);

    try {
      const newDev = await device.save();

      res.send(newDev);
    } catch (error) {
      res.sendStatus(400);
    }
  });

router.route('/devices/:id')
  // UPDATE DEVICE DATA
  .patch(async (req, res) => {
    try {
      const device = await Device.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true},
      );

      if (device) {
        res.send(device);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      res.sendStatus(400);
    }
  })
  // DELETE DEVICE
  .delete(async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
      res.sendStatus(404);
    }

    try {
      const device = await Device.findByIdAndRemove(req.params.id);

      if (device) {
        res.send({device});
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      res.sendStatus(400);
    }
  });

export default router;
