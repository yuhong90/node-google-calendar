const Promise = require('bluebird');
const gcalBaseUrl = 'https://www.googleapis.com/calendar/v3/calendars/';
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

	/** Returns a promise that list all events on calendar during selected period
	 * 
	 * @param {string} calendarId 					- Calendar identifier
	 * @param {datetime} params.timeMin (optional) 	- start datetime of event in 2016-04-29T14:00:00+08:00 RFC3339 format
	 * @param {datetime} params.timeMax (optional) 	- end datetime of event in 2016-04-29T18:00:00+08:00 RFC3339 format
	 * @param {string} params.q (optional) 			- Free text search terms to find events that match these terms in any field, except for extended properties. 
	 */
	listEvents(calendarId, params) {
		this._checkCalendarId(calendarId, 'listEvents');

		return httpRequest.getRequest(calendarId, `${gcalBaseUrl}${calendarId}/events`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body);
				let body = JSON.parse(resp.body);
				return body.items;
			}).catch(err => {
				throw new Error('ListEvents: ' + err);
			});
	}

	/** Returns a promise that list all events on calendar during selected period
	 * 
	 * @param {string} calendarId 					- Calendar identifier
	 * @param {datetime} params.timeMin (optional) 	- start datetime of event in 2016-04-29T14:00:00+08:00 RFC3339 format
	 * @param {datetime} params.timeMax (optional) 	- end datetime of event in 2016-04-29T18:00:00+08:00 RFC3339 format
	 * @param {string} params.q (optional) 			- Free text search terms to find events that match these terms in any field, except for extended properties. 
	 */
	getEvent(calendarId, eventId, params) {
		this._checkCalendarId(calendarId, 'GetEvent');

		return httpRequest.getRequest(calendarId, `${gcalBaseUrl}${calendarId}/events/${eventId}`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body);
				let body = JSON.parse(resp.body);
				return body;
			}).catch(err => {
				throw new Error('GetEvent: ' + err);
			});
	}

	/** Creates an event based on a simple text string.
	 * 
	 * @param {string} calendarId 					- Calendar identifier
	 * @param {string} params.text 					- The text describing the event to be created.
	 */
	quickAddEvent(calendarId, params) {
		this._checkCalendarId(calendarId, 'QuickAddEvent');

		return httpRequest.postRequestWithQueryString(calendarId, `${gcalBaseUrl}${calendarId}/events/quickAdd`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body);
				return resp.body;
			})
			.catch(err => {
				throw new Error('QuickAddEvent: ' + err);
			});
	}

	/** Insert an event on the calendar specified. Returns promise of details of event created within response body from google
	 *
	 * @param {string} calendarId 						- Calendar identifier
	 * @param {string} params.summary 					- Event title to be specified in calendar event summary. Free-text
	 * @param {nested object} params.start 				- start.dateTime defines start datetime of event in 2016-04-29T14:00:00+08:00 RFC3339 format
	 * @param {nested object} params.end 				- end.dateTime defines end datetime of event in 2016-04-29T18:00:00+08:00 RFC3339 format
	 * @param {string} params.location (optional) 		- Location description of event. Free-text
	 * @param {string} params.description (optional) 	- Description of event.
	 * @param {string} params.status (optional) 		- Event status - confirmed, tentative, cancelled; tentative for all queuing
	 * @param {string} params.colorId (optional) 		- Color of the event
	 * More Optional query parameters @ https://developers.google.com/google-apps/calendar/v3/reference/events/insert
	 */
	insertEvent(calendarId, params) {
		this._checkCalendarId(calendarId, 'insertEvent');

		return httpRequest.postRequest(calendarId, `${gcalBaseUrl}${calendarId}/events`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body);
				return resp.body;
			})
			.catch(err => {
				throw new Error('InsertEvent: ' + err);
			});
	}

	/** Updates an event on the calendar specified. Returns promise of details of updated event
	 *
	 * @param {string} calendarId 					- Calendar identifier
	 * @param {string} eventId 						- EventId specifying event to update
	 */
	updateEvent(calendarId, eventId, params) {
		this._checkCalendarId(calendarId, 'UpdateEvent');

		return httpRequest.putRequest(calendarId, `${gcalBaseUrl}${calendarId}/events/${eventId}`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body);
				return resp.body;
			})
			.catch(err => {
				throw new Error('UpdateEvent: ' + err);
			});
	}

	/** Deletes an event on the calendar specified. Returns promise with success msg if success
	 *
	 * @param {string} calendarId 					- Calendar identifier
	 * @param {string} eventId 						- EventId specifying event to delete
	 * @param {bool} params.sendNotifications (optional) 	- Whether to send notifications about the deletion of the event.
	 */
	deleteEvent(calendarId, eventId, params) {
		this._checkCalendarId(calendarId, 'DeleteEvent');
		if (eventId === undefined) {
			throw new Error('deleteEvent: Missing eventId argument');
		}

		return httpRequest.deleteRequest(calendarId, `${gcalBaseUrl}${calendarId}/events/${eventId}`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(204, resp.statusCode, resp.body);
				let status = resp.statusCode;
				return { statusCode: status, message: 'Event delete success' };
			})
			.catch(err => {
				throw new Error('InsertEvent: ' + err);
			});
	}

	/** Returns instances of the specified recurring event.
	 * 	 
	 * @param {string} calendarId 					- Calendar identifier
	 * @param {string} eventId 						- EventId specifying event to delete
	 */
	eventInstances(calendarId, eventId, params) {
		this._checkCalendarId(calendarId, 'EventInstances');

		return httpRequest.getRequest(calendarId, `${gcalBaseUrl}${calendarId}/events/${eventId}/instances`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body);
				let body = JSON.parse(resp.body);
				return body.items;
			})
			.catch(err => {
				throw new Error('EventInstances: ' + err);
			});
	}

	/** Moves an event to another calendar, i.e. changes an event's organizer.
	 *  Returns updated event object of moved object when successful.
	 *
	 * @param {string} calendarId			- Calendar identifier
	 * @param {string} eventId 				- EventId specifying event to move
	 * @param {string} params.destination 	- Destination CalendarId to move event to
	 */
	moveEvent(calendarId, eventId, params) {
		this._checkCalendarId(calendarId, 'MoveEvent');
		if (params.destination === undefined) {
			throw new Error('moveEvent: Missing destination CalendarId argument');
		}

		return httpRequest.postRequestWithQueryString(calendarId, `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}/move`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body);
				return resp.body;
			})
			.catch(err => {
				throw new Error('MoveEvent: ' + err);
			});
	}

	/** Watch for changes to Events resources
	 * 
	 * @param {string} calendarId		- Calendar identifier
	 */
	watchEvent(calendarId, params) {
		this._checkCalendarId(calendarId, 'WatchEvent');

		return httpRequest.postRequest(calendarId, `${gcalBaseUrl}${calendarId}/events/watch`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body);
				return resp.body;
			})
			.catch(err => {
				throw new Error('WatchEvent: ' + err);
			});
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

		return httpRequest.postRequest(calendarId, 'https://www.googleapis.com/calendar/v3/freeBusy', params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body);
				return resp.body.calendars[calendarId].busy;
			})
			.catch(err => {
				throw new Error('CheckBusy: ' + err);
			});
	}

	getSetting(settingId) {
		return httpRequest.getRequest('', `https://www.googleapis.com/calendar/v3/users/me/settings/${settingId}`, '', this._JWT)
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
		return httpRequest.getRequest('', 'https://www.googleapis.com/calendar/v3/users/me/settings', params, this._JWT)
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