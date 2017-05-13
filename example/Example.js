//example.js
const CALENDAR_URL = require('../config/Local-Settings').calendarUrl;
const CONFIG = require('../config/Local-Settings');
const CalendarAPI = require('../src/CalendarAPI');
let cal = new CalendarAPI(CONFIG);
let calendarIdList = CONFIG.calendarId;

examples();

function examples() {
	// listSingleEventsWithinDateRange(calendarIdList['primary'], '2017-05-14T09:00:00+08:00', '2017-05-14T21:00:00+08:00', 'Drone');
	// listAllEventsInCalendar(calendarIdList['primary']);
	// insertEvent(calendarIdList['primary'], 'TestEventName', '2017-05-14T10:00:00+08:00', '2017-05-14T11:00:00+08:00', 'drone', 'confirmed', 'some description here');
	// insertRecurringEvent(calendarIdList['primary'], 'TestRecurringEvent', '2017-05-14T10:00:00+08:00', '2017-05-14T11:00:00+08:00', 'drone', 'confirmed', 'description', ['RRULE:FREQ=WEEKLY;COUNT=3'])
	// updateEvent(calendarIdList['primary'], 'lceph271eedi1dpfvo639pc97o', 'TestEvent3', '2017-05-14T08:30:00+08:00', '2017-05-14T11:00:00+08:00', 'drone', 'confirmed', 'some descriptions here');
	// deleteEvent(calendarIdList['primary'], 'g3t25846e8rqjme0b3f5tfu0d0');
	// getEvent(calendarIdList['primary'], 'rk38rqfd1vks0r6fhjq4nsep18');
	// checkBusy(calendarIdList['primary'], '2017-05-14T09:00:00+08:00', '2017-05-14T21:00:00+08:00');
	// eventInstances(calendarIdList['primary'], '292t04careedrm9anhokgt01n4');
	// moveEvent(calendarIdList['drone'], 'lceph271eedi1dpfvo639pc97o', calendarIdList['primary']);
	// quickAddEvent(calendarIdList['primary'], 'Breakfast 9am - 11am');
}

function listAllEventsInCalendar(calendarId) {
	let eventsArray = [];
	let params = {};
	cal.listEvents(calendarId, params)
		.then(json => {
			for (let i = 0; i < json.length; i++) {
				let event = {
					id: json[i].id,
					summary: json[i].summary,
					location: json[i].location,
					start: json[i].start,
					end: json[i].end,
					status: json[i].status
				};
				eventsArray.push(event);
			}

			console.log('List of all events on calendar');
			console.log(eventsArray);
		}).catch(err => {
			console.log('Error: listAllEventsInCalendar -' + err);
		});
}

function listSingleEventsWithinDateRange(calendarId, startDateTime, endDateTime, query) {
	let eventsArray = [];
	let params = {
		timeMin: startDateTime,
		timeMax: endDateTime,
		q: query,
		singleEvents: true,
		orderBy: 'startTime'
	}

	cal.listEvents(calendarId, params)
		.then(json => {
			for (let i = 0; i < json.length; i++) {
				let event = {
					id: json[i].id,
					summary: json[i].summary,
					location: json[i].location,
					start: json[i].start,
					end: json[i].end,
					status: json[i].status
				};
				eventsArray.push(event);
			}

			console.log('List of events on calendar within time-range:');
			console.log(eventsArray);

		}).catch(err => {
			console.log('Error: listBookedEvent -' + err);
		});
}

function quickAddEvent(calendarId, text) {
	let params = {
		'text': text
	}

	cal.quickAddEvent(calendarId, params)
		.then(resp => {
			let json = resp;
			console.log('inserted quickAddEvent:');
			console.log(json);
		})
		.catch(err => {
			console.log('Error: quickAddEvent-' + err);
		});
}

