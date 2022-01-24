const express = require('express');
const authRouter = express.Router();
const companyController  = require('../controllers/company');
const employeeController =  require('../controllers/employee');

authRouter.post('/signUp',companyController.signUp);
authRouter.post('/setUp/:email/:token',employeeController.setUp);
authRouter.post('/login',employeeController.login);

module.exports = authRouter;