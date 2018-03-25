// @flow

declare type DevicesStateType = {
    map: {[string]: DeviceType},
};

declare type DeviceType = {
    _id: string,
    name: string,
    description: string,
    type: string,

    active?: boolean,
};
