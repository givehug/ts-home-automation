/**
 * Devices webSocket commands
 */

import {keyBy} from 'lodash';

const commands = [
  {
    key: 'takePicture',
    title: 'take picture',
  },
  {
    key: 'toggleDetection',
    title: 'toggle detection',
  },
  {
    key: 'deletePictures',
    title: 'delete pictures',
  },
  {
    key: 'togglePirWhenNobodyHome',
    title: 'turn detection on when nobody home',
  },
  {
    key: 'setLed',
    title: 'turn LED',
  },
];

const byKey = keyBy(commands, 'key');
const byTitle = keyBy(commands, 'title');

export default {
  byKey,
  byTitle,
};
