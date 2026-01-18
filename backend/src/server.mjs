import dotenv from 'dotenv';
dotenv.config();

import app from './app.mjs';
import connectDB from './config/db.mjs';

const PORT = process.env.PORT || 8000;

// IIFE to use async/await at top level
(async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();
