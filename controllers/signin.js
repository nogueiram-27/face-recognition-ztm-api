const handleSignIn = (req, res, knex, bcrypt) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json('Incorrect inputs for sigin')
	}

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
}

module.exports = {
	handleSignIn: handleSignIn
}