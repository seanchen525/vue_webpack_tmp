// Configure the app
var express = require('express');
var session = require('express-session');
var config = require('./services_config');
var body = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var RedisStore = require('connect-redis')(session);
var path = require('path');
var routes = require('../routes/index');
var serveStatic = require('serve-static');

module.exports = function(app, auth){

  // app.configure(function(){
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/../../client/views');

    // static project files
    app.use(serveStatic(__dirname + '/../../client/public'));

    // server uploaded files
    var uploadedPath = path.join(__dirname, '..', 'uploads');
    app.use('/uploads', serveStatic(uploadedPath));

    // various express helpers
    app.use(body);
    app.use(methodOverride);
    app.use(cookieParser);

    // set up the session store
    app.use(session({
      store: new RedisStore({
        port: config.redis.port,
        host: config.redis.host,
        pass: config.redis.pass
      }),
      secret: config.sessionSecret,
      cookie: {
        maxAge: 604800000
      }
    }));

    // initialize auth
    app.use(auth.initialize());
    app.use(auth.session());

    // make the user available
    app.use(function(req, res, next) {
      res.locals.user = req.user;
      next();
    });

    // initialize the router
    routes(app);
  // });

};