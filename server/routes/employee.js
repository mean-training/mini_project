const express = require('express');
const employeeRouter = express.Router();
const employeeController = require('../controllers/employee');
const authenticate = require('../middlewares/authjwt')
const validateEmployee = require('../middlewares/employee.js')

/**
 * @api {post} /invite Invite Company Employee
 * @apiName InviteEmployee
 * @apiGroup Employee
 *
 * @apiParam {String} email Employee's unique email.
 *
 */
employeeRouter.post('/invite',authenticate.verifyToken, authenticate.isAdmin, validateEmployee.getExistingEmployee ,employeeController.inviteMember);
employeeRouter.post('/setUp/:email/:token', validateEmployee.getEmployeeDetail ,employeeController.accountSetup);
employeeRouter.put('/:id', authenticate.verifyToken, employeeController.update);
employeeRouter.delete('/:id',authenticate.verifyToken,authenticate.isAdmin,employeeController.delete);
employeeRouter.get('/:companyId',authenticate.verifyToken,authenticate.isAdmin, employeeController.list);

module.exports = employeeRouter;