const express = require('express');
const employeeRouter = express.Router();
const employeeController = require('../controllers/employee');
const authenticate = require('../middlewares/authjwt')

employeeRouter.post('/invite',authenticate.verifyToken, authenticate.isAdmin ,employeeController.inviteMember);

module.exports = employeeRouter;