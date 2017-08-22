
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
			throw new Error('Resp StatusCode ' + actualStatusCode + statusMsg + ':\nerrorBody:' + JSON.stringify(respBody));
		}
	}

	list(calendarId, params) {
		return this._httpRequest.get('', `${this._aclBaseUrl}${calendarId}/acl`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Acl.list ' + err);
			});
	}

	get(calendarId, ruleId) {
		return this._httpRequest.get('', `${this._aclBaseUrl}${calendarId}/acl/${ruleId}`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Acl.get ' + err);
			});
	}

	insert(calendarId, params) {
		return this._httpRequest.post('', `${this._aclBaseUrl}${calendarId}/acl`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Acl.insert ' + err);
			});
	}

	update(calendarId, ruleId, params) {
		return this._httpRequest.put('', `${this._aclBaseUrl}${calendarId}/acl/${ruleId}`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Acl.update ' + err);
			});
	}

	delete(calendarId, ruleId) {
		return this._httpRequest.delete('', `${this._aclBaseUrl}${calendarId}/acl/${ruleId}`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(204, resp.statusCode, resp.body, resp.statusMessage);
				return { ruleId: ruleId, calendarId: calendarId, statusCode: resp.statusCode, statusMessage: resp.statusMessage, message: 'Acl rule deleted successfully' };
			})
			.catch(err => {
				throw new Error('Acl.delete ' + err);
			});
	}

	watch(calendarId, params) {
		return this._httpRequest.post('', `${this._aclBaseUrl}${calendarId}/acl/watch`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Acl.watch ' + err);
			});
	}
}

module.exports = Acl;