var express = require('express');
var app = express();
var mongoose = require('./server/data/config/mongoose');
var routes = require('./server/routes/index');
var body = require('body-parser');
// var path = require('path');

var port = process.env.port || 3000;

app.use(body.json());
routes(app);

// app.engine('html', require('ejs').renderFile);
// app.set('views', './client/views');
// app.set('view engine', 'html');

// app.use(function(req, res, next){
//     if (req.x-auth == undefined 
//         && req.originalUrl != "/user/login" && req.originalUrl != "/"){
//         res.redirect("/");
//     }
//     console.log(req.originalUrl);
//     next();
// });

app.listen(port, function(){
    console.log('Server is running on ' + port);
});