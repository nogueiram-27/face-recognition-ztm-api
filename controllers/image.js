const Clarifai = require ('clarifai');


const app = new Clarifai.App({
 apiKey: '1a666ff735764bb1b3d4e8c1b5765cc5'
});

const handleAPICall = (req, res) => {
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => { res.json(data) })
		.catch(err => res.status(400).json('enable to handle request'))
}


const handleImage = (req, res, knex) => {
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
}

module.exports = {
	handleImage: handleImage,
	handleAPICall: handleAPICall
}