declare var annyang: any;
declare var SpeechSynthesisUtterance: any;
declare var utterances: any[];
declare var speechSynthesis: any;
declare var process: {
    env: any,
};

// fix flow MessageEvent missing data prop
declare type MessageEvent = {
	data: string,
};
