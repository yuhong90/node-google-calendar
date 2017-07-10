class FreeBusy {

	constructor(httpRequest, jwt, BaseUrl, timezone) {
		if (httpRequest === undefined || jwt === undefined || BaseUrl === undefined || timezone === undefined) {
			throw new Error('FreeBusy constructor: Missing arguments');
		}
		this._httpRequest = httpRequest;
		this._JWT = jwt;
		this._BaseUrl = BaseUrl;
		this._timezone = timezone;
	}

	_returnPromiseWithError(errorMsg) {
		return new Promise((resolve, reject) => {
			let err = new Error(errorMsg);
			reject(err);
		});
	}

	_checkCalendarId(calendarId, errorOrigin) {
		if (calendarId === undefined || calendarId == '') {
			return this._returnPromiseWithError(errorOrigin + ': Missing calendarId argument; Check if defined in params and Settings file');
		}
	}

	_checkErrorResponse(expectedStatusCode, actualStatusCode, resp) {
		if (actualStatusCode !== expectedStatusCode) {
			throw new Error('Resp StatusCode ' + actualStatusCode + ':\nerrorBody:' + JSON.stringify(resp));
		};
	}

	/** Checks when queried calendar is busy during selected time range.
	 *  Returns promise of list of start and end timings that are busy with time range.
	 *
	 * @param {string} calendarId		- Calendar identifier
	 * @param {string} params.timeMin 	- start datetime of event in 2016-04-29T14:00:00+08:00 format
	 * @param {string} params.timeMax 	- end datetime of event in 2016-04-29T18:00:00+08:00 format
	 * @param {string} timeZone			- Timezone used in the response.
	 * @param {string} items[].id		- The identifier of a calendar or a group to query
	 */
	query(calendarId, params) {
		let checkResult = this._checkCalendarId(calendarId, 'query');
		if (undefined !== checkResult) {
			return checkResult;
		}
		if (params.timeZone === undefined) {
			params.timeZone = this._timezone;
		}

		return this._httpRequest.post(calendarId, this._BaseUrl, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				return resp.body.calendars[calendarId].busy;
			})
			.catch(err => {
				throw new Error('FreeBusy.query ' + err);
			});
	}
}

module.exports = FreeBusy;