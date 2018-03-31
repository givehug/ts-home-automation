import axios from 'axios';
import config from '../../../config';
import {USER_SESSION_TOKEN} from '../data/constants';

const rootUrl = config.BASE_URL + '/api/';

// Get reuest options onject based on user token in local storage
function getOptions(): any {
	const token = localStorage.getItem(USER_SESSION_TOKEN);
	const ops: any = {headers: {}};

	if (token) {
		ops.headers['x-auth'] = token;
	}

	return ops;
}

// Make http request with provided options
function request(
	url: string,     // request url
	method: string,  // method type
	data?: any,      // request data object if any
): Promise<any> {
	return axios({
		method,
		url: rootUrl + url,
		data,
		headers: getOptions().headers,
	});
}

export default request;
