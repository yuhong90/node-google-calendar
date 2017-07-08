const Promise = require('bluebird');
const calEvents = require('./Events');
const calSettings = require('./Settings');
const calFreeBusy = require('./FreeBusy');
const Request = require('./HttpRequest');
const httpRequest = new Request();

const gcalBaseUrl = 'https://www.googleapis.com/calendar/v3/';
const calUrl = `${gcalBaseUrl}calendars/`;
const settingUrl = `${gcalBaseUrl}users/me/settings/`;
const freebusyUrl = `${gcalBaseUrl}freeBusy`;

class CalendarAPI {

	constructor(config) {
		if (config === undefined) {
			throw new Error('Missing configuration parameters in constructor');
		}

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

		this._timezone = config.timezone;
		this._events = new calEvents(httpRequest, this._JWT, calUrl);
		this._settings = new calSettings(httpRequest, this._JWT, settingUrl);
		this._freeBusy = new calFreeBusy(httpRequest, this._JWT, freebusyUrl, this._timezone);
	}

	get Events() {
		return this._events;
	}

	get Settings() {
		return this._settings;
	}

	get FreeBusy() {
		return this._freeBusy;
	}
}

module.exports = CalendarAPI;