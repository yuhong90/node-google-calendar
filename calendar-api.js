// obtain a JWT-enabled version of request
var request = require('google-oauth-jwt').requestWithJWT();
const Promise = require('bluebird');
const qs = require('querystring');

var KEYFILE = 'keyfile.pem';
var USERID = require('../settings').userId;
var SERVICE_ACCT_ID = require('../settings').serviceAcctId;
var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var jwt = {
    // use the email address of the service account, as seen in the API console
    email: SERVICE_ACCT_ID,
    // use the PEM file we generated from the downloaded key
    keyFile: KEYFILE,
    // specify the scopes you wish to access - each application has different scopes
    scopes: SCOPES
};
const TIMEZONE = "UTC+08:00";

/**
 * Returns a promise that list all events on calendar during selected period. 
 *
 * @param {string} startDateTime (optional) - start datetime of event in 2016-04-29T14:00:00+08:00 format
 * @param {string} endDateTime (optional) - end datetime of event in 2016-04-29T18:00:00+08:00 format
 */
exports.listEvents = function(startDateTime, endDateTime, query) {
    return new Promise(function(fulfill, reject) {
        if (startDateTime != undefined && endDateTime != undefined) {
            var param = { timeMin: startDateTime, timeMax: endDateTime, q: query };
        }

        request({
            url: 'https://www.googleapis.com/calendar/v3/calendars/' + USERID + '/events',
            jwt: jwt,
            qs: param,
            useQuerystring: true
        }, function(err, res, body) {
            var resp = JSON.parse(body);
            if (err) {
                console.log("listEvents error");
                reject({ error: 'Connection error' });
            }

            if (resp.error != undefined) {
                console.log("listEvents error");
                reject(resp.error);
            }

            fulfill(resp.items);
        });
    });
};

/**
 * Checks if queried calendar slot is busy during selected period. 
 * Returns promise of list of events at specified slot.
 *
 * @param {string} startDateTime - start datetime of event in 2016-04-29T14:00:00+08:00 format
 * @param {string} endDateTime - end datetime of event in 2016-04-29T18:00:00+08:00 format
 */
exports.checkTimeslotBusy = function(startDateTime, endDateTime) {
    var event = {
        "timeMin": startDateTime,
        "timeMax": endDateTime,
        "timeZone": TIMEZONE,
        "items": [{ "id": USERID }]
    };

    return new Promise(function(fulfill, reject) {

        request.post({
            url: 'https://www.googleapis.com/calendar/v3/freeBusy',
            json: true,
            body: event,
            jwt: jwt
        }, function(err, res, body) {
            if (err) {
                reject({ error: 'Connection error' });
            }
            if (body.calendars[USERID].errors != undefined) {
                reject();
            }

            console.log(body.calendars[USERID]);
            var eventsList = body.calendars[USERID].busy;
            fulfill(body.calendars[USERID].busy);

        });
    });
};

/**
 * Insert an event on the user's primary calendar. Returns promise of details of booking
 *
 * @param {string} bookingSummary - Name to be specified in calendar event summary
 * @param {string} startDateTime - start datetime of event in 2016-04-29T14:00:00+08:00 format
 * @param {string} endDateTime - end datetime of event in 2016-04-29T18:00:00+08:00 format
 * @param {string} location - Location description of event
 * @param {string} status - event status - confirmed, tentative, cancelled; tentative for all queuing
 */
exports.insertEvent = function(bookingSummary, startDateTime, endDateTime, location, status, description, colour) {
    var event = {
        "start": {
            "dateTime": startDateTime
        },
        "end": {
            "dateTime": endDateTime
        },
        "location": location,
        "summary": bookingSummary,
        "status": status,
        "description": description,
        "colorId": colour,
    };

    return new Promise(function(fulfill, reject) {
        request.post({
            url: 'https://www.googleapis.com/calendar/v3/calendars/' + USERID + '/events',
            json: true,
            body: event,
            jwt: jwt
        }, function(err, res, body) {
            if (err) {
                console.log('Error contacting the Calendar service: ' + err);
                reject({ error: 'Connection error' });
            }
            if (body.error != undefined) {
                console.log('Error contacting the Calendar service: ' + body.error);
                reject(body.error);
            }
            fulfill(body);
        });
    });
};

exports.deleteEvent = function(eventId) {
    return new Promise(function(fulfill, reject) {
        if (eventId == undefined) {
            return { error: 'eventId to delete cannot be empty'};
        }

        request.del({
            url: 'https://www.googleapis.com/calendar/v3/calendars/' + USERID + '/events/' + eventId,
            jwt: jwt
        }, function(err, res, body) { 
            if(res.statusCode == 204){
                fulfill({status: 'success'});
            }else{ 
                var bod = JSON.parse(body); 
                reject( { status: 'failed', error: bod.error.message} );
            }
           
        });
    });
};