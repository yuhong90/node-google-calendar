let sinon = require('sinon');
let chai = require('chai');
let expect = chai.expect;


describe('Events.js', function () {
	let events;
	let mockEvent = {
		kind: 'calendar#event',
		etag: '\"0000000000000000\"',
		id: '12345',
		status: 'confirmed',
		htmlLink: 'https://www.google.com/calendar/event?eid=12345',
		created: '2017-01-01T00:00:00.000Z',
		updated: '2017-01-01T00:00:00.722Z',
		summary: 'event summary',
		location: '',
		creator: { email: '..@gmail.com', self: true },
		organizer: { email: '..@gmail.com', self: true },
		start: { dateTime: '2017-07-01T00:30:00+08:00' },
		end: { dateTime: '2017-07-01T01:00:00+08:00' },
		iCalUID: '12345@google.com',
		sequence: 0,
		reminders: { useDefault: true }
	};

	before(() => {
		events = require('../src/Events');
	});

	it('Should return error if missing arguments when calling constructor', () => {
		try {
			let eventsInstance = new events();
		} catch (err) {
			const expectError = new Error('Events constructor: Missing arguments');
			expect(err.message).to.eql(expectError.message);
		}
	});

	it('Should return error when calling Events.list with missing calendarId argument', () => {
		let expectedResult = new Error('Events.list: Missing calendarId argument; Check if defined in params and Settings file');

		let eventsInstance = new events('httpRequest', 'jwt', 'gcalurl');
		return eventsInstance.list(undefined, {})
			.catch((err) => {
				expect(expectedResult.message).to.eql(err.message);
			});
	});

	it('Should return error when calling Events.get with missing calendarId argument', () => {
		let expectedResult = new Error('Events.get: Missing calendarId argument; Check if defined in params and Settings file');

		let eventsInstance = new events('httpRequest', 'jwt', 'gcalurl');
		return eventsInstance.get(undefined, {})
			.catch((err) => {
				expect(expectedResult.message).to.eql(err.message);
			});
	});


	it('Should return error when calling Events.get with missing eventId argument', () => {
		let expectedResult = new Error('Events.get: Missing eventId argument');

		let eventsInstance = new events('httpRequest', 'jwt', 'gcalurl');
		return eventsInstance.get('calendarId', undefined, {})
			.catch((err) => {
				expect(expectedResult.message).to.eql(err.message);
			});
	});

	it('Should return error when http response returns non-200 error code during Events.list', () => {
		let mockResponse = {
			statusCode: 400,
			statusMessage: 'Not Found',
			body: {
				error: {
					errors: [{ domain: 'global', reason: 'notFound', message: 'Not Found' }],
					code: 404,
					message: 'Not Found'
				}
			}
		};

		let mockHttpRequest = {
			get: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = new Error('Events.list Error: Resp StatusCode ' + mockResponse.statusCode + '(' + mockResponse.statusMessage + '):\nerrorBody:' + JSON.stringify(mockResponse.body));

		let eventsInstance = new events(mockHttpRequest, 'jwt', 'gcalurl');
		return eventsInstance.list('calendarid', {})
			.catch((err) => {
				expect(expectedResult.message).to.eql(err.message);
			});
	});

	it('Should return items in http response body when Events.list', () => {
		let mockResponse = {
			statusCode: 200,
			body: {
				kind: "calendar#events",
				etag: "\"abcd\"",
				summary: "Calendar Name",
				description: "",
				updated: "2017-01-01T00:00:00.000Z",
				timeZone: "Asia/Singapore",
				accessRole: "owner",
				defaultReminders: [],
				nextSyncToken: "",
				items: [mockEvent]
			}
		};

		let mockHttpRequest = {
			get: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body.items;

		let eventsInstance = new events(mockHttpRequest, 'jwt', 'gcalurl');
		return eventsInstance.list('calendarid', {})
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return http response body when Events.get', () => {
		let mockResponse = {
			statusCode: 200,
			body: mockEvent
		};

		let mockHttpRequest = {
			get: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let eventsInstance = new events(mockHttpRequest, 'jwt', 'gcalurl');
		return eventsInstance.get('calendarid', {})
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return http response body when Events.quickAdd', () => {
		let mockResponse = {
			statusCode: 200,
			body: mockEvent
		};
		let mockHttpRequest = {
			postWithQueryString: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let eventsInstance = new events(mockHttpRequest, 'jwt', 'gcalurl');
		return eventsInstance.quickAdd('calendarid', {})
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return http response body when Events.insert', () => {
		let mockResponse = {
			statusCode: 200,
			body: mockEvent
		};

		let mockHttpRequest = {
			post: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let eventsInstance = new events(mockHttpRequest, 'jwt', 'gcalurl');
		return eventsInstance.insert('calendarid', {})
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return http response body when Events.update', () => {
		let mockResponse = {
			statusCode: 200,
			body: mockEvent
		};
		let mockHttpRequest = {
			put: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let eventsInstance = new events(mockHttpRequest, 'jwt', 'gcalurl');
		return eventsInstance.update('calendarid', 'eventId', {})
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return statusCode 204 & delete success message when Events.delete', () => {
		let eventToDelete = 'eventid';
		let mockResponse = {
			statusCode: 204,
			body: ''
		};
		let mockHttpRequest = {
			delete: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = { eventId: eventToDelete, statusCode: mockResponse.statusCode, message: 'Event delete success' };

		let eventsInstance = new events(mockHttpRequest, 'jwt', 'gcalurl');
		return eventsInstance.delete('calendarid', eventToDelete, {})
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return http response body when Events.move', () => {
		let mockResponse = {
			statusCode: 200,
			body: mockEvent
		};

		let mockHttpRequest = {
			postWithQueryString: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let eventsInstance = new events(mockHttpRequest, 'jwt', 'gcalurl');
		let params = { 'destination': 'destination-calendar' };
		return eventsInstance.move('calendarid', 'eventId', params)
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return error when calling Events.move with missing destination CalendarId argument', () => {
		let expectedResult = new Error('Events.move: Missing destination CalendarId argument');

		let eventsInstance = new events('httpRequest', 'jwt', 'gcalurl');
		return eventsInstance.move('calendarId', 'eventid', {})
			.catch((err) => {
				expect(expectedResult.message).to.eql(err.message);
			});
	});

	it('Should return http response body when Events.watch', () => {
		let mockResponse = {
			statusCode: 200,
			body: mockEvent
		};
		let mockHttpRequest = {
			post: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let eventsInstance = new events(mockHttpRequest, 'jwt', 'gcalurl');
		return eventsInstance.watch('calendarid', {})
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return items in http response body when Events.instances', () => {
		let mockRecurringEvent = mockEvent;
		mockRecurringEvent.recurringEventId = '123456tpe5393ncn5iopj9u03k';
		mockRecurringEvent.originalStartTime = {
			dateTime: '2020-12-08T00:00:00+08:00',
			timeZone: 'Asia/Singapore'
		};

		let mockResponse = {
			statusCode: 200,
			body: {
				kind: "calendar#events",
				etag: "\"abcd\"",
				summary: "Calendar Name",
				description: "",
				updated: "2017-01-01T00:00:00.000Z",
				timeZone: "Asia/Singapore",
				accessRole: "owner",
				defaultReminders: [],
				nextSyncToken: "",
				items: [mockEvent]
			}
		};
		let mockHttpRequest = {
			get: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body.items;

		let eventsInstance = new events(mockHttpRequest, 'jwt', 'gcalurl');
		return eventsInstance.instances('calendarid', {})
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});
});
