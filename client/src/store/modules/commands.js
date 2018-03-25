/**
 * Commands state stores unique keys of webSocket commands that are sent to devices
 */

 import keyBy from 'lodash/keyBy';

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
		key: 'toggleDetectionWhenNobodyHome',
		title: 'turn detection on when nobody home',
	},
	{
		key: 'setLed',
		title: 'turn LED',
	},
];

const state = {
	byKey: keyBy(commands, 'key'),
	byTitle: keyBy(commands, 'title'),
};

export default {state};
