// @flow

declare type DevicesStateType = {
    loading: boolean,
    loaded: boolean,
    list: DeviceType[],
};

declare type DeviceType = {
    _id: string,
    name: string,
    description: string,
    type: string,

    active?: boolean,
};
