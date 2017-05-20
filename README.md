# node-google-calendar
Simple node module that supports Google Calendar Events API

## Preparations

#### Start Using Service Accounts
This module does server to server authentication with Google APIs without any users being involved. 
When using Google APIs from the server (or any non-browser based application), authentication is performed through a Service Account, which is a special account representing your application. 

1. Create a service account if you dont have one. For more information about service accounts and server-to-server interactions such as those between a web application and a Google service: https://developers.google.com/identity/protocols/OAuth2ServiceAccount#authorizingrequests

2. A public/private key pair is generated for the service account, which is created from the Google API console. Take note of the service account's email address and store the service account's json or P12 private key file in a location accessible to your application. Your application needs them to make authorized API calls.

3. If a user wants to give access to his Google Calendar to your application, he must give specific permission for each of the calenders to the created Service Account using the supplied email address under the Google Calendar settings.

4. Create a `settings.js` file with the google account email address under USERID and the generated service account id as SERVICE_ACCT_ID. 

5. Update `settings.js` and specify IDs of each calendar that the service account has been granted access to. 


#### Providing key or keyfile for Google OAuth 

__To use the PEM keyfile__
Convert the downloaded .p12 key to PEM.

To do this, run the following in Terminal:

`openssl pkcs12 -in downloaded-key-file.p12 -out converted-key-file.pem -nodes`

Once done, export the keyfile var in `settings.js`.

__To use the JSON key__
Read the json key's private key and export the key var in `settings.js`.

To do that, add the following code in your `settings.js`.
```javascript
var fs = require('fs');
const KEYPATH = '../json-googleapi-key';
var json = fs.readFileSync(KEYPATH, 'utf8');
var key = JSON.parse(json).private_key;
module.exports.key = key;
```

## Getting Started

First, install the package with: `npm i node-google-calendar`.

Update the settings.js config file with calendarId, calendarUrl, serviceAcctId & keyfile location.

Your config file should look something like this:
```javascript
const KEYFILE = '<yourpem.pem>';
const SERVICE_ACCT_ID = '<your service account id>';

const CALENDAR_URL = '<your calendar url>';
const CALENDAR_ID = {
  'primary': '',
  'calendar-1': 'calendar1@group.calendar.google.com',
  'calendar-2': 'calendar2@group.calendar.google.com'
};
const TIMEZONE = 'UTC+08:00';

module.exports.calendarUrl = CALENDAR_URL;
module.exports.serviceAcctId = SERVICE_ACCT_ID;
module.exports.calendarId = CALENDAR_ID;
module.exports.keyfile = KEYFILE;           //or if using json keys - module.exports.key = key; 
module.exports.timezone = TIMEZONE;
```

To use, require the module file in your project and pass in the settings file.

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
	};  //Optional query parameters referencing google APIs

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
	let event = {
		'start': {
			'dateTime': '2017-05-20T07:00:00+08:00'
		},
		'end': {
			'dateTime': '2017-05-20T08:00:00+08:00'
		},
		'location': 'Coffeeshop',
		'summary': 'Breakfast',
		'status': 'confirmed',
		'description': '',
		'colorId': 1
	};
  
  cal.Events.insert(calendarId, event)
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
