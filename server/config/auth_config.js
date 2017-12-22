var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../data/models/user');

var checkPassword = function(user, pw, cb){
    bcrypt.compare(pw, user.pwhash, cb);
};

var authenticate = function(username, pw, done){
    User.findByName(username, function(err, user){
        if (err || !user){
            return done(err, null);
        } else {
            checkPassword(user, pw, function(err, passwordCorrect){
                if (err || !passwordCorrect){
                    return done(null, null, err);
                } else {
                    return done(null, user);
                }
            });
        }
    });
};

var serializeUser = function(user, done){
  if(user.id)
    done(null, user.id);
  else
    done(null, user._id);
};

var deserializeUser = function(id, done){
  User.get(id, function(err, user){
    if(err || !user)
      return done(null, null, null);
    done(null, user);
  });
};

// make passport use the above defined methods
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

// use the standard password procedure
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, authenticate));

module.exports = passport;
