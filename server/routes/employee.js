const express = require('express');
const employeeRouter = express.Router();
const employeeController = require('../controllers/employee');
const authenticate = require('../middlewares/authjwt')
const validateEmployee = require('../middlewares/employee');
const {validateEmployeeSetup, validateEmailArray , validateEmployeeUpdate , errorHandler } = require('../middlewares/validate');


/**
 * @api {post} /invite Invite Company Employee
 * @apiName InviteEmployee
 * @apiGroup Employee
 *
 * @apiParam {String} email Employee's unique email.
 *
 */
employeeRouter.post('/invite', authenticate.verifyToken, validateEmailArray(), errorHandler ,authenticate.isAdmin, validateEmployee.getExistingEmployee ,employeeController.inviteMember);
employeeRouter.post('/setUp/:email/:token', validateEmployeeSetup(), errorHandler ,validateEmployee.getEmployeeDetail,employeeController.accountSetup);
employeeRouter.put('/:id', authenticate.verifyToken, validateEmployeeUpdate(), errorHandler ,employeeController.update);
employeeRouter.delete('/:id',authenticate.verifyToken,authenticate.isAdmin,employeeController.delete);
employeeRouter.get('/:companyId',authenticate.verifyToken,authenticate.isAdmin, employeeController.list);

module.exports = employeeRouter;