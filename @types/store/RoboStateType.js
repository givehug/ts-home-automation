// @flow

declare type RoboStateType = {
    name: string,
	langs: string[],
	lang: string,
    emotions: RoboEmotionsType,
    annyangAvailable: boolean,
};

declare type RoboEmotionsType = {
    mouthOpen: boolean,
    eyesClosed: boolean,
    weird: boolean,
    moveEyes: boolean,
    talking: boolean,
};
