//example-settings.js

const KEYFILE = 'googleapi-keyfile.pem';
var SERVICE_ACCT_ID = '<your service account id>';
var CALENDAR_ID = {
  'calendar-1': 'calendar1@group.calendar.google.com',
  'calendar-2': 'calendar2@group.calendar.google.com'
};

module.exports.calendarId = CALENDAR_ID;
module.exports.serviceAcctId = SERVICE_ACCT_ID;
module.exports.keyfile = KEYFILE;