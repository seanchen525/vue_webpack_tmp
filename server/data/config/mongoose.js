var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/MusicApp');
// console.log('mongooseJS');
// console.log(mongoose.connection);

var test = "testing";
module.exports= {
	mongoose: mongoose,
	test: test

}