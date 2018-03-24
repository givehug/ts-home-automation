/**
 * Commands state stores unique keys of webSocket commands that are sent to devices
 */

const byKey = {
	'takePicture': {
		key: 'takePicture',
		title: 'take picture',
	},
	'toggleDetection': {
		key: 'toggleDetection',
		title: 'toggle detection',
	},
	'deletePictures': {
		key: 'deletePictures',
		title: 'delete pictures',
	},
	'toggleDetectionWhenNobodyHome': {
		key: 'toggleDetectionWhenNobodyHome',
		title: 'turn detection on when nobody home',
	},
	'setLed': {
		key: 'setLed',
		title: 'turn LED',
	},
};

const byTitle = Object.values(byKey)
	.reduce((allCommandsMap, command) => Object.assign(
		{},
		allCommandsMap,
		{[command.title]: command}
	), {});

const state = {
	byKey,
	byTitle,
};

export default {state};
