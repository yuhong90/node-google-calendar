const Promise = require('bluebird');
const requestWithJWT = Promise.promisify(require('google-oauth-jwt').requestWithJWT());

class HttpRequest {

	_checkRequired(url, params, jwt) {
		if (url === undefined) {
			throw new Error('Missing argument; requst url needed');
		} else if (params === undefined) {
			throw new Error('Missing argument; query terms needed');
		} else if (jwt === undefined) {
			throw new Error('Missing argument; jwt needed');
		}
	}

	get(calendarId, url, params, jwt) {
		this._checkRequired(url, params, jwt);

		let options = {
			url: url,
			jwt: jwt,
			qs: params,
			useQuerystring: true
		};

		return requestWithJWT(options);
	}

	post(calendarId, url, params, jwt) {
		this._checkRequired(url, params, jwt);

		let options = {
			method: 'POST',
			url: url,
			jwt: jwt,
			body: params,
			json: true
		};

		return requestWithJWT(options);
	}

	postWithQueryString(calendarId, url, params, jwt) {
		this._checkRequired(url, params, jwt);

		let options = {
			method: 'POST',
			url: url,
			jwt: jwt,
			qs: params,
			json: true
		};

		return requestWithJWT(options);
	}

	put(calendarId, url, params, jwt) {
		this._checkRequired(url, params, jwt);

		let options = {
			method: 'PUT',
			url: url,
			jwt: jwt,
			body: params,
			json: true
		};

		return requestWithJWT(options);
	}

	delete(calendarId, url, params, jwt) {
		this._checkRequired(url, params, jwt);

		let options = {
			method: 'DELETE',
			url: url,
			jwt: jwt,
			qs: params
		};

		return requestWithJWT(options)
	}
}

module.exports = HttpRequest;