function insertEvent(calendarId, eventSummary, startDateTime, endDateTime, location, status, description) {
	let event = {
		'start': {
			'dateTime': startDateTime
		},
		'end': {
			'dateTime': endDateTime
		},
		'location': location,
		'summary': eventSummary,
		'status': status,
		'description': description,
		'colorId': 1
	};

	cal.insertEvent(calendarId, event)
		.then(resp => {
			let json = resp;
			let results = {
				id: json.id,
				'summary': json.summary,
				'location': json.location,
				'status': json.status,
				'htmlLink': CALENDAR_URL,
				'start': json.start.dateTime,
				'end': json.end.dateTime,
				'created': new Date(json.created)
			};
			console.log('inserted event:');
			console.log(results);
		})
		.catch(err => {
			console.log('Error: insertEvent-' + err);
		});
}

function insertRecurringEvent(calendarId, eventSummary, startDateTime, endDateTime, location, status, description, recurrenceRule) {
	let event = {
		'start': {
			'dateTime': startDateTime,
			'timeZone': 'Asia/Singapore'
		},
		'end': {
			'dateTime': endDateTime,
			'timeZone': 'Asia/Singapore'
		},
		'location': location,
		'summary': eventSummary,
		'status': status,
		'description': description,
		'colorId': 1,
		'recurrence': recurrenceRule
	};

	cal.insertEvent(calendarId, event)
		.then(resp => {
			let json = resp;
			console.log('inserted event:');
			console.log(json);
		})
		.catch(err => {
			console.log('Error: insertRecurringEvent-' + err);
		});
}

function updateEvent(calendarId, eventId, eventSummary, startDateTime, endDateTime, location, status, description, recurrenceRule) {
	let event = {
		'start': {
			'dateTime': startDateTime,
			'timeZone': 'Asia/Singapore'
		},
		'end': {
			'dateTime': endDateTime,
			'timeZone': 'Asia/Singapore'
		},
		'location': location,
		'summary': eventSummary,
		'status': status,
		'description': description,
		'colorId': 1,
		'recurrence': recurrenceRule
	};

	cal.updateEvent(calendarId, eventId, event)
		.then(resp => {
			let json = resp;
			console.log('updated event:');
			console.log(json);
		})
		.catch(err => {
			console.log('Error: updatedEvent-' + err);
		});
}

function deleteEvent(calendarId, eventId) {
	let params = {
		sendNotifications: true
	};
	return cal.deleteEvent(calendarId, eventId, params)
		.then(resp => {
			console.log('Deleted Event Response: ');
			console.log(resp);
		})
		.catch(err => {
			console.log('Error: deleteEvent-' + err);
		});
}

function getEvent(calendarId, eventId) {
	let params = {};

	return cal.getEvent(calendarId, eventId, params)
		.then(resp => {
			console.log('GetEvent: ' + eventId);
			console.log(resp);
		})
		.catch(err => {
			console.log('Error: getEvent-' + err);
		});
}

function eventInstances(calendarId, eventId) {
	let params = {};

	return cal.eventInstances(calendarId, eventId, params)
		.then(resp => {
			console.log('eventInstances: ' + eventId);
			console.log(resp);
		})
		.catch(err => {
			console.log('Error: eventInstances-' + err);
		});
}

function moveEvent(calendarId, eventId, destination) {
	let params = { 'destination': destination };

	return cal.moveEvent(calendarId, eventId, params)
		.then(resp => {
			console.log('moveEvent: ' + eventId);
			console.log(resp);
		})
		.catch(err => {
			console.log('Error: moveEvent-' + err);
		});
}

function checkBusy(calendarId, startDateTime, endDateTime) {
	let params = {
		"timeMin": startDateTime,
		"timeMax": endDateTime,
		"items": [{ "id": calendarId }]
	};

	return cal.checkBusy(calendarId, params)
		.then(resp => {
			console.log('List of busy timings with events on calendar within defined time range: ' + startDateTime + ' - ' + endDateTime);
			console.log(resp);
		})
		.catch(err => {
			console.log('Error: checkBusy -' + err);
		});
}