const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'super-admin',
    database : 'face_recognition_ztm'
  }
});

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('hello world');
})

app.post('/signin', (req, res) => {
	const { email, password } = req.body;
	knex.select('email', 'hash').from('login')
		.where({'email': email})
		.then(data => {
			if (bcrypt.compareSync(password, data[0].hash)) {
				knex.select('*').from('users')
				.where({'email': email})
				.then(user => {
					res.json(user[0])
				})
				.catch(err => res.status(400).json('unable to get user'))
			} else {
				res.status(400).json('invalid credentials')
			}
		})
		.catch(err => res.status(400).json('unable to get user'))
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;

	const hash = bcrypt.hashSync(password);

	knex.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => { 
			trx.insert({
				email: loginEmail[0],
				name: name,
				joined: new Date()
			})
			.into('users')
			.returning('*')
			.then(user => {
				res.json(user[0]);
			})
			.catch(err => res.status(400).json(err))
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
		.catch(err => res.status(400).json(err, 'Unable to register'))

})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;

	knex.select('*').from('users').where({id : id})
		.then(user => {
			if (user.length) {
				res.json(user[0])
			} else {
				res.status(404).json('user not found')
			}
			
		})
		.catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
	const { id } = req.body;

	knex('users').where({id : id})
	.increment('entries', 1).returning('entries')
		.then(entries => {
			if(entries.length) {
				res.json(entries[0])
			} else {
				res.status(404).json('user not found')
			}
		})
		.catch(err => res.status(400).json('error updating entries'))
})

app.listen(8080, () => {
	console.log('face-recognition-api is running on port 8080');
})