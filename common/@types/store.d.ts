// App
export interface AppState {
  dataLoaded: boolean;
}


// Devices
export interface DeviceData {
  _id: string;
  name: string;
  description: string;
  type: string;
  active?: boolean;
}

export interface DevicesMap {
  [deviceId: string]: DeviceData;
}

export interface DevicesState {
  map: DevicesMap;
  activeDevices: string[];
}


// Home
export interface NetworkState {
  macMap: {
    [macId: string]: object[]
  };
}

export interface SecurityState {
  detectionStatus: boolean | null;
  lastDetected: Date | any;
  images: string[] | null;
  turnDetectionOnWhenNobodyHome: boolean | null;
}

export interface HomeState {
  network: NetworkState;
  security: SecurityState;
  led: 1 | 0 | null; // on | off | unknown;
}


// Robo
export interface RoboEmotions {
  mouthOpen: boolean;
  eyesClosed: boolean;
  weird: boolean;
  moveEyes: boolean;
  talking: boolean;
}

export interface RoboState {
  name: string;
  langs: string[];
  lang: string;
  emotions: RoboEmotions;
  annyangAvailable: boolean;
}


// Settings
export interface SettingsState {
	data: {
		deviceIdentifiers?: string[];
		annyangActive?: boolean;
		notifyOnMotionDetection?: boolean;
	};
}


// User
export interface UserState {
  token: string | null;
  data: UserData | null;
}

export interface UserData {
  _id: string;
  email: string;
  name: string;
  admin: boolean | null;
}


// Users
export interface UsersMap {
  [userid: string]: UserData;
}

export interface UsersState {
  map: UsersMap;
}


// Root
export interface RootState {
  app: AppState;
  devices: DevicesState;
  home: HomeState;
  robo: RoboState;
  settings: SettingsState;
  user: UserState;
  users: UsersState;
  ws: {};
}
