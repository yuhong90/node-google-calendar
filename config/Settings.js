//Sample CalendarAPI settings

const SERVICE_ACCT_ID = '<your service account id>';
const CALENDAR_ID = {
  'primary': '',
  'calendar-1': 'calendar1@group.calendar.google.com',
  'calendar-2': 'calendar2@group.calendar.google.com'
};
const TIMEZONE = 'UTC+08:00';
const KEYFILE = 'googleapi-keyfile.pem';			//path to pem key

module.exports.serviceAcctId = SERVICE_ACCT_ID;
module.exports.calendarId = CALENDAR_ID;
module.exports.timezone = TIMEZONE;
module.exports.keyfile = KEYFILE;		

//Example for using json keys
// var fs = require('fs');
// const KEYPATH = '../json-googleapi-key';
// var json = fs.readFileSync(KEYPATH, 'utf8');
// var key = JSON.parse(json).private_key;
// module.exports.key = key;