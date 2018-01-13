import axios from 'axios';

class Api {
	rootUrl = process.env.HOST + '/api/';

	get options() {
		const token = localStorage.getItem('token');
		const options = {headers: {}};

		if (token) {
			options.headers['x-auth'] = token;
		}

		return options;
	}

	request(url, method, data) {
		return axios({
			method,
			url: this.rootUrl + url,
			data,
			headers: this.options.headers,
		});
	}
}

export default new Api();
