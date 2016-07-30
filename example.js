//example.js
var cal = require('./calendar-api.js');

function listBookedEvent(startDateTime, endDateTime, query) {
    var response = [];
    
    cal.listEvents(startDateTime, endDateTime, query).then(function(json) {
        console.log('listBookedEvent successful:');
        for (i = 0; i < json.length; i++) {
            var event = {
                id: json[i].id,
                summary: json[i].summary,
                location: json[i].location,
                start: json[i].start,
                end: json[i].end,
                status: json[i].status
            };
            response.push(event);
        }
        console.log(response);
    }, function(json) {
        console.log("listBookedEvent failed : " + JSON.stringify(json));
    });
   
};

listBookedEvent("2016-05-24T10:00:00+08:00", "2016-05-29T00:00:00+08:00", "queen-1");