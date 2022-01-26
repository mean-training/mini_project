const express = require('express');
const  taskRouter = express.Router();
const taskController = require('../controllers/task');
const authenticate = require('../middlewares/authjwt');
const validateTask = require('../middlewares/task');

taskRouter.post('/create', authenticate.verifyToken ,taskController.create);
taskRouter.post('/assign/:taskId', authenticate.verifyToken,authenticate.isAdmin,validateTask.getExistingEmployee,validateTask.canAccessTask,taskController.assign);
taskRouter.delete('/unassign/:taskId', authenticate.verifyToken,authenticate.isAdmin,validateTask.getExistingEmployee,validateTask.canAccessTask,taskController.unassign);
taskRouter.put('/restore/:taskId', authenticate.verifyToken,authenticate.isAdmin,validateTask.getExistingEmployee,validateTask.canAccessTask,taskController.restoreTaskMember);
taskRouter.put('/:taskId', authenticate.verifyToken,authenticate.isAdmin,taskController.update);
taskRouter.delete('/:taskId', authenticate.verifyToken,authenticate.isAdmin,taskController.delete);
taskRouter.put('/:taskId/restore', authenticate.verifyToken,authenticate.isAdmin,taskController.restore);
taskRouter.get('/company/:companyId', authenticate.verifyToken,authenticate.isAdmin,validateTask.canAccessTask,taskController.list);
taskRouter.get('/company/:companyId/employee/:employeeId', authenticate.verifyToken,authenticate.isAdmin,validateTask.canAccessTask,taskController.listByEmployee);


module.exports = taskRouter;