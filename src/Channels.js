
class Channels {

	constructor(httpRequest, jwt, channelsBaseUrl) {
		if (httpRequest === undefined || jwt === undefined || channelsBaseUrl === undefined) {
			throw new Error('Channels constructor: Missing arguments');
		}
		this._httpRequest = httpRequest;
		this._JWT = jwt;
		this._channelsBaseUrl = channelsBaseUrl;
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

	stop(params) {
		return this._httpRequest.post(`${this._channelBaseUrl}/stop`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(204, resp.statusCode, resp.body, resp.statusMessage);
				return {
					uuid: params.id,
					resourceId: params.resourceId,
					statusCode: resp.statusCode,
					statusMessage: resp.statusMessage,
					message: 'Stop watching channel successfully'
				};
			})
			.catch(err => {
				let error = {
					origin: 'Channels.stop',
					error: this._tryParseJSON(err.message)
				};
				throw new Error(JSON.stringify(error));
			});
	}
}

module.exports = Channels;