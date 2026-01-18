import express from 'express';
import { createProject, getProjects, deleteProject } from '../controllers/project.controller.mjs';
import { protect } from '../middleware/auth.middleware.mjs';

const router = express.Router();

router.use(protect);

router.post('/', createProject);
router.get('/', getProjects);
router.delete('/:id', deleteProject);

export default router;
