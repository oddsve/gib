var express = require('express');
    glob = require('glob');

var passport = require('./lib/passport');

module.exports = app = express();
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/public');
app.use(express.logger());
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

function withoutBase (file) { return file.replace('public/', ''); }
var css = glob.sync('public/resources/gib-*.css').map(withoutBase);

app.get('/', function (req, res) {
  res.render('index.html', { css: css });
});
app.get('/auth/github', passport.authenticate('github', { scope: ['repo', 'public_repo'] }));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), function (req, res) {
  res.redirect('/#/token/' + req.user.accessToken);
});

