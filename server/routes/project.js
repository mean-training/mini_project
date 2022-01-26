const express = require('express');
const projectRouter = express.Router();
const projectController = require('../controllers/project');

const authenticate = require('../middlewares/authjwt');
const validateProject = require('../middlewares/project');

projectRouter.post('/create',authenticate.verifyToken,authenticate.isAdmin,projectController.create);
projectRouter.get('/', authenticate.verifyToken, authenticate.isAdmin ,projectController.list);
projectRouter.get('/:projectId', authenticate.verifyToken, authenticate.isAdmin, projectController.retrieve);
projectRouter.put('/:projectId',authenticate.verifyToken, authenticate.isAdmin, projectController.update);
projectRouter.delete('/:projectId', authenticate.verifyToken, authenticate.isAdmin, projectController.delete);
projectRouter.post('/assign/:projectId',authenticate.verifyToken,authenticate.isAdmin,validateProject.getExistingEmployee ,projectController.assign);
projectRouter.delete('/unassign/:projectId',authenticate.verifyToken,authenticate.isAdmin,validateProject.getExistingEmployee ,projectController.unassign);
projectRouter.put('/:projectId/employee/:employeeId', authenticate.verifyToken, authenticate.isAdmin, projectController.restore);

module.exports = projectRouter;