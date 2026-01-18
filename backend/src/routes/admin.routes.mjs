import express from 'express';
import User from '../models/User.mjs';
import Project from '../models/Project.mjs';
import Prompt from '../models/Prompt.mjs';
import { protect } from '../middleware/auth.middleware.mjs';

const router = express.Router();

router.use(protect);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().populate('userId', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all chats
router.get('/chats', async (req, res) => {
  try {
    const chats = await Prompt.find()
      .populate('userId', 'name email')
      .populate('projectId', 'name');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get database stats
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      projects: await Project.countDocuments(),
      chats: await Prompt.countDocuments(),
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
