var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');
var dotenv       = require('dotenv');
var companyRoutes = require('./server/routes/companyRoutes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
dotenv.config();

app.use('/api/v1/',companyRoutes);

app.get('*', (req, res) => res.status(400).end('Sorry, not found'));

module.exports = app;
