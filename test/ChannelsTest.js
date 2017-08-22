let sinon = require('sinon');
let chai = require('chai');
let expect = chai.expect;
let channels = require('../src/Channels');

describe('Channels.js', function () {

	it('Should return error if missing arguments when calling constructor', () => {
		try {
			let channelsInstance = new channels();
		} catch (err) {
			const expectedError = new Error('Channels constructor: Missing arguments');
			expect(err.message).to.eql(expectedError.message);
		}
	});

	it('Should return http response body when Channels.stop', () => {
		let inputParams = {
			id: '01234567-89ab-cdef-0123456789ab',
			resourceId: 'o3hgv1538sdjfh'
		};
		let mockResponse = {
			statusCode: 204,
			statusMessage: 'Not Found',
			body: ''
		};
		let mockHttpRequest = {
			post: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = {
			uuid: inputParams.id,
			resourceId: inputParams.resourceId,
			statusCode: mockResponse.statusCode,
			statusMessage: mockResponse.statusMessage,
			message: 'Stop watching channel successfully'
		};

		let channelsInstance = new channels(mockHttpRequest, 'jwt', 'gcalurl');
		return channelsInstance.stop(inputParams)
			.then((results) => {
				expect(results).to.eql(expectedResult);
			});
	});
});

