const messageToJSON = msg => {
	let message = [
		'',
		null,
	];

	try {
		message = JSON.parse(msg);
	} catch (e) {
		message[0] = msg;
	}

	return message;
};

const jsonToMessage = (type, data) => {
	if (!type) {
		return '';
	}

	return JSON.stringify(data === undefined ? [type] : [type, data]);
};

const genPass = () => {
	return Math
		.random()      // Generate random number, eg: 0.123456
		.toString(36)  // Convert  to base-36 : "0.4fzyo82mvyr"
		.slice(-8);    // Cut off last 8 characters : "yo82mvyr"
};

module.exports = {
	messageToJSON,
	jsonToMessage,
	genPass,
};
