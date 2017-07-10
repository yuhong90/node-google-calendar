# node-google-calendar
[![Build Status](https://travis-ci.org/yuhong90/node-google-calendar.svg?branch=master)](https://travis-ci.org/yuhong90/node-google-calendar)
[![Known Vulnerabilities](https://snyk.io/test/github/yuhong90/node-google-calendar/badge.svg)](https://snyk.io/test/github/yuhong90/node-google-calendar)


Simple node module that supports Google Calendar Events API

This module does server to server authentication with Google APIs without any users being involved. 
When using Google APIs from the server (or any non-browser based application), authentication is performed through a Service Account, which is a special account representing your application.    

Find out more about [preparations needed](https://github.com/yuhong90/node-google-calendar/wiki#preparations-needed) to setting up the [service account](https://github.com/yuhong90/node-google-calendar/wiki#setup-service-accounts), grant calendar access, [auth key to google](https://github.com/yuhong90/node-google-calendar/wiki#providing-key-or-keyfile-for-google-oauth) and the configurations needed to start using node-google-calendar.
   
   

## Getting Started

First, install the [npm package](https://www.npmjs.com/package/node-google-calendar) with: `npm i node-google-calendar --save`.

Provide in a `settings.js` config file with serviceAcctId, calendarIds, timezone & keyfile location.   
Check out [preparations needed](https://github.com/yuhong90/node-google-calendar/wiki#preparations-needed) if you have trouble supplying these configurations. Sample config file [here](https://github.com/yuhong90/node-google-calendar/blob/master/config/Settings.js).   

Your config file should look something like this:
```javascript
const SERVICE_ACCT_ID = '<your service account id>';
const KEYFILE = '<yourpem.pem>';
const TIMEZONE = 'UTC+08:00';
const CALENDAR_ID = {
  'primary': '',
  'calendar-1': 'calendar1@group.calendar.google.com',
  'calendar-2': 'calendar2@group.calendar.google.com'
};

module.exports.serviceAcctId = SERVICE_ACCT_ID;
module.exports.keyfile = KEYFILE;           	//or if using json keys -> module.exports.key = key; 
module.exports.timezone = TIMEZONE;
module.exports.calendarId = CALENDAR_ID;
```

To use, require this module in your project and pass in the configurations file.

```javascript
  const CONFIG = require('./config/Settings');
  const CalendarAPI = require('node-google-calendar');
  let cal = new CalendarAPI(CONFIG);  
```

You should now be able to query your specified calendar and try out the following examples.   


## APIs
[Google Calendar APIs v3](https://developers.google.com/google-apps/calendar/v3/reference/events) supported includes APIs in resource types of [Events](https://developers.google.com/google-apps/calendar/v3/reference/events), [FreeBusy](https://developers.google.com/google-apps/calendar/v3/reference/freebusy) & [Settings](https://developers.google.com/google-apps/calendar/v3/reference/settings). Some examples are as follows:

### [Events](https://github.com/yuhong90/node-google-calendar/blob/master/src/Events.js) Examples 
Events.list - To Get a promise of all single events in calendar within a time period.
```javascript
let params = {
	timeMin: '2017-05-20T06:00:00+08:00',
	timeMax: '2017-05-25T22:00:00+08:00',
	q: 'query term',
	singleEvents: true,
	orderBy: 'startTime'
}; 	//Optional query parameters referencing google APIs

cal.Events.list(calendarId, params)
  .then(json => {
	//Success
	console.log('List of events on calendar within time-range:');
	console.log(json);
  }).catch(err => {
	//Error
	console.log('Error: listSingleEvents -' + err);
  });
```

Events.insert - Insert an event on a specified calendar. Returns promise of details of new event.
```javascript
let params = {
	'start': { 'dateTime': '2017-05-20T07:00:00+08:00' },
	'end': { 'dateTime': '2017-05-20T08:00:00+08:00' },
	'location': 'Coffeeshop',
	'summary': 'Breakfast',
	'status': 'confirmed',
	'description': '',
	'colorId': 1
};

cal.Events.insert(calendarId, params)
  .then(resp => {
	console.log('inserted event:');
	console.log(resp);
  })
  .catch(err => {
	console.log('Error: insertEvent-' + err);
  });
```

Events.delete - Deletes an Event on a specified Calendar with EventId. Returns promise of results. 
```javascript
let params = {
	sendNotifications: true
};
  
cal.Events.delete(calendarId, eventId, params)
  .then(function(jsonResults) {
	console.log('delete Event:' + JSON.stringify(jsonResults));
  }, function(err) {
        console.log('Error deleteEvent: ' + JSON.stringify(err));
  });
```

### [FreeBusy](https://github.com/yuhong90/node-google-calendar/blob/master/src/FreeBusy.js) Examples 
FreeBusy.query - Checks if queried calendar slot is busy during selected period. Returns promise of list of events at specified slot. 
```javascript
let params = {
	"timeMin": '2017-05-20T08:00:00+08:00',
	"timeMax": '2017-05-20T09:00:00+08:00',
	"items": [{ "id": calendarId }]
};

cal.FreeBusy.query(calendarId, params)
  .then(resp => {
  	console.log('List of busy timings with events within defined time range: ');
        console.log(resp);
  })
  .catch(err => {
	console.log('Error: checkBusy -' + err);
  });
```

### [Settings](https://github.com/yuhong90/node-google-calendar/blob/master/src/Settings.js) Examples
Settings.list - List user settings  
```javascript
let params = {};
cal.Settings.list(params)
  .then(resp => {
  	console.log('List settings with settingID: ' + settingId);
	console.log(resp);
  })
  .catch(err => {
	console.log('Error: getSettings -' + err);
  });
```

More examples [here](https://github.com/yuhong90/node-google-calendar/blob/master/example/Example.js).
