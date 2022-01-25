const express = require('express');
const projectRouter = express.Router();
const projectController = require('../controllers/project');

const authenticate = require('../middlewares/authjwt');

projectRouter.post('/create',authenticate.verifyToken,authenticate.isAdmin,projectController.create);
projectRouter.get('/', authenticate.verifyToken, authenticate.isAdmin ,projectController.list);
projectRouter.get('/:projectId', authenticate.verifyToken, authenticate.isAdmin, projectController.retrieve);
projectRouter.put('/:projectId',authenticate.verifyToken, authenticate.isAdmin, projectController.update);
projectRouter.delete('/:projectId', authenticate.verifyToken, authenticate.isAdmin, projectController.delete);

module.exports = projectRouter;