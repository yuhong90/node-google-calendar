let sinon = require('sinon');
let chai = require('chai');
let expect = chai.expect;

describe('Settings.js', function () {
	let settings;

	before(() => {
		settings = require('../src/Settings');
	});

	it('Should return error if missing arguments when calling constructor', () => {
		try {
			let settingsInstance = new settings();
		} catch (err) {
			const expectError = new Error('Settings constructor: Missing arguments');
			expect(err.message).to.eql(expectError.message);
		}
	});

	it('Should return http response body when Settings.get', () => {
		let mockResponse = {
			statusCode: 200,
			body: {
				"kind": "calendar#setting",
				"etag": "\"1234567890000000\"",
				"id": "settingsId",
				"value": "0"
			}
		};

		let mockHttpRequest = {
			get: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let settingsInstance = new settings(mockHttpRequest, 'jwt', 'gcalurl');
		return settingsInstance.get('settingsId', {})
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return http response body when Settings.list', () => {
		let mockResponse = {
			statusCode: 200,
			body: {
				kind: 'calendar#settings',
				etag: '"1234btin3uq6d80g"',
				nextSyncToken: '00000001230014858000',
				items:
				[{
					kind: 'calendar#setting',
					etag: '"1461662921234000"',
					id: 'locale',
					value: 'en'
				},
				{
					kind: 'calendar#setting',
					etag: '"1412340000000000"',
					id: 'defaultEventLength',
					value: '60'
				},
				{
					kind: 'calendar#setting',
					etag: '"1461662921234000"',
					id: 'timezone',
					value: 'UTC'
				}]
			}
		};

		let mockHttpRequest = {
			get: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let settingsInstance = new settings(mockHttpRequest, 'jwt', 'gcalurl');
		return settingsInstance.list('settingsId', {})
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return http response body when Settings.watch', () => {
		let inputParams = {
			'id': '01234567-89ab-cdef-0123456789ab', 				// Your channel ID.
			'type': 'web_hook',
			'address': 'https://mydomain.com/notifications', 		// Your receiving URL.
			'token': 'target=myApp-mySettingsChannelDest', 			// (Optional) Your channel token.
			'expiration': 1426325213000 							// (Optional) Your requested channel expiration time.
		};
		let mockResponse = {
			statusCode: 200,
			body: {
				'kind': 'api#channel',
				'id': inputParams.id, 															// ID you specified for this channel.
				'resourceId': 'o3hgv1538sdjfh', 												// ID of the watched resource.
				'resourceUri': 'https://www.googleapis.com/calendar/v3/users/me/settings', 		// Version-specific ID of the watched resource.
				'token': inputParams.token, 													// Present only if one was provided.
				'expiration': inputParams.expiration 											// Actual expiration time as Unix timestamp (in ms), if applicable.
			}
		};
		let mockHttpRequest = {
			post: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let settingsInstance = new settings(mockHttpRequest, 'jwt', 'gcalurl');
		return settingsInstance.watch(inputParams)
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});
});
