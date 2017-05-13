//example.js
const CALENDAR_URL = require('../config/Local-Settings').calendarUrl;
const CONFIG = require('../config/Local-Settings');
const CalendarAPI = require('../src/CalendarAPI');
let cal = new CalendarAPI(CONFIG);
let calendarIdList = CONFIG.calendarId;

examples();

function examples() {
	// insertEvent(calendarIdList['primary'], "EventName", "2016-08-04T10:00:00+08:00", "2016-08-04T11:00:00+08:00", "drone", "confirmed", "some description here");
	// deleteEvent(calendarIdList['primary'], "6qc97pdhfei9snh0dn92o32248");
	// checkBusyPeriod(calendarIdList['primary'], "2016-08-04T09:00:00+08:00", "2016-08-04T21:00:00+08:00");
	listSingleEventsWithinDateRange(calendarIdList['drone'], "2017-05-01T09:00:00+08:00", "2017-05-07T21:00:00+08:00", "Drone");
	// listAllEventsInCalendar(calendarIdList['primary']);
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
			console.log("Error: listAllEventsInCalendar -" + err);
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
			console.log("Error: listBookedEvent -" + err);
		});
};

function insertEvent(calendarId, eventSummary, startDateTime, endDateTime, location, status, description) {
	let colorId = 1;
	cal.insertEvent(calendarId, eventSummary, startDateTime, endDateTime, location, status, description, colorId)
		.then(resp => {
			let json = resp.body;
			let results = {
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
			console.log("Error: insertEvent-" + err);
		});
};


function deleteEvent(calendarId, eventId) {
	return cal.deleteEvent(calendarId, eventId)
		.then(resp => {
			console.log('Deleted Event: ');
			console.log(resp);
		})
		.catch(err => {
			console.log("Error: deleteEvent-" + err);
		});
};

function checkBusyPeriod(calendarId, startDateTime, endDateTime) {
	return cal.checkBusyPeriod(calendarId, startDateTime, endDateTime)
		.then(resp => {
			console.log('List of timings with events on calendar:');
			console.log(resp);
		})
		.catch(err => {
			console.log("Error: checkBusyPeriod -" + err);
		});
};