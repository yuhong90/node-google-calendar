
class Settings {

	constructor(httpRequest, jwt, settingBaseUrl) {
		if (httpRequest === undefined || jwt === undefined || settingBaseUrl === undefined) {
			throw new Error('Settings constructor: Missing arguments');
		}
		this._httpRequest = httpRequest;
		this._JWT = jwt;
		this._settingBaseUrl = settingBaseUrl;
	}

	_checkErrorResponse(expectedStatusCode, actualStatusCode, resp) {
		if (actualStatusCode !== expectedStatusCode) {
			let statusMsg = (actualStatusMessage === '' || actualStatusMessage === undefined) ? '' : '(' + actualStatusMessage + ')';
			throw new Error('Resp StatusCode ' + actualStatusCode + statusMsg + ':\nerrorBody:' + JSON.stringify(respBody));
		};
	}

	get(settingId) {
		return this._httpRequest.get('', `${this._settingBaseUrl}${settingId}`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Settings.get ' + err);
			});
	}

	list(params) {
		return this._httpRequest.get('', `${this._settingBaseUrl}`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = (typeof resp.body === 'string') ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Settings.list ' + err);
			});
	}

}

module.exports = Settings;