var wifi = require('Wifi');
var WebSocket = require('ws');

var deviceId = 'deviceIdGeneratedWhenDeviceIsAddedToDb';
var wifiCreds = {
	login: 'yourWifiNetworkName',
	pass: 'yourWifiNetworkPassword'
};

var host = 'hostName';
var wsOptions = {
	path: '/',
	//port: 3001,
	protocol: 'device-' + deviceId,
	keepAlive: 60,
	//headers:{ someHeaders }
};

var reconnectWsId;
var ws;
var ledState = 0;

function messageToJSON(msg) {
	var message = [
		'',
		null,
	];

	try {
		message = JSON.parse(msg);
	} catch (e) {
		message[0] = msg;
	}

	return message;
}

function setLed(state) {
	ledState = state;
	digitalWrite(D4, state); // D2 on nodemcu
}

function reportState() {
	return JSON.stringify([
		'stateUpdate',
		{state: {led: ledState}},
		// commands: ['led off', 'led on'],
		// _id: deviceId
	]);
}

function initWS() {
	ws = new WebSocket(host, wsOptions);

	ws.on('open', function() {
		console.log('Connected to server');
	});

	ws.on('message', function(msg) {
		// ping pong empty messages
		if (msg === '') {
			return ws.send('');
		}

		msg = messageToJSON(msg);
		var msgType = msg[0];
		var msgData = msg[1];

		if (msgType === 'deviceCommand') {
			if (msgData.cmdId === 'setLed') {
				setLed(msgData.status);
			}
		}

		ws.send(reportState());
	});

	ws.on('close', function() {
		console.log('Disconnected from server');
		setTimeout(initWS, 2000);
	});
}

function connectWifi() {
	wifi.connect(wifiCreds.login, {password: wifiCreds.pass}, function(err) {
		if (err) {
			console.log('Error: ', err);
		} else {
			wifi.stopAP();
			// wifi.setHostname('esp123');
			// wifi.save();
			setLed(1);
			initWS();
			console.log('Connected to WiFi');
		}
	});
}

function onInit() {
	connectWifi();
}
