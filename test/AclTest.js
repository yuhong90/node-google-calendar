let sinon = require('sinon');
let chai = require('chai');
let expect = chai.expect;
let acl = require('../src/Acl');

describe('Acl.js', function () {
	let mockCalendarId = 'calendarid@group.calendar.google.com';
	let mockServiceAccountId = 'serviceaccount@proj-name.iam.gserviceaccount.com';
	let mockAclRuleWithCalendarAsOwner = {
		kind: 'calendar#aclRule',
		etag: '"00000000000000000000"',
		id: 'user:calendar1@group.calendar.google.com',
		scope: {
			type: 'user',
			value: 'calendar1@group.calendar.google.com'
		},
		role: 'owner'
	};
	let mockAclRuleWithServiceAccountAsOwner = {
		kind: 'calendar#aclRule',
		etag: '"00001234567890001000"',
		id: 'user:' + mockServiceAccountId,
		scope: {
			type: 'user',
			value: mockServiceAccountId
		},
		role: 'owner'
	};

	it('Should return error if missing arguments when calling constructor', () => {
		try {
			let aclInstance = new acl();
		} catch (err) {
			const expectError = new Error('Acl constructor: Missing arguments');
			expect(err.message).to.eql(expectError.message);
		}
	});

	it('Should return http response body when Acl.list', () => {
		let mockResponse = {
			statusCode: 200,
			body: {
				kind: 'calendar#acl',
				etag: '"12345na52o7jta0g"',
				nextSyncToken: '00000000290433603000',
				items:
				[
					mockAclRuleWithCalendarAsOwner,
					mockAclRuleWithServiceAccountAsOwner
				]
			}
		};
		let mockHttpRequest = {
			get: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let aclInstance = new acl(mockHttpRequest, 'jwt', 'gcalurl');
		return aclInstance.list()
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return http response body when Acl.get', () => {
		let ruleId = 'user:' + mockServiceAccountId;
		let mockResponse = {
			statusCode: 200,
			body: mockAclRuleWithServiceAccountAsOwner
		};
		let mockHttpRequest = {
			get: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let aclInstance = new acl(mockHttpRequest, 'jwt', 'gcalurl');
		return aclInstance.get(mockCalendarId, ruleId)
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return http response body when Acl.insert', () => {
		let userToGrantAccessToCalendar = 'user@gmail.com';
		let inputParams = {
			scope: { type: 'user', value: userToGrantAccessToCalendar },
			role: 'owner'
		};
		let mockResponse = {
			statusCode: 200,
			body: {
				kind: 'calendar#aclRule',
				etag: '"00000000001000000000"',
				id: 'user:' + inputParams.scope.value,
				scope: { type: 'user', value: inputParams.scope.value },
				role: 'owner'
			}
		};
		let mockHttpRequest = {
			post: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let aclInstance = new acl(mockHttpRequest, 'jwt', 'gcalurl');
		return aclInstance.insert(mockCalendarId, inputParams)
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return http response body when Acl.update', () => {
		let ruleId = 'user:' + mockServiceAccountId;
		let inputParams = {
			scope: { type: 'user', value: mockServiceAccountId },
			role: 'reader'
		};
		let mockResponse = {
			statusCode: 200,
			body: {
				kind: 'calendar#aclRule',
				etag: '"00000000001000000000"',
				id: ruleId,
				scope: { type: 'user', value: inputParams.scope.value },
				role: 'reader'
			}
		};
		let mockHttpRequest = {
			put: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let aclInstance = new acl(mockHttpRequest, 'jwt', 'gcalurl');
		return aclInstance.update(mockCalendarId, ruleId, inputParams)
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return statusCode 204 & delete success message when Acl.delete', () => {
		let ruleId = 'user:' + mockServiceAccountId;
		let mockResponse = {
			statusCode: 204,
			statusMessage: 'No Content',
			body: ''
		};
		let mockHttpRequest = {
			delete: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = {
			ruleId: ruleId,
			calendarId: mockCalendarId,
			statusCode: mockResponse.statusCode,
			statusMessage: mockResponse.statusMessage,
			message: 'Acl rule deleted successfully'
		};

		let aclInstance = new acl(mockHttpRequest, 'jwt', 'gcalurl');
		return aclInstance.delete(mockCalendarId, ruleId)
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});

	it('Should return http response body when Acl.watch', () => {
		let inputParams = {
			'id': '01234567-89ab-cdef-0123456789ab', 				// Your channel ID.
			'type': 'web_hook',
			'address': 'https://mydomain.com/notifications', 		// Your receiving URL.
			'token': 'target=myApp-myAclChannelDest', 				// (Optional) Your channel token.
			'expiration': 1426325213000 							// (Optional) Your requested channel expiration time.
		};
		let mockResponse = {
			statusCode: 200,
			body: {
				'kind': 'api#channel',
				'id': inputParams.id, 																			// ID you specified for this channel.
				'resourceId': 'o3hgv1538sdjfh', 																// ID of the watched resource.
				'resourceUri': 'https://www.googleapis.com/calendar/v3/calendars/my_calendar@gmail.com/acl', 	// Version-specific ID of the watched resource.
				'token': inputParams.token, 																	// Present only if one was provided.
				'expiration': inputParams.expiration 															// Actual expiration time as Unix timestamp (in ms), if applicable.
			}
		};
		let mockHttpRequest = {
			post: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let aclInstance = new acl(mockHttpRequest, 'jwt', 'gcalurl');
		return aclInstance.watch(inputParams)
			.then((results) => {
				expect(expectedResult).to.eql(results);
			});
	});
});