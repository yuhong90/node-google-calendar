class Events {

	constructor(httpRequest, jwt, gcalBaseUrl) {
		if (httpRequest === undefined || jwt === undefined || gcalBaseUrl === undefined) {
			throw new Error('Events constructor: Missing arguments');
		}
		this._httpRequest = httpRequest;
		this._JWT = jwt;
		this._gcalBaseUrl = gcalBaseUrl;
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

	_checkCalendarAndEventId(calendarId, eventId, errorOrigin) {
		if (calendarId === undefined || calendarId == '') {
			return this._returnPromiseWithError(errorOrigin + ': Missing calendarId argument; Check if defined in params and Settings file');
		}
		if (undefined === eventId) {
			return this._returnPromiseWithError(errorOrigin + ': Missing eventId argument');
		}
	}

	_checkErrorResponse(expectedStatusCode, actualStatusCode, respBody, actualStatusMessage) {
		if (actualStatusCode !== expectedStatusCode) {
			let statusMsg = (actualStatusMessage === '' || actualStatusMessage === undefined) ? '' : '(' + actualStatusMessage + ')';
			throw new Error('Resp StatusCode ' + actualStatusCode + statusMsg + ':\nerrorBody:' + JSON.stringify(respBody));
		};
	}

	/** Deletes an event on the calendar specified. Returns promise with success msg if success
	 *
	 * @param {string} calendarId 							- Calendar identifier
	 * @param {string} eventId 								- EventId specifying event to delete
	 * @param {bool} params.sendNotifications (optional) 	- Whether to send notifications about the deletion of the event.
	 */
	delete(calendarId, eventId, params) {
		let checkResult = this._checkCalendarAndEventId(calendarId, eventId, 'Events.delete');
		if (undefined !== checkResult) {
			return checkResult;
		}

		return this._httpRequest.delete(calendarId, `${this._gcalBaseUrl}${calendarId}/events/${eventId}`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(204, resp.statusCode, resp.body, resp.statusMessage);
				let status = resp.statusCode;
				return { statusCode: status, message: 'Event delete success' };
			})
			.catch(err => {
				throw new Error('Events.delete ' + err);
			});
	}

	/** Returns a promise that list all events on calendar during selected period
	 * 
	 * @param {string} calendarId 					- Calendar identifier
	 * @param {datetime} params.timeMin (optional) 	- start datetime of event in 2016-04-29T14:00:00+08:00 RFC3339 format
	 * @param {datetime} params.timeMax (optional) 	- end datetime of event in 2016-04-29T18:00:00+08:00 RFC3339 format
	 * @param {string} params.q (optional) 			- Free text search terms to find events that match these terms in any field, except for extended properties. 
	 */
	get(calendarId, eventId, params) {
		let checkResult = this._checkCalendarAndEventId(calendarId, eventId, 'Events.get');
		if (undefined !== checkResult) {
			return checkResult;
		}

		return this._httpRequest.get(calendarId, `${this._gcalBaseUrl}${calendarId}/events/${eventId}`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = typeof resp.body === 'string' ? JSON.parse(resp.body) : resp.body;
				return body;
			}).catch(err => {
				throw new Error('Events.get ' + err);
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
	 */
	insert(calendarId, params) {
		let checkResult = this._checkCalendarId(calendarId, 'Events.insert');
		if (undefined !== checkResult) {
			return checkResult;
		}

		return this._httpRequest.post(calendarId, `${this._gcalBaseUrl}${calendarId}/events`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = typeof resp.body === 'string' ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Events.insert ' + err);
			});
	}

	/** Returns instances of the specified recurring event.
	 *  	 
	 * @param {string} calendarId 					- Calendar identifier
	 * @param {string} eventId 						- EventId specifying event to delete
	 */
	instances(calendarId, eventId, params) {
		let checkResult = this._checkCalendarId(calendarId, 'Events.instances');
		if (undefined !== checkResult) {
			return checkResult;
		}

		return this._httpRequest.get(calendarId, `${this._gcalBaseUrl}${calendarId}/events/${eventId}/instances`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = typeof resp.body === 'string' ? JSON.parse(resp.body) : resp.body;
				return body.items;
			})
			.catch(err => {
				throw new Error('Events.instances ' + err);
			});
	}

	/** Returns a promise that list all events on calendar during selected period
	 * 
	 * @param {string} calendarId 					- Calendar identifier
	 * @param {datetime} params.timeMin (optional) 	- start datetime of event in 2016-04-29T14:00:00+08:00 RFC3339 format
	 * @param {datetime} params.timeMax (optional) 	- end datetime of event in 2016-04-29T18:00:00+08:00 RFC3339 format
	 * @param {string} params.q (optional) 			- Free text search terms to find events that match these terms in any field, except for extended properties. 
	 */
	list(calendarId, params) {
		let checkResult = this._checkCalendarId(calendarId, 'Events.list');
		if (undefined !== checkResult) {
			return checkResult;
		}

		return this._httpRequest.get(calendarId, `${this._gcalBaseUrl}${calendarId}/events`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = typeof resp.body === 'string' ? JSON.parse(resp.body) : resp.body;
				return body.items;
			}).catch(err => {
				throw new Error('Events.list ' + err);
			});
	}

	/** Moves an event to another calendar, i.e. changes an event's organizer.
	 *  Returns updated event object of moved object when successful.
	 *
	 * @param {string} calendarId			- Calendar identifier
	 * @param {string} eventId 				- EventId specifying event to move
	 * @param {string} params.destination 	- Destination CalendarId to move event to
	 */
	move(calendarId, eventId, params) {
		let checkResult = this._checkCalendarAndEventId(calendarId, eventId, 'Events.move');
		if (undefined !== checkResult) {
			return checkResult;
		}
		if (undefined === params.destination) {
			return this._returnPromiseWithError('Events.move: Missing destination CalendarId argument');
		}

		return this._httpRequest.postWithQueryString(calendarId, `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}/move`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = typeof resp.body === 'string' ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Events.move ' + err);
			});
	}

	/** Creates an event based on a simple text string.
	 * 
	 * @param {string} calendarId 					- Calendar identifier
	 * @param {string} params.text 					- The text describing the event to be created.
	 */
	quickAdd(calendarId, params) {
		let checkResult = this._checkCalendarId(calendarId, 'Events.quickAdd');
		if (undefined !== checkResult) {
			return checkResult;
		}

		return this._httpRequest.postWithQueryString(calendarId, `${this._gcalBaseUrl}${calendarId}/events/quickAdd`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = typeof resp.body === 'string' ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Events.quickAdd ' + err);
			});
	}

	/** Updates an event on the calendar specified. Returns promise of details of updated event
	 *
	 * @param {string} calendarId 					- Calendar identifier
	 * @param {string} eventId 						- EventId specifying event to update
	 */
	update(calendarId, eventId, params) {
		let checkResult = this._checkCalendarAndEventId(calendarId, eventId, 'Events.update');
		if (undefined !== checkResult) {
			return checkResult;
		}

		return this._httpRequest.put(calendarId, `${this._gcalBaseUrl}${calendarId}/events/${eventId}`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = typeof resp.body === 'string' ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Events.update ' + err);
			});
	}

	/** Watch for changes to Events resources
	 * 
	 * @param {string} calendarId		- Calendar identifier
	 */
	watch(calendarId, params) {
		let checkResult = this._checkCalendarId(calendarId, 'Events.watch');
		if (undefined !== checkResult) {
			return checkResult;
		}

		return this._httpRequest.post(calendarId, `${this._gcalBaseUrl}${calendarId}/events/watch`, params, this._JWT)
			.then(resp => {
				this._checkErrorResponse(200, resp.statusCode, resp.body, resp.statusMessage);
				let body = typeof resp.body === 'string' ? JSON.parse(resp.body) : resp.body;
				return body;
			})
			.catch(err => {
				throw new Error('Events.watch ' + err);
			});
	}
}

module.exports = Events;