const express = require('express');
const bodyParser = require('body-parser');
const jsonwebtoken = require('jsonwebtoken');
const validators = require('./validators');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 2222;

const JWT_SECRET =
	'goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu';

app.get('/', (_, res) => {
	const greeting = 'Hello Palenca';
	console.log(greeting);
	res.setHeader('Content-Type', 'application/json');
	res.status(200).json({ message: greeting, status: 'sucess' });
});

app.post('/uber/login', (req, res) => {
	const { email, password } = req.body;

	if (
		!validators.validateEmail(email) ||
		!validators.validatePassword(password)
	) {
		return res.status(401).json({
			message: 'CREDENTIALS_INVALID',
			details: 'Incorrect username or password',
		});
	}

	if (email === 'pierre@palenca.com' && password === 'MyPwdChingon123') {
		return res.status(200).json({
			message: 'SUCCESS',
			access_token: jsonwebtoken.sign(
				{ user: 'pierre@palenca.com' },
				JWT_SECRET
			),
		});
	}

	return res.status(401).json({
		message: 'CREDENTIALS_INVALID',
		details: 'Incorrect username or password',
	});
});

app.get('/uber/profile/:token', (req, res) => {
	const { token } = req.params;
	try {
		jsonwebtoken.verify(token, JWT_SECRET);
		return res.status(200).json({
			message: 'SUCCESS',
			platform: 'uber',
			profile: {
				country: 'mx',
				city_name: 'Ciudad de Mexico',
				worker_id: '34dc0c89b16fd170eba320ab186d08ed',
				first_name: 'Pierre',
				last_name: 'Delarroqua',
				email: 'pierre@palenca.com',
				phone_prefix: '+52',
				phone_number: '5576955981',
				rating: '4.8',
				lifetime_trips: 1254,
			},
		});
	} catch (err) {
		return res
			.status(401)
			.json({ message: 'CREDENTIALS_INVALID', details: 'Incorrect token' });
	}
});

app.listen(PORT);
console.log(`API listening on port ${PORT}`);

module.exports = app;
