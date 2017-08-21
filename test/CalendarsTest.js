let sinon = require('sinon');
let chai = require('chai');
let expect = chai.expect;
let calendars = require('../src/Calendars');

describe('Calendars.js', function () {

	it('Should return error if missing arguments when calling constructor', () => {
		try {
			let calendarsInstance = new calendars();
		} catch (err) {
			const expectError = new Error('Calendars constructor: Missing arguments');
			expect(err.message).to.eql(expectError.message);
		}
	});

	it('Should return http response body when Calendars.get', () => {
		let calendarId = 'calendarid@group.calendar.google.com';
		let mockResponse = {
			statusCode: 200,
			body: {
				kind: 'calendar#calendar',
				etag: '"12345vTLOjlc76YTigzSZVQwSEE/LNixQcFbmxtrdlb_YY0000-1234"',
				id: calendarId,
				summary: 'updated summary',
				description: 'calendar description',
				location: 'singapore',
				timeZone: 'Asia/Singapore'
			}
		};
		let mockHttpRequest = {
			get: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let calendarsInstance = new calendars(mockHttpRequest, 'jwt', 'gcalurl');
		return calendarsInstance.get(calendarId)
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return http response body when Calendars.insert', () => {
		let inputParams = {
			summary: 'summary of new calendar'
		};
		let mockResponse = {
			statusCode: 200,
			body: {
				kind: 'calendar#calendar',
				etag: '"12345vTLOjlc76YTigzSZVQwSEE/-A0VtlK_H38q03n8bJ6jaWkATUE"',
				id: '12345vvid08na97b8htkv1f0fo@group.calendar.google.com',
				summary: inputParams.summary
			}
		};
		let mockHttpRequest = {
			post: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let calendarsInstance = new calendars(mockHttpRequest, 'jwt', 'gcalurl');
		return calendarsInstance.insert(inputParams)
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return http response body when Calendars.update', () => {
		let calToUpdate = 'calendarid@group.calendar.google.com'
		let inputParams = {
			summary: 'updated summary',
			description: 'calendar description',
			location: 'singapore',
			timeZone: 'Asia/Singapore'
		};
		let mockResponse = {
			statusCode: 200,
			body: {
				kind: 'calendar#calendar',
				etag: '"12345vTLOjlc76YTigzSZVQwSEE/LNixQcFbmxtrdlb_YY0NNk-kbHs"',
				id: calToUpdate,
				summary: inputParams.summary,
				description: inputParams.description,
				location: inputParams.location,
				timeZone: inputParams.timeZone
			}
		};
		let mockHttpRequest = {
			put: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let calendarsInstance = new calendars(mockHttpRequest, 'jwt', 'gcalurl');
		return calendarsInstance.update(calToUpdate, inputParams)
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return statusCode 204 & delete success message when Calendars.delete', () => {
		let calendarToDelete = 'calendarid';
		let mockResponse = {
			statusCode: 204,
			body: ''
		};
		let mockHttpRequest = {
			delete: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = { calendarId: calendarToDelete, statusCode: mockResponse.statusCode, message: 'Calendar delete success' };

		let calendarsInstance = new calendars(mockHttpRequest, 'jwt', 'gcalurl');
		return calendarsInstance.delete('calendarid', calendarToDelete, {})
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return statusCode 200 & clear success message when Calendars.clear', () => {
		let calendarToClear = 'calendarid';
		let mockResponse = {
			statusCode: 200,
			body: ''
		};
		let mockHttpRequest = {
			post: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = { calendarId: calendarToClear, statusCode: mockResponse.statusCode, message: 'Calendar clear success' };

		let calendarsInstance = new calendars(mockHttpRequest, 'jwt', 'gcalurl');
		return calendarsInstance.clear('calendarid', calendarToClear, {})
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});
});