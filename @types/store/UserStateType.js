// @flow

declare type UserStateType = {
    token: ?string,
    data: ?UserDataType,
};

declare type UserDataType = {
	_id: string,
	email: string,
	name: string,
	admin: ?boolean,
	macs: string[],
};
