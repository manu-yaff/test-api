const request = require('supertest');
const chai = require('chai');

const app = require('../app/server');

describe('Greeting Palenca', () => {
	it('should return a gretting with 200 status', () => {
		request(app)
			.get('/')
			.expect(200)
			.end((err, _) => {
				if (err) throw err;
			});
	});
});

describe('Loggin in', () => {
	it('return 401 and corresponding message when credentails are incorrect', async () => {
		await request(app)
			.post('/uber/login')
			.send({
				email: 'me@palenca.com',
				password: 'MyPwdChigon123',
			})
			.expect(401)
			.then(async (response) => {
				chai.expect(response.body.message).to.equal('CREDENTIALS_INVALID');
				chai
					.expect(response.body.details)
					.to.equal('Incorrect username or password');
			});
	});
	it('return 200 and corresponding message when credentials are correct', async () => {
		await request(app)
			.post('/uber/login')
			.send({
				email: 'pierre@palenca.com',
				password: 'MyPwdChingon123',
			})
			.expect(200)
			.then(async (response) => {
				chai.expect(response.body.message).to.equal('SUCCESS');
				chai.should().exist(response.body.access_token);
			});
	});
});

describe('Getting user profile', () => {
	it('return 401 and corresponding token is invalid', async () => {
		await request(app)
			.get('/uber/profile/1234')
			.expect(401)
			.then(async (response) => {
				chai.expect(response.body.message).to.equal('CREDENTIALS_INVALID');
				chai.expect(response.body.details).to.equal('Incorrect token');
			});
	});
	it('return 200 and corresponding message token is valid', async () => {
		let token;
		await request(app)
			.post('/uber/login')
			.send({
				email: 'pierre@palenca.com',
				password: 'MyPwdChingon123',
			})
			.then(async (response) => {
				token = response.body.access_token;
			});

		await request(app)
			.get(`/uber/profile/${token}`)
			.expect(200)
			.then(async (response) => {
				chai.expect(response.body.message).to.equal('SUCCESS');
				chai.expect(response.body.platform).to.equal('uber');
			});
	});
});
