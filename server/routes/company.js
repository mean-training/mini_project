const express = require('express');
const companyRouter = express.Router();
const companyController = require('../controllers/company');
const authenticate = require('../middlewares/authjwt');

companyRouter.get('/', authenticate.verifyToken, authenticate.isAdmin ,companyController.list);
companyRouter.get('/:companyId', authenticate.verifyToken, authenticate.isAdmin, companyController.retrieve);
companyRouter.put('/:companyId',authenticate.verifyToken, authenticate.isAdmin, companyController.update);
companyRouter.delete('/:companyId', authenticate.verifyToken, authenticate.isAdmin, companyController.delete);

module.exports = companyRouter;