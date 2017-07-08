
class Settings {

	constructor(httpRequest, jwt, settingBaseUrl) {
		this._httpRequest = httpRequest;
		this._JWT = jwt;
		this._settingBaseUrl = settingBaseUrl;
	}

	_checkCalendarId(calendarId, errorOrigin) {
		if (calendarId === undefined || calendarId == '') {
			throw new Error(errorOrigin + ': Missing calendarId argument; Check if defined in params and Settings file');
		}
	}

	_checkErrorResponse(expectedStatusCode, actualStatusCode, resp) {
		if (actualStatusCode !== expectedStatusCode) {
			throw new Error('Resp StatusCode ' + actualStatusCode + ':\n' + JSON.stringify(resp));
		};
	}

	get(settingId) {
		return this._httpRequest.get('', `${this._settingBaseUrl}${settingId}`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body);
				let body = typeof resp.body === 'string' ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Settings::get: ' + err);
			});
	}

	list(params) {
		return this._httpRequest.get('', `${this._settingBaseUrl}`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body);
				let body = typeof resp.body === 'string' ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Settings::list: ' + err);
			});
	}

}

module.exports = Settings;