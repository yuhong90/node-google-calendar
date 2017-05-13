const Promise = require('bluebird');
const requestWithJWT = Promise.promisify(require('google-oauth-jwt').requestWithJWT());
const qs = require('querystring');
const gcalBaseUrl = 'https://www.googleapis.com/calendar/v3/calendars/';

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
	}

	_checkCalendarId(calendarId, errorOrigin) {
		if (calendarId === undefined || calendarId == '') {
			throw new Error(errorOrigin + ': Missing calendarId argument; Check if defined in params and Settings file');
		}
	}

	_getRequest(calendarId, url, params, jwt) {
		// todo: need better validation
		this._checkCalendarId(calendarId);
		if (url === undefined) {
			throw new Error('Missing argument; requst url needed');
		}
		if (params === undefined) {
			throw new Error('Missing argument; query terms needed');
		}

		let options = {
			url: url,
			jwt: jwt,
			qs: params,
			useQuerystring: true
		};

		return requestWithJWT(options);
	}

	_postRequest(calendarId, url, params, jwt) {
		// todo: need better validation
		this._checkCalendarId(calendarId);
		if (url === undefined) {
			throw new Error('Missing argument; requst url needed');
		}
		if (params === undefined) {
			throw new Error('Missing argument; query terms needed');
		}

		let options = {
			method: 'POST',
			url: url,
			jwt: jwt,
			body: params,
			json: true
		};

		return requestWithJWT(options);
	}

	/**
	 * Returns a promise that list all events on calendar during selected period
	 * 
	 * @param {string} calendarId - Calendar identifier
	 * @param {datetime} timeMin (optional) - start datetime of event in 2016-04-29T14:00:00+08:00 RFC3339 format
	 * @param {datetime} timeMax (optional) - end datetime of event in 2016-04-29T18:00:00+08:00 RFC3339 format
	 * @param {string} q (optional) - Free text search terms to find events that match these terms in any field, except for extended properties. 
	 * More Optional query parameters @ https://developers.google.com/google-apps/calendar/v3/reference/events/list
	 */
	listEvents(calendarId, params) {
		this._checkCalendarId(calendarId, 'listEvents');

		return this._getRequest(calendarId, `${gcalBaseUrl}${calendarId}/events`, params, this._JWT)
			.then(resp => {
				if (resp.statusCode !== 200) {
					throw new Error(resp.statusCode + ':\n' + JSON.stringify(resp.body));
				};

				let body = JSON.parse(resp.body);
				return body.items;
			}).catch(err => {
				throw new Error('ListEvents: ' + err);
			});
	}

	/**
	 * Insert an event on the user's primary calendar. Returns promise of details of booking
	 *
	 * @param {string} summary 					- Event title to be specified in calendar event summary. Free-text
	 * @param {nested object} start 			- start.dateTime defines start datetime of event in 2016-04-29T14:00:00+08:00 RFC3339 format
	 * @param {nested object} end 				- end.dateTime defines end datetime of event in 2016-04-29T18:00:00+08:00 RFC3339 format
	 * @param {string} location (optional) 		- Location description of event. Free-text
	 * @param {string} description (optional) 	- Description of event.
	 * @param {string} status (optional) 		- Event status - confirmed, tentative, cancelled; tentative for all queuing
	 * @param {string} colorId (optional) 		- Color of the event
	 */
	insertEvent(calendarId, params) {
		this._checkCalendarId(calendarId, 'insertEvent');

		return this._postRequest(calendarId, `${gcalBaseUrl}${calendarId}/events`, params, this._JWT)
			.then(resp => {
				if (resp.statusCode !== 200) {
					throw new Error(resp.statusCode + ':\n' + JSON.stringify(resp.body));
				};
				return resp;
			})
			.catch(err => {
				throw new Error('InsertEvent: ' + err);
			});
	}

	deleteEvent(calendarId, eventId) {
		this._checkCalendarId(calendarId);
		if (eventId === undefined) {
			throw new Error('Missing argument; need to pass in eventId');
		}

		return requestWithJWT({
			method: 'DELETE',
			url: 'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events/' + eventId,
			jwt: this._JWT
		}).then(resp => {
			if (resp.statusCode !== 204) {
				throw new Error(resp.statusCode + ':\n' + resp.body);
			}
			let status = resp.statusCode;

			return { statusCode: status, message: 'Event delete success' };
		})
			.catch(err => {
				throw err;
			});
	}

	/**
	 * Checks when queried calendar is busy/ during selected period.
	 * Returns promise of list of start and end timings that are busy with time range.
	 *
	 * @param {string} startDateTime - start datetime of event in 2016-04-29T14:00:00+08:00 format
	 * @param {string} endDateTime - end datetime of event in 2016-04-29T18:00:00+08:00 format
	 */
	checkBusyPeriod(calendarId, startDateTime, endDateTime) {
		this._checkCalendarId(calendarId);
		let event = {
			"timeMin": startDateTime,
			"timeMax": endDateTime,
			"timeZone": this._TIMEZONE,
			"items": [{ "id": calendarId }]
		};

		let options = {
			method: 'POST',
			url: 'https://www.googleapis.com/calendar/v3/freeBusy',
			json: true,
			body: event,
			jwt: this._JWT
		};

		return requestWithJWT(options).then(resp => {
			return resp.body.calendars[calendarId].busy;
		})
			.catch(err => {
				throw err;
			});
	}
}

module.exports = CalendarAPI;