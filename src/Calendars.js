
class Calendars {

	constructor(httpRequest, jwt, calBaseUrl) {
		if (httpRequest === undefined || jwt === undefined || calBaseUrl === undefined) {
			throw new Error('Calendars constructor: Missing arguments');
		}
		this._httpRequest = httpRequest;
		this._JWT = jwt;
		this._calBaseUrl = calBaseUrl;
	}

	_checkErrorResponse(expectedStatusCode, actualStatusCode, respBody, actualStatusMessage) {
		if (actualStatusCode !== expectedStatusCode) {
			let statusMsg = (actualStatusMessage === '' || actualStatusMessage === undefined) ? '' : '(' + actualStatusMessage + ')';
			let errorObject = { statusCode: `${actualStatusCode}${statusMsg}`, errorBody: respBody };
			throw new Error(JSON.stringify(errorObject));
		}
	}

	_tryParseJSON(stringToParse) {
		try {
			return JSON.parse(stringToParse);
		} catch (e) {
			return stringToParse;
		}
	}

	clear(calendarId) {
		return this._httpRequest.post(`${this._calBaseUrl}${calendarId}/clear`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				return { calendarId: calendarId, statusCode: resp.statusCode, message: 'Calendar cleared successfully' };
			})
			.catch(err => {
				let error = {
					origin: 'Calendars.clear',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}

	get(calendarId) {
		return this._httpRequest.get(`${this._calBaseUrl}${calendarId}`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'Calendars.get',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}

	insert(params) {
		return this._httpRequest.post(`${this._calBaseUrl}`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'Calendars.insert',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}

	update(calendarId, params) {
		return this._httpRequest.put(`${this._calBaseUrl}${calendarId}`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'Calendars.update',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}

	delete(calendarId) {
		return this._httpRequest.delete(`${this._calBaseUrl}${calendarId}`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(204, resp.statusCode, resp.body, resp.statusMessage);
				return { calendarId: calendarId, statusCode: resp.statusCode, statusMessage: resp.statusMessage, message: 'Calendar deleted successfully' };
			})
			.catch(err => {
				let error = {
					origin: 'Calendars.delete',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}
}

module.exports = Calendars;