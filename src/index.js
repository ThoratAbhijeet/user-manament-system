

import app from './app.js';
import connectDB from './db/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8000;

// Connect to the database
connectDB()
  .then(() => {
    console.log('Connected to database');
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.log('MongoDB connection failed!', err);
  });

