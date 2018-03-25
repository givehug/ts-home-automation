// @flow

declare type DevicesStateType = {
    list: DeviceType[],
};

declare type DeviceType = {
    _id: string,
    name: string,
    description: string,
    type: string,

    active?: boolean,
};
