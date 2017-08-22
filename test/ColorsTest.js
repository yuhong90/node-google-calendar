let sinon = require('sinon');
let chai = require('chai');
let expect = chai.expect;
let colors = require('../src/Colors');

describe('Colors.js', function () {

	it('Should return error if missing arguments when calling constructor', () => {
		try {
			let colorsInstance = new colors();
		} catch (err) {
			const expectedError = new Error('Colors constructor: Missing arguments');
			expect(err.message).to.eql(expectedError.message);
		}
	});

	it('Should return http response body when Colors.get', () => {
		let mockResponse = {
			statusCode: 200,
			body: {
				kind: 'calendar#colors',
				updated: '2012-02-14T00:00:00.000Z',
				calendar:
				{
					'1': { background: '#ac725e', foreground: '#1d1d1d' },
					'2': { background: '#d06b64', foreground: '#1d1d1d' },
					'3': { background: '#f83a22', foreground: '#1d1d1d' },
				},
				event:
				{
					'1': { background: '#a4bdfc', foreground: '#1d1d1d' },
					'2': { background: '#7ae7bf', foreground: '#1d1d1d' },
					'3': { background: '#dbadff', foreground: '#1d1d1d' },
				}
			}
		};
		let mockHttpRequest = {
			get: sinon.stub().resolves(mockResponse)
		};
		let expectedResult = mockResponse.body;

		let colorsInstance = new colors(mockHttpRequest, 'jwt', 'gcalurl');
		return colorsInstance.get()
			.then((results) => {
				expect(results).to.eql(expectedResult);
			});
	});
});

