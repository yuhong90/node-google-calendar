//example.js
const CALENDAR_URL = require('./config/settings').calendarUrl;
const CONFIG = require('./config/Settings');
const CalendarAPI = require('./CalendarAPI');
let cal = new CalendarAPI(CONFIG);
let calendarIdList = CONFIG.calendarId;

examples();

function examples() {
  // insertEvent(calendarIdList['primary'], "EventName", "2016-08-04T10:00:00+08:00", "2016-08-04T11:00:00+08:00", "drone", "confirmed", "some description here");
  // deleteEvent(calendarIdList['primary'], "6qc97pdhfei9snh0dn92o32248");
  // checkBusyPeriod(calendarIdList['primary'], "2016-08-04T09:00:00+08:00", "2016-08-04T21:00:00+08:00");
  listBookedEvent(calendarIdList['primary'], "2016-08-04T09:00:00+08:00", "2016-08-04T21:00:00+08:00", "drone");

}

function listBookedEvent(calendarId, startDateTime, endDateTime, query) {
  let bookedEventsArray = [];

  cal.listEvents(calendarId, startDateTime, endDateTime, query)
    .then(json => {
      for (let i = 0; i < json.length; i++) {
        let event = {
          id: json[i].id,
          summary: json[i].summary,
          location: json[i].location,
          start: json[i].start,
          end: json[i].end,
          status: json[i].status
        };
        bookedEventsArray.push(event);
      };

      console.log('List of events on calendar within time-range:');
      console.log(bookedEventsArray);

    }).catch(err => {
      console.log("listBookedEvent Error: " + err);
    });
};

function insertEvent(calendarId, eventSummary, startDateTime, endDateTime, location, status, description) {
  let colorId = 1;
  cal.insertEvent(calendarId, eventSummary, startDateTime, endDateTime, location, status, description, colorId)
    .then(resp => {
      let json = resp.body;
      let results = {
        'summary': json.summary,
        'location': json.location,
        'status': json.status,
        'htmlLink': CALENDAR_URL,
        'start': json.start.dateTime,
        'end': json.end.dateTime,
        'created': new Date(json.created)
      };
      console.log('inserted event:');
      console.log(results);
    })
    .catch(err => {
      console.log("insertEvent Error: " + err);
    });
};


function deleteEvent(calendarId, eventId) {
  return cal.deleteEvent(calendarId, eventId)
    .then(resp => {
      console.log('Deleted Event: ');
      console.log(resp);
    })
    .catch(err => {
      console.log("deleteEvent Error: " + err);
    });
};

function checkBusyPeriod(calendarId, startDateTime, endDateTime) {
  return cal.checkBusyPeriod(calendarId, startDateTime, endDateTime)
    .then(resp => {
      console.log('List of timings with events on calendar:');
      console.log(resp);
    })
    .catch(err => {
      console.log("checkBusyPeriod Error: " + err);
    });
};