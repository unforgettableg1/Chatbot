import express from 'express';
import { chat, getChats } from '../controllers/chat.controller.mjs';
import { protect } from '../middleware/auth.middleware.mjs';

const router = express.Router();

router.use(protect);

router.post('/', chat);
router.get('/:projectId', getChats);

export default router;
