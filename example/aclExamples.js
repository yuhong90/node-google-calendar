const CONFIG = require('../config/Local-Settings');
const CalendarAPI = require('../src/CalendarAPI');
const cal = new CalendarAPI(CONFIG);
const userId = CONFIG.userId;

runAclExamples();

function runAclExamples() {
	let calendarId = CONFIG.calendarId.test;
	listAclOfCalendar(calendarId);
	// getAclRule(calendarId, 'user:' + calendarId);
	// grantUserOwnerPermissionToCalendar(calendarId, userId);
	// updateUserPermissionToCalendarToReadOnly(calendarId, 'user:' + userId, userId);
	// removeUserPermissionToCalendar(calendarId, 'user:' + userId);
}

function getAclRule(calendarId, ruleId) {
	return cal.Acl.get(calendarId, ruleId)
		.then(resp => {
			console.log(resp);
			return resp;
		}).catch(err => {
			console.log(err.message);
		});
}

function listAclOfCalendar(calendarId) {
	let params = { showDeleted: true };
	return cal.Acl.list(calendarId, params)
		.then(resp => {
			console.log(resp);
			return resp;
		}).catch(err => {
			console.log(err.message);
		});
}

function grantUserOwnerPermissionToCalendar(calendarId, userId) {
	let params = {
		scope: {
			type: 'user',
			value: userId
		},
		role: 'owner'
	};
	let optionalQueryParams = {
		sendNotifications: true
	};
	return cal.Acl.insert(calendarId, params, query)
		.then(resp => {
			console.log(resp);
			return resp;
		}).catch(err => {
			console.log(err.message);
		});
}

function removeUserPermissionToCalendar(calendarId, ruleId) {
	return cal.Acl.delete(calendarId, ruleId)
		.then(resp => {
			console.log(resp);
			return resp;
		}).catch(err => {
			console.log(err.message);
		});
}

function updateUserPermissionToCalendarToReadOnly(calendarId, ruleId, userId) {
	let params = {
		scope: {
			type: 'user',
			value: userId
		},
		role: 'reader'
	};
	let optionalQueryParams = {
		sendNotifications: true
	};
	return cal.Acl.update(calendarId, ruleId, params, query)
		.then(resp => {
			console.log(resp);
			return resp;
		}).catch(err => {
			console.log(err.message);
		});
}
