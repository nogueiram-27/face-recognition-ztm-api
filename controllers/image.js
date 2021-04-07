const Clarifai = require ('clarifai');
if(process.env.NODE_ENV !== 'production') require('dotenv').config();
const clarifaiAPIKey = process.env.CLARIFAI_API_KEY;


const app = new Clarifai.App({
 apiKey: clarifaiAPIKey
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