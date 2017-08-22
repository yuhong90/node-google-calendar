//example.js
const CONFIG = require('../config/Local-Settings');
const CalendarAPI = require('../src/CalendarAPI');
const cal = new CalendarAPI(CONFIG);

const CALENDAR_URL = require('../config/Local-Settings').calendarUrl;
const CALENDAR_ID_LIST = CONFIG.calendarId;

miscExamples();

function miscExamples() {
	listAllColors();
	// listSettings();
	// getSettings('weekStart');
	// checkBusy(CALENDAR_ID_LIST['primary'], '2017-05-20T09:00:00+08:00', '2017-05-20T21:00:00+08:00');
}

function listAllColors() {
	return cal.Colors.get().then(resp => {
		console.log(resp);
		return resp;
	}).catch(err => {
		console.log(err.message);
	});
}

function checkBusy(calendarId, startDateTime, endDateTime) {
	let params = {
		"timeMin": startDateTime,
		"timeMax": endDateTime,
		"items": [{ "id": calendarId }]
	};

	return cal.FreeBusy.query(calendarId, params)
		.then(resp => {
			console.log('List of busy timings with events on calendar within defined time range: ' + startDateTime + ' - ' + endDateTime);
			console.log(resp);
			return resp;
		})
		.catch(err => {
			console.log('Error: checkBusy -' + err.message);
		});
}

function getSettings(settingId) {
	return cal.Settings.get(settingId)
		.then(resp => {
			console.log('List settings with settingID: ' + settingId);
			console.log(resp);
			return resp;
		})
		.catch(err => {
			console.log('Error: getSettings -' + err.messsage);
		});
}

function listSettings() {
	let params = {};
	return cal.Settings.list(params)
		.then(resp => {
			console.log('List settings: ');
			console.log(resp);
			return resp;
		})
		.catch(err => {
			console.log('Error: listSettings -' + err.message);
		});
}