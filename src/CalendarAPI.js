const Promise = require('bluebird');
const gcalBaseUrl = 'https://www.googleapis.com/calendar/v3/calendars/';
const calEvents = require('./Events');
const Request = require('./HttpRequest');
let httpRequest = new Request();

class CalendarAPI {

	constructor(config) {
		this._JWT = {
			email: config.serviceAcctId,
			scopes: ['https://www.googleapis.com/auth/calendar']
		};

		if (config.keyFile !== undefined) {			//for using pem key
			this._JWT.keyFile = config.keyFile;
		} else if (config.key !== undefined) {		//for using json key
			this._JWT.key = config.key;
		} else {
			throw new Error('Missing keyfile for Google OAuth; Check if defined in Settings file');
		}
		this._TIMEZONE = config.timezone;
		this._Events = new calEvents(httpRequest, this._JWT);
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

	get Events() {
		return this._Events;
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
	checkBusy(calendarId, params) {
		this._checkCalendarId(calendarId, 'CheckBusy');
		if (params.timeZone === undefined) {
			params.timeZone = this._TIMEZONE;
		}

		return httpRequest.post(calendarId, 'https://www.googleapis.com/calendar/v3/freeBusy', params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body);
				return resp.body.calendars[calendarId].busy;
			})
			.catch(err => {
				throw new Error('CheckBusy: ' + err);
			});
	}

	getSetting(settingId) {
		return httpRequest.get('', `https://www.googleapis.com/calendar/v3/users/me/settings/${settingId}`, '', this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body);
				let body = JSON.parse(resp.body);
				return body;
			})
			.catch(err => {
				throw new Error('getSetting: ' + err);
			});
	}

	listSettings(params) {
		return httpRequest.get('', 'https://www.googleapis.com/calendar/v3/users/me/settings', params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body);
				let body = JSON.parse(resp.body);
				return body;
			})
			.catch(err => {
				throw new Error('listSettings: ' + err);
			});
	}
}

module.exports = CalendarAPI;