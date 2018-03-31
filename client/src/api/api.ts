import axios from 'axios';
import config from '../../../config';
import {USER_SESSION_TOKEN} from '../data/constants';

const api = Object.freeze({
	rootUrl: config.BASE_URL + '/api/',

	options() {
		const token = localStorage.getItem(USER_SESSION_TOKEN);
		const ops: any = {headers: {}};

		if (token) {
			ops.headers['x-auth'] = token;
		}

		return ops;
	},

	request(url: string, method: string, data?: any) {
		return axios({
			method,
			url: this.rootUrl + url,
			data,
			headers: this.options().headers,
		});
	}
});

export default api;
