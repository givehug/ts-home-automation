// @flow
export const messageToJSON = (msg: string): WsMessageType => {
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

export const jsonToMessage = (type: string, data: any): string => {
	if (!type) {
		return '';
	}

	return JSON.stringify(data === undefined ? [type] : [type, data]);
};
