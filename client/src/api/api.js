import axios from 'axios';
import config from '../../../config';
import {USER_SESSION_TOKEN} from '../data/constants';

function Api() {
	const rootUrl = config.BASE_URL + '/api/';

	const options = () => {
		const token = localStorage.getItem(USER_SESSION_TOKEN);
		const ops = {headers: {}};

		if (token) {
			ops.headers['x-auth'] = token;
		}

		return ops;
	};

	this.request = (url, method, data) => {
		return axios({
			method,
			url: rootUrl + url,
			data,
			headers: options().headers,
		});
	};
}

export default new Api();
