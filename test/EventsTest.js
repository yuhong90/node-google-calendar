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

	it('Should return rejected promise with error when calling Events.list with missing calendarId argument', () => {
		let expectErr = { origin: 'Events.list', error: 'Missing calendarId argument; Check if defined in params and Settings file' };
		let expectedResult = new Error(JSON.stringify(expectErr));

		let eventsInstance = new events('httpRequest', 'jwt', 'gcalurl');
		return eventsInstance.list(undefined, {})
			.catch((err) => {
				expect(err.message).to.eql(expectedResult.message);
			});
	});

	it('Should return rejected promise with error when calling Events.get with missing calendarId argument', () => {
		let expectErr = { origin: 'Events.get', error: 'Missing calendarId argument; Check if defined in params and Settings file' };
		let expectedResult = new Error(JSON.stringify(expectErr));

		let eventsInstance = new events('httpRequest', 'jwt', 'gcalurl');
		return eventsInstance.get(undefined, {})
			.catch((err) => {
				expect(err.message).to.eql(expectedResult.message);
			});
	});

	it('Should return rejected promise with error when calling Events.get with missing eventId argument', () => {
		let expectErr = { origin: 'Events.get', error: 'Missing eventId argument' };
		let expectedResult = new Error(JSON.stringify(expectErr));

		let eventsInstance = new events('httpRequest', 'jwt', 'gcalurl');
		return eventsInstance.get('calendarId', undefined, {})
			.catch((err) => {
				expect(err.message).to.eql(expectedResult.message);
			});
	});

	it('Should return rejected promise with error when http response returns error during Events.get', () => {
		let mockErrorMessage = 'test error';
		let mockResponse = new Error(mockErrorMessage);

		let mockHttpRequest = {
			get: sinon.stub().rejects(mockResponse)
		};
		let expectedResult = {
			origin: 'Events.get',
			error: mockErrorMessage
		};

		let eventsInstance = new events(mockHttpRequest, 'jwt', 'gcalurl');
		return eventsInstance.get('calendarid', 'eventid', {})
			.catch((err) => {
				expect(JSON.parse(err.message)).to.eql(expectedResult);
			});
	});

	it('Should return rejected promise with error when http response returns non-200 error code with errorMessage string in body during Events.get', () => {
		let mockResponse = {
			statusCode: 400,
			statusMessage: 'Not Found',
			body: 'Not Found'
		};

		let mockHttpRequest = {
			get: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = {
			origin: 'Events.get',
			error: {
				statusCode: `${mockResponse.statusCode}(${mockResponse.statusMessage})`,
				errorBody: mockResponse.body
			}
		};

		let eventsInstance = new events(mockHttpRequest, 'jwt', 'gcalurl');
		return eventsInstance.get('calendarid', 'eventid', {})
			.catch((err) => {
				let errorObject = JSON.parse(err.message);
				expect(errorObject).to.eql(expectedResult);
			});
	});

	it('Should return rejected promise with error when http response returns non-200 error code during Events.list', () => {
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
		let expectedResult = {
			origin: 'Events.list',
			error: {
				statusCode: `${mockResponse.statusCode}(${mockResponse.statusMessage})`,
				errorBody: mockResponse.body
			}
		};

		let eventsInstance = new events(mockHttpRequest, 'jwt', 'gcalurl');
		return eventsInstance.list('calendarid', {})
			.catch((err) => {
				let errorObject = JSON.parse(err.message);
				expect(errorObject).to.eql(expectedResult);
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
				expect(results).to.eql(expectedResult);
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
				expect(results).to.eql(expectedResult);
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
		return eventsInstance.quickAdd('calendarid', { text: 'meeting 10am' })
			.then((results) => {
				expect(results).to.eql(expectedResult);
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
				expect(results).to.eql(expectedResult);
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
				expect(results).to.eql(expectedResult);
			});
	});

	it('Should return statusCode 204 & delete success message when Events.delete', () => {
		let eventToDelete = 'eventid';
		let mockResponse = {
			statusCode: 204,
			statusMessage: 'No Content',
			body: ''
		};
		let mockHttpRequest = {
			delete: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = {
			eventId: eventToDelete,
			statusCode: mockResponse.statusCode,
			statusMessage: mockResponse.statusMessage,
			message: 'Event deleted successfully'
		};

		let eventsInstance = new events(mockHttpRequest, 'jwt', 'gcalurl');
		return eventsInstance.delete('calendarid', eventToDelete, {})
			.then((results) => {
				expect(results).to.eql(expectedResult);
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
				expect(results).to.eql(expectedResult);
			});
	});

	it('Should return rejected promise with error when calling Events.move with missing destination CalendarId argument', () => {
		let expectedResult = new Error('Events.move: Missing destination CalendarId argument');

		let eventsInstance = new events('httpRequest', 'jwt', 'gcalurl');
		return eventsInstance.move('calendarId', 'eventid', {})
			.catch((err) => {
				expect(expectedResult.message).to.eql(err.message);
			});
	});

	it('Should return http response body when Events.watch', () => {
		let calendarId = 'my_calendar@gmail.com';
		let inputParams = {
			'id': '01234567-89ab-cdef-0123456789ab', 				// Your channel ID.
			'type': 'web_hook',
			'address': 'https://mydomain.com/notifications', 		// Your receiving URL.
			'token': 'target=myApp-myEventsChannelDest', 				// (Optional) Your channel token.
			'expiration': 1426325213000 							// (Optional) Your requested channel expiration time.
		};
		let mockResponse = {
			statusCode: 200,
			body: {
				'kind': 'api#channel',
				'id': inputParams.id, 																			// ID you specified for this channel.
				'resourceId': 'o3hgv1538sdjfh', 																// ID of the watched resource.
				'resourceUri': `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, 		// Version-specific ID of the watched resource.
				'token': inputParams.token, 																	// Present only if one was provided.
				'expiration': inputParams.expiration 															// Actual expiration time as Unix timestamp (in ms), if applicable.
			}
		};
		let mockHttpRequest = {
			post: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let eventsInstance = new events(mockHttpRequest, 'jwt', 'gcalurl');
		return eventsInstance.watch(calendarId, {})
			.then((results) => {
				expect(results).to.eql(expectedResult);
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
				expect(results).to.eql(expectedResult);
			});
	});
});
