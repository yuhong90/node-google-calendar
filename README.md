# node-google-calendar
Simple node module that manages google calendar events

## Using Service Accounts
This module does server to server authentication with Google APIs without any users being involved. 
When using Google APIs from the server (or any non-browser based application), authentication is performed through a Service Account, which is a special account representing your application. 

1. Create a service account if you dont have one. For more information about service accounts and server-to-server interactions such as those between a web application and a Google service: https://developers.google.com/identity/protocols/OAuth2ServiceAccount#authorizingrequests

2. A public/private key pair is generated for the service account, which is created from the Google API console. Take note of the service account's email address and store the service account's P12 private key file in a location accessible to your application. Your application needs them to make authorized API calls.

3. If a user wants to give access to his Google Calendar to your application, he must give specific permission for that calender to the the Service Account using the supplied email address.

## Authentication to Google APIs done with JWT
When using OAuth2, authentication is performed using a token that has been obtained first by submitting a JSON Web Token (JWT), using [google-oauth-jwt](https://github.com/extrabacon/google-oauth-jwt).

## APIs
Require calendar-api.js file in your project.
`var cal = require('./calendar-api.js');`

#####listEvents(startDateTime, endDateTime)
Returns a promise that lists all events in calendar between `startDateTime` & `endDateTime`.
Example:
```javascript
cal.listEvents("2016-04-28T08:00:00+08:00", "2016-04-28T12:00:00+08:00").then(function(json){
    //Success
    console.log("list all events " );
 }, function (json){
    //Error
    console.log("list events error : " + json);
 });
```

#####insertEvent(bookingSummary, startDateTime, endDateTime, location, status, description)
Insert an event on the user's primary calendar. Returns promise of details of booking.
Example:
```javascript
cal.insertEvent("Lunch Meeting with Edison", "2016-05-23T12:00:00+08:00", "2016-05-23T13:00:00+08:00", 
"Open Pantry", "confirmed", "BYOF").then(function(json){
		console.log('added event! : ' +JSON.stringify(json));
	}, function(){
		console.log('error : ' + json);
	});;
```

#####checkTimeslotBusy(startDateTime, endDateTime)
Checks if queried calendar slot is busy during selected period. 
Returns promise of list of events at specified slot. Example:
```javascript
cal.checkTimeslotBusy("2016-05-23T10:00:00+08:00", "2016-05-23T11:00:00+08:00").then(function(eventsJson){ 
  if (eventsJson != undefined && eventsJson.length > 0){
    busyOrFree = 'busy';
  }else{
    busyOrFree = 'free';
  }
  console.log('slot is ' + busyOrFree);  
}, function(){
  console.log('error checkTimeslot');
});
```
