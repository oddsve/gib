var express = require('express');

module.exports = app = express();

app.use(express.static(__dirname + '/public'));

