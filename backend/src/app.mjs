import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.mjs';
import projectRoutes from './routes/project.routes.mjs';
import chatRoutes from './routes/chat.routes.mjs';
import adminRoutes from './routes/admin.routes.mjs';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'AI Chatbot API is running!' });
});

export default app;
