/**
 * Devices webSocket commands
 */

const keyBy = require('lodash/keyBy');

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

const byKey = keyBy(commands, 'key');
const byTitle = keyBy(commands, 'title');

module.exports = {
	byKey,
	byTitle,
};
