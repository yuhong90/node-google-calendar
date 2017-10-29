
class CalendarList {

	constructor(httpRequest, jwt, calListBaseUrl) {
		if (httpRequest === undefined || jwt === undefined || calListBaseUrl === undefined) {
			throw new Error('CalendarList constructor: Missing arguments');
		}
		this._httpRequest = httpRequest;
		this._JWT = jwt;
		this._calListBaseUrl = calListBaseUrl;
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

	list(query) {
		return this._httpRequest.get(`${this._calListBaseUrl}`, query, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'CalendarList.list',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}

	get(calendarId) {
		return this._httpRequest.get(`${this._calListBaseUrl}${calendarId}`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'CalendarList.get',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}

	insert(calendarId, params, query) {
		params.id = calendarId;
		return this._httpRequest.post(`${this._calListBaseUrl}`, params, this._JWT, query)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'CalendarList.insert',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}

	update(calendarId, params, query) {
		return this._httpRequest.put(`${this._calListBaseUrl}${calendarId}`, params, this._JWT, query)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'CalendarList.update',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}

	delete(calendarId) {
		return this._httpRequest.delete(`${this._calListBaseUrl}${calendarId}`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(204, resp.statusCode, resp.body, resp.statusMessage);
				return { calendarId: calendarId, statusCode: resp.statusCode, statusMessage: resp.statusMessage, message: 'Calendar entry deleted successfully from CalendarList' };
			})
			.catch(err => {
				let error = {
					origin: 'CalendarList.delete',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}

	watch(params, query) {
		return this._httpRequest.post(`${this._calListBaseUrl}/watch`, '', this._JWT, query)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'CalendarList.watch',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}
}

module.exports = CalendarList;