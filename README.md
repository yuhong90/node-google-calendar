# node-google-calendar
Simple node module that supports Google Calendar Events API

## Preparations

####Start Using Service Accounts
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
var SERVICE_ACCT_ID = '<your service account id>';

const CALENDAR_URL = '<your calendar url>';
var CALENDAR_ID = {
  'primary': '',
  'calendar-1': 'calendar1@group.calendar.google.com',
  'calendar-2': 'calendar2@group.calendar.google.com'
};

module.exports.calendarId = CALENDAR_ID;
module.exports.serviceAcctId = SERVICE_ACCT_ID;
module.exports.keyfile = KEYFILE;       //or if using json keys - module.exports.key = key; 
module.exports.calendarUrl = CALENDAR_URL;
```

To use, require the module file in your project and pass in the settings file.

```javascript
  const CalendarAPI = require('node-google-calendar');
  const CONFIG = require('./config/Settings');
  let cal = new CalendarAPI(CONFIG);  
```

You should now be able to query your specified calendar and try out the following examples. 



## APIs
[Google Calendar APIs v3](https://developers.google.com/google-apps/calendar/v3/reference/events) supported includes list Events, insert Events, delete Event.


#####listEvents(calendarId, startDateTime, endDateTime, query)
Returns a promise that lists all events in calendar between `startDateTime` & `endDateTime`.

Example:
```javascript
  cal.listEvents(calendarId,"2016-04-28T08:00:00+08:00", "2016-04-28T12:00:00+08:00", "meeting").then(function(json){
      //Success
      console.log("list all events " );
   }, function (json){
      //Error
      console.log("list events error : " + json);
   });
```

#####insertEvent(calendarId, bookingSummary, startDateTime, endDateTime, location, status, description, colour)
Insert an event on the user's primary calendar. Returns promise of details of booking.

Example:
```javascript
  cal.insertEvent(calendarId, "Lunch Meeting with Edison", "2016-05-23T12:00:00+08:00", "2016-05-23T13:00:00+08:00", 
  "Open Pantry", "confirmed", "BYOF", 1).then(function(json){
  		console.log('added event! : ' + JSON.stringify(json));
  	}, function(){
  		console.log('error : ' + JSON.stringify(json));
  	});;
```

#####checkBusyPeriod(calendarId, startDateTime, endDateTime)
Checks if queried calendar slot is busy during selected period. 
Returns promise of list of events at specified slot. 

Example:
```javascript
  cal.checkBusyPeriod(calendarId,"2016-05-23T10:00:00+08:00", "2016-05-23T11:00:00+08:00").then(function(eventsJson){ 
    if (eventsJson != undefined && eventsJson.length > 0){
      busyOrFree = 'busy';
    }else{
      busyOrFree = 'free';
    }
    console.log('slot is ' + busyOrFree);  
  }, function(err){
    console.log('error checkTimeslot' + err);
  });
```

#####deleteEvent(calendarId, eventId)
Deletes an Event on Calendar with EventId.
Returns promise of results. 

Example:
```javascript
  cal.deleteEvent(calendarId,'vglrakdceu6jai4sm5lo5y3ah').then(function(jsonResults) {
      console.log('delete Event:' + JSON.stringify(jsonResults));
  }, function(err) {
      console.log('Error deleteEvent: ' + JSON.stringify(err));
  });
```

More examples [here](https://github.com/yuhong90/node-google-calendar/blob/master/example/Example.js).
