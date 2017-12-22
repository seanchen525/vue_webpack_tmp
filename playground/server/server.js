const express = require('express')
const app = express()
var path    = require("path");

app.use(express.static(__dirname + '/View'));
//Store all HTML files in view folder.
//app.use(express.static(__dirname + '/Script'));
//Store all JS and CSS in Scripts folder.

app.get('/pitch', function(req, res) {
	res.sendFile(path.join(__dirname+'/View/pitchSample/pitchSample.html'));
  //__dirname : It will resolve to your project folder.
})

app.get('/function', function(req, res) {
	res.sendFile(path.join(__dirname+'/View/functionSample/functionSample.html'));
  //__dirname : It will resolve to your project folder.
})

app.listen(8080, function(){
	console.log('Server listening on port 8080!')
})