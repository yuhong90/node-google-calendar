const cal = require('./Calendars');
const calList = require('./CalendarList');
const calAcl = require('./Acl');
const calChannels = require('./Channels');
const calColors = require('./Colors');
const calEvents = require('./Events');
const calSettings = require('./Settings');
const calFreeBusy = require('./FreeBusy');
const Request = require('./HttpRequest');
const httpRequest = new Request();

const gcalBaseUrl = 'https://www.googleapis.com/calendar/v3/';
const calUrl = `${gcalBaseUrl}calendars/`;
const calListUrl = `${gcalBaseUrl}users/me/calendarList/`;
const settingUrl = `${gcalBaseUrl}users/me/settings/`;
const freebusyUrl = `${gcalBaseUrl}freeBusy/`;
const colourUrl = `${gcalBaseUrl}colors/`;
const channelUrl = `${gcalBaseUrl}channels/`;

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
		this._calendars = new cal(httpRequest, this._JWT, calUrl);
		this._calendarList = new calList(httpRequest, this._JWT, calListUrl);
		this._acl = new calAcl(httpRequest, this._JWT, calUrl);
		this._channels = new calChannels(httpRequest, this._JWT, channelUrl);
		this._colors = new calColors(httpRequest, this._JWT, colourUrl);
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

	get Calendars() {
		return this._calendars;
	}

	get CalendarList() {
		return this._calendarList;
	}

	get Acl() {
		return this._acl;
	}

	get Channels() {
		return this._channels;
	}

	get Colors() {
		return this._colors;
	}
}

module.exports = CalendarAPI;