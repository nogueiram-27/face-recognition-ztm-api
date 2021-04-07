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


const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');


const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('hello world') })

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, knex, bcrypt) })

app.post('/register', (req, res) => { register.handleRegister(req, res, knex, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, knex) })

app.put('/image', (req, res) => { image.handleImage(req, res, knex) })

app.put('/imageurl', (req, res) => { image.handleAPICall(req, res) })



app.listen(8080, () => { console.log('face-recognition-api is running on port 8080') })