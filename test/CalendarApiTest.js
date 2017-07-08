let chai = require('chai');
let expect = chai.expect;

describe('CalendarAPI.js', function () {
	let CalendarAPI;

	before(function () {
		CalendarAPI = require('../src/CalendarAPI');
	});

	it('Should return error if missing config when calling constructor', function () {
		try {
			const cal = new CalendarAPI();
		} catch (err) {
			const expectError = new Error('Missing configuration parameters in constructor');
			expect(err.message).to.eql(expectError.message);
		}
	});

	it('Should return error if config is missing keyfile', function () {
		try {
			config = { serviceAcctId: '..@...iam.gserviceaccount.com' };
			const cal = new CalendarAPI(config);
		} catch (err) {
			const expectError = new Error('Missing keyfile for Google OAuth; Check if defined in Settings file');
			expect(err.message).to.eql(expectError.message);
		}
	});

});
