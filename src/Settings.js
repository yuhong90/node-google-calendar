
class Settings {

	constructor(httpRequest, jwt, settingBaseUrl) {
		if (httpRequest === undefined || jwt === undefined || settingBaseUrl === undefined) {
			throw new Error('Settings constructor: Missing arguments');
		}
		this._httpRequest = httpRequest;
		this._JWT = jwt;
		this._settingBaseUrl = settingBaseUrl;
	}

	_checkErrorResponse(expectedStatusCode, actualStatusCode, respBody, actualStatusMessage) {
		if (actualStatusCode !== expectedStatusCode) {
			let statusMsg = (actualStatusMessage === '' || actualStatusMessage === undefined) ? '' : '(' + actualStatusMessage + ')';
			let errorObject = { statusCode: `${actualStatusCode}${statusMsg}`, errorBody: respBody };
			throw new Error(JSON.stringify(errorObject));
		};
	}

	_tryParseJSON(stringToParse) {
		try {
			return JSON.parse(stringToParse);
		} catch (e) {
			return stringToParse;
		}
	}

	get(settingId) {
		return this._httpRequest.get(`${this._settingBaseUrl}${settingId}`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'Settings.get',
					error: this._tryParseJSON(err.message)		// return as object if JSON, string if not parsable
				};
				throw new Error(JSON.stringify(error));
			});
	}

	list(query) {
		return this._httpRequest.get(`${this._settingBaseUrl}`, query, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'Settings.list',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}

	watch(params, query) {
		return this._httpRequest.post(`${this._settingBaseUrl}/watch`, params, this._JWT, query)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'Settings.watch',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}
}

module.exports = Settings;