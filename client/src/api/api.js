import axios from 'axios';
import config from '../../../config';

function Api() {
	const rootUrl = config.HOST + '/api/';

	const options = () => {
		const token = localStorage.getItem('token');
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
