// @flow

declare type NetworkStateType = {
    macMap: {[string]: any[]},
};

declare type SecurityStateType = {
	detectionStatus: ?boolean,
	lastDetected: ?Date | any,
	images: ?any[],
	turnDetectionOnWhenNobodyHome: ?boolean,
};

declare type HomeStateType = {
	network: NetworkStateType,
	security: SecurityStateType,
	led: 1 | 0 | null, // on | off | unknown,
};
