var express = require('express');

var passport = require('./passport');

module.exports = app = express();

app.use(express.logger());
app.use(express.compress());
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(app.router)

app.get('/', function (req, res) {
  res.sendfile('public/index.html');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), function (req, res) {
  res.json(req.user);
});


