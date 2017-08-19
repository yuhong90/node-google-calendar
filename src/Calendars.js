
class Calendars {

	constructor(httpRequest, jwt, calBaseUrl) {
		if (httpRequest === undefined || jwt === undefined || calBaseUrl === undefined) {
			throw new Error('Calendars constructor: Missing arguments');
		}
		this._httpRequest = httpRequest;
		this._JWT = jwt;
		this._calBaseUrl = calBaseUrl;
	}

	_checkErrorResponse(expectedStatusCode, actualStatusCode, resp) {
		if (actualStatusCode !== expectedStatusCode) {
			let statusMsg = (actualStatusMessage === '' || actualStatusMessage === undefined) ? '' : '(' + actualStatusMessage + ')';
			throw new Error('Resp StatusCode ' + actualStatusCode + statusMsg + ':\nerrorBody:' + JSON.stringify(respBody));
		};
	}

	clear(calendarId) {
		return this._httpRequest.post('', `${this._calBaseUrl}${calendarId}/clear`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Calendars.clear ' + err);
			});
	}

	get(calendarId) {
		return this._httpRequest.get('', `${this._calBaseUrl}${calendarId}`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Calendars.get ' + err);
			});
	}

	insert(params) {
		return this._httpRequest.post('', `${this._calBaseUrl}`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Calendars.insert ' + err);
			});
	}

	update(calendarId, params) {
		return this._httpRequest.put('', `${this._calBaseUrl}${calendarId}`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Calendars.update ' + err);
			});
	}

	delete(calendarId) {
		return this._httpRequest.delete('', `${this._calBaseUrl}${calendarId}`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Calendars.delete ' + err);
			});
	}
}

module.exports = Calendars;