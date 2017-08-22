let sinon = require('sinon');
let chai = require('chai');
let expect = chai.expect;
let calendarList = require('../src/CalendarList');

describe('CalendarList.js', function () {
	let mockCalendarId = 'calendarid@group.calendar.google.com';
	let mockCalendarListEntry1 = {
		kind: 'calendar#calendarListEntry',
		etag: '"123456789100000"',
		id: 'calendar1@group.calendar.google.com',
		summary: 'calendar1',
		description: 'calendar1 description',
		timeZone: 'Asia/Singapore',
		colorId: '16',
		backgroundColor: '#4986e7',
		foregroundColor: '#000000',
		selected: true,
		accessRole: 'owner',
		defaultReminders: []
	};
	let mockCalendarListEntry2 = {
		kind: 'calendar#calendarListEntry',
		etag: '"123456789110000"',
		id: 'calendar2@group.calendar.google.com',
		summary: 'calendar2',
		description: 'calendar2 description',
		timeZone: 'Asia/Singapore',
		colorId: '13',
		backgroundColor: '#92e1c0',
		foregroundColor: '#000000',
		selected: true,
		accessRole: 'owner',
		defaultReminders: []
	};

	it('Should return error if missing arguments when calling constructor', () => {
		try {
			let calendarListInstance = new calendarList();
		} catch (err) {
			const expectError = new Error('CalendarList constructor: Missing arguments');
			expect(err.message).to.eql(expectError.message);
		}
	});

	it('Should return http response body when CalendarList.list', () => {
		let mockResponse = {
			statusCode: 200,
			body: {
				kind: 'calendar#calendarList',
				etag: '"12345tin3uq12345"',
				nextSyncToken: 'ABC-yu1234567890YWxlbmRlci1hcGktc2VydmljZUBnZHMtcm9vbS1ib29raW5nLWNhbGVuZGFyLmlhbS5nc2VydmljZWFjY291bnQ12345',
				items: [
					mockCalendarListEntry1,
					mockCalendarListEntry2
				]
			}
		};
		let mockHttpRequest = {
			get: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let calendarListInstance = new calendarList(mockHttpRequest, 'jwt', 'gcalurl');
		return calendarListInstance.list()
			.then((results) => {
				expect(results).to.eql(expectedResult);
			});
	});

	it('Should return http response body when CalendarList.get', () => {
		let mockResponse = {
			statusCode: 200,
			body: mockCalendarListEntry1
		};
		let mockHttpRequest = {
			get: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let calendarListInstance = new calendarList(mockHttpRequest, 'jwt', 'gcalurl');
		return calendarListInstance.get(mockCalendarId)
			.then((results) => {
				expect(results).to.eql(expectedResult);
			});
	});

	it('Should return http response body when CalendarList.insert', () => {
		let inputParams = {
			summaryOverride: 'test insert summary',
			colorId: '17',
			foregroundColor: '#000000',
			backgroundColor: '#9a9cff',
			selected: true,
			hidden: false
		};
		let mockResponse = {
			statusCode: 200,
			body: {
				kind: 'calendar#calendarListEntry',
				etag: '"1234567890100000"',
				id: mockCalendarId,
				summary: 'calendar1',
				timeZone: 'UTC',
				summaryOverride: inputParams.summaryOverride,
				colorId: inputParams.colorId,
				backgroundColor: inputParams.backgroundColor,
				foregroundColor: inputParams.foregroundColor,
				selected: inputParams.selected,
				accessRole: 'owner',
				defaultReminders: []
			}
		};
		let mockHttpRequest = {
			post: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let calendarListInstance = new calendarList(mockHttpRequest, 'jwt', 'gcalurl');
		return calendarListInstance.insert(mockCalendarId, inputParams)
			.then((results) => {
				expect(results).to.eql(expectedResult);
			});
	});

	it('Should return http response body when calendarList.update', () => {
		let calendarToUpdate = 'calendarid@group.calendar.google.com'
		let inputParams = {
			summaryOverride: 'test update summary',
			colorId: '17',
			foregroundColor: '#000000',
			backgroundColor: '#9a9cff',
			selected: true,
			hidden: false
		};
		let mockResponse = {
			statusCode: 200,
			body: {
				kind: 'calendar#calendarListEntry',
				etag: '"1234567890100000"',
				id: calendarToUpdate,
				summary: 'calendar1',
				timeZone: 'UTC',
				summaryOverride: inputParams.summaryOverride,
				colorId: inputParams.colorId,
				backgroundColor: inputParams.backgroundColor,
				foregroundColor: inputParams.foregroundColor,
				selected: inputParams.selected,
				accessRole: 'owner',
				defaultReminders: []
			}
		};
		let mockHttpRequest = {
			put: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let calendarListInstance = new calendarList(mockHttpRequest, 'jwt', 'gcalurl');
		return calendarListInstance.update(calendarToUpdate, inputParams)
			.then((results) => {
				expect(results).to.eql(expectedResult);
			});
	});

	it('Should return statusCode 204 & delete success message when calendarList.delete', () => {
		let mockResponse = {
			statusCode: 204,
			statusMessage: 'No Content',
			body: ''
		};
		let mockHttpRequest = {
			delete: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = {
			calendarId: mockCalendarId,
			statusCode: mockResponse.statusCode,
			statusMessage: mockResponse.statusMessage,
			message: 'Calendar entry deleted successfully from CalendarList'
		};

		let calendarListInstance = new calendarList(mockHttpRequest, 'jwt', 'gcalurl');
		return calendarListInstance.delete(mockCalendarId)
			.then((results) => {
				expect(results).to.eql(expectedResult);
			});
	});

	it('Should return rejected promise with error when http response returns non-200 error code during calendarList.delete', () => {
		let mockResponse = {
			statusCode: 404,
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
			delete: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = {
			origin: 'CalendarList.delete',
			error: {
				statusCode: `${mockResponse.statusCode}(${mockResponse.statusMessage})`,
				errorBody: mockResponse.body
			}
		};

		let calendarListInstance = new calendarList(mockHttpRequest, 'jwt', 'gcalurl');
		return calendarListInstance.delete(mockCalendarId)
			.catch((err) => {
				expect(JSON.parse(err.message)).to.eql(expectedResult);
			});
	});

	it('Should return http response body when calendarList.watch', () => {
		let inputParams = {
			'id': '01234567-89ab-cdef-0123456789ab', 				// Your channel ID.
			'type': 'web_hook',
			'address': 'https://mydomain.com/notifications', 		// Your receiving URL.
			'token': 'target=myApp-myCalendarListChannelDest', 		// (Optional) Your channel token.
			'expiration': 1426325213000 							// (Optional) Your requested channel expiration time.
		};
		let mockResponse = {
			statusCode: 200,
			body: {
				'kind': 'api#channel',
				'id': inputParams.id, 																			// ID you specified for this channel.
				'resourceId': 'o3hgv1538sdjfh', 																// ID of the watched resource.
				'resourceUri': 'https://www.googleapis.com/calendar/v3/users/me/calendarList/', 				// Version-specific ID of the watched resource.
				'token': inputParams.token, 																	// Present only if one was provided.
				'expiration': inputParams.expiration 															// Actual expiration time as Unix timestamp (in ms), if applicable.
			}
		};
		let mockHttpRequest = {
			post: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let calendarListInstance = new calendarList(mockHttpRequest, 'jwt', 'gcalurl');
		return calendarListInstance.watch(inputParams)
			.then((results) => {
				expect(results).to.eql(expectedResult);
			});
	});

});