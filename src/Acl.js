
class Acl {

	constructor(httpRequest, jwt, aclBaseUrl) {
		if (httpRequest === undefined || jwt === undefined || aclBaseUrl === undefined) {
			throw new Error('Acl constructor: Missing arguments');
		}
		this._httpRequest = httpRequest;
		this._JWT = jwt;
		this._aclBaseUrl = aclBaseUrl;
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

	list(calendarId, query) {
		return this._httpRequest.get(`${this._aclBaseUrl}${calendarId}/acl`, query, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'Acl.list',
					error: this._tryParseJSON(err.message)		// return as object if JSON, string if not parsable
				};
				throw new Error(JSON.stringify(error));
			});
	}

	get(calendarId, ruleId) {
		return this._httpRequest.get(`${this._aclBaseUrl}${calendarId}/acl/${ruleId}`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'Acl.get',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}

	insert(calendarId, params, query) {
		return this._httpRequest.post(`${this._aclBaseUrl}${calendarId}/acl`, params, this._JWT, query)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'Acl.insert',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}

	update(calendarId, ruleId, params, query) {
		return this._httpRequest.put(`${this._aclBaseUrl}${calendarId}/acl/${ruleId}`, params, this._JWT, query)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'Acl.update',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}

	delete(calendarId, ruleId) {
		return this._httpRequest.delete(`${this._aclBaseUrl}${calendarId}/acl/${ruleId}`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(204, resp.statusCode, resp.body, resp.statusMessage);
				return { ruleId: ruleId, calendarId: calendarId, statusCode: resp.statusCode, statusMessage: resp.statusMessage, message: 'Acl rule deleted successfully' };
			})
			.catch(err => {
				let error = {
					origin: 'Acl.delete',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}

	watch(calendarId, params, query) {
		return this._httpRequest.post(`${this._aclBaseUrl}${calendarId}/acl/watch`, params, this._JWT, query)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'Acl.watch',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}
}

module.exports = Acl;