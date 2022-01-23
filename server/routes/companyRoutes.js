const express = require('express');
const companyRouter = express.Router();
const companyController = require('../controllers/company');

companyRouter.post('/signUp',companyController.signUp);

module.exports = companyRouter;