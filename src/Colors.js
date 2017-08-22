
class Colors {

	constructor(httpRequest, jwt, colorsBaseUrl) {
		if (httpRequest === undefined || jwt === undefined || colorsBaseUrl === undefined) {
			throw new Error('Colors constructor: Missing arguments');
		}
		this._httpRequest = httpRequest;
		this._JWT = jwt;
		this._colorsBaseUrl = colorsBaseUrl;
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

	get() {
		return this._httpRequest.get(`${this._colorsBaseUrl}`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = typeof resp.body === 'string' ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				let error = {
					origin: 'Colors.get',
					error: this._tryParseJSON(err.message)		// return as object if JSON, string if not parsable
				};
				throw new Error(JSON.stringify(error));
			});
	}
}

module.exports = Colors;