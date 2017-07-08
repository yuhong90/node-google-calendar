let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');

describe('Events.js', function () {
	let events;

	before(() => {
		events = require('../src/Events');
	});

	it('Should return error if missing arguements when calling constructor', () => {
		try {
			let eventsInstance = new events();
		} catch (err) {
			const expectError = new Error('Events constructor: Missing arguments');
			expect(err.message).to.eql(expectError.message);
		}
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
				items: [{
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
				}]
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
			body: {
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
			}
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
});
