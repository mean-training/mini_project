const express = require('express');
const projectRouter = express.Router();
const projectController = require('../controllers/project');

const authenticate = require('../middlewares/authjwt');
const validateProject = require('../middlewares/project');

projectRouter.post('/create',authenticate.verifyToken,authenticate.isAdmin,projectController.create);
projectRouter.get('/', authenticate.verifyToken, authenticate.isAdmin ,projectController.list);
projectRouter.get('/company/:companyId', authenticate.verifyToken, authenticate.isAdmin , validateProject.canAccessProject , projectController.listByCompany);
projectRouter.get('/:projectId', authenticate.verifyToken, authenticate.isAdmin,projectController.retrieve);
projectRouter.put('/:projectId/company/:companyId',authenticate.verifyToken, authenticate.isAdmin, validateProject.canAccessProject ,projectController.update);
projectRouter.delete('/:projectId/company/:companyId', authenticate.verifyToken, authenticate.isAdmin,validateProject.canAccessProject ,projectController.delete);
projectRouter.put('/:projectId/company/:companyId/restore', authenticate.verifyToken, authenticate.isAdmin,validateProject.canAccessProject ,projectController.restore);
projectRouter.post('/assign/:projectId',authenticate.verifyToken,authenticate.isAdmin,validateProject.getExistingEmployee, validateProject.canAccessProject ,projectController.assign);
projectRouter.delete('/unassign/:projectId',authenticate.verifyToken,authenticate.isAdmin,validateProject.getExistingEmployee,validateProject.canAccessProject,projectController.unassign);
projectRouter.put('/restore/:projectId', authenticate.verifyToken, authenticate.isAdmin, validateProject.getExistingEmployee, validateProject.canAccessProject, projectController.restoreProjectMember);

module.exports = projectRouter;