var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');
var dotenv       = require('dotenv');
var authRoutes   = require('./server/routes/auth');
var companyRoutes = require('./server/routes/company');
var projectRoutes = require('./server/routes/project');
var employeeRouter = require('./server/routes/employee');
var taskRouter = require('./server/routes/tasks');
const expressValidator = require('express-validator');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));
dotenv.config();

app.use('/api/v1/', authRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/project', projectRoutes);
app.use('/api/v1/employee', employeeRouter);
app.use('/api/v1/task', taskRouter);

app.get('*', (req, res) => res.status(400).end('Sorry, not found'));

module.exports = app;
