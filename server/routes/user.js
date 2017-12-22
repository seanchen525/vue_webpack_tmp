const _ = require('lodash');
const express = require('express');
var router = express.Router();
var {User} = require('../data/models/user');
var {authenticate} = require('../data/middleware/authenticate');

// POST /user/login {username, password}
router.post('/login', (req, res) =>{
	var body = _.pick(req.body,['username', 'password']);
	console.log("in the login req");
	
	User.findByCredentials(body.username, body.password).then((user) => {
		console.log(user);
		return user.generateAuthToken().then((token) =>{
			res.header('x-auth', token).send(user);
		});
	}).catch((e) =>{
		res.status(400).send();
	});
});

// POST / user/signup    --- Create 
router.post('/signup',(req, res) =>{
	var body = _.pick(req.body, ['username', 'email', 'password']);
	var user = User(body);

	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) =>{
		res.status(400).send(e);
	});
});

// User Logout by delete token
router.delete('/logout', authenticate,(req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, () => {
		res.status(400).send();
	});
});

module.exports = router;