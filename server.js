const express = require('express');
const bcrypt = require('bcrypt-nodejs');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@testmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@testmail.com',
			password: 'bananas',
			entries: 1,
			joined: new Date()
		},		

	]
}

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {


	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json('success')
	} else {
		res.status(400).json('error login in')
	}
	
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;

	bcrypt.hash(password, null, null, function(err, hash) {
    	console.log(hash);
	});

	database.users.push({
		id: '125',
		name,
		email,
		password,
		entries: 0,
		joined: new Date()
	})

	res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;

	database.users.forEach(user => {
		if(user.id === id) {
			found = true;
			return res.json(user);
		}
	})

	if (!found) {
		res.json('user not found')
	}
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;

	database.users.forEach(user => {
		if(user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	})

	if (!found) {
		res.json('user not found')
	}
})

app.listen(8080, () => {
	console.log('face-recognition-api is running on port 8080');
})



/*
	bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
	});
// Load hash from your password DB.

bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});*/