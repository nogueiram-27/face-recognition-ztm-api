const handleRegister = (req, res, knex, bcrypt) => {
	const { email, name, password } = req.body;

	if (!email || !name || !password) {
		return res.status(400).json('Incorrect inputs for register')
	}

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
		.catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
	handleRegister: handleRegister
}