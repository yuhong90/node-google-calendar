const Promise = require('bluebird');
const requestWithJWT = Promise.promisify(require('google-oauth-jwt').requestWithJWT());

class HttpRequest {

	_checkBasicRequired(url, jwt) {
		if (url === undefined) {
			throw new Error('Missing argument; requst url needed');
		} else if (jwt === undefined) {
			throw new Error('Missing argument; jwt needed');
		}
	}

	_checkRequired(url, params, jwt) {
		if (url === undefined) {
			throw new Error('Missing argument; requst url needed');
		} else if (params === undefined) {
			throw new Error('Missing argument; query terms needed');
		} else if (jwt === undefined) {
			throw new Error('Missing argument; jwt needed');
		}
	}

	get(url, params, jwt) {
		this._checkRequired(url, params, jwt);

		let options = {
			url: url,
			jwt: jwt,
			qs: params,
			useQuerystring: true
		};

		return requestWithJWT(options);
	}

	post(url, params, jwt, query) {
		this._checkRequired(url, params, jwt);

		let options = {
			method: 'POST',
			url: url,
			jwt: jwt,
			body: params,
			qs: query,
			json: true
		};

		return requestWithJWT(options);
	}

	postWithQueryString(url, querystring, jwt) {
		this._checkRequired(url, params, jwt);

		let options = {
			method: 'POST',
			url: url,
			jwt: jwt,
			qs: querystring,
			json: true
		};

		return requestWithJWT(options);
	}

	put(url, params, jwt, query) {
		this._checkRequired(url, params, jwt);

		let options = {
			method: 'PUT',
			url: url,
			jwt: jwt,
			body: params,
			qs: query,
			json: true
		};

		return requestWithJWT(options);
	}

	delete(url, params, jwt) {
		this._checkBasicRequired(url, jwt);

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