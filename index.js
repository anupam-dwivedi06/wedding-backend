import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import inquiryRoutes from './api/form.js';

dotenv.config();

const app = express();

// 1. CORS Configuration
app.use(cors({
  origin: [
    'https://www.shagunutsav.in',
    'https://wedding-khaki-iota.vercel.app',
    'http://localhost:3000', // Added for local React testing
    'http://localhost:5173'  // Added for Vite local testing
  ]
}));

app.get('/', (req, res) => {
  res.send('Wedding Backend API is Live! 🚀');
});

app.use(express.json());

// 2. MongoDB connection (Optimized for Serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    // These options ensure stable connection in newer Mongoose versions
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
  }
};

// Middleware to ensure DB is connected before handling routes
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// 3. Admin Login Route
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  console.log('Password', password);
  
  if (password === process.env.ADMIN_PASSWORD) {
    console.log('evn password', process.env.ADMIN_PASSWORD);
    // Generates a token valid for 2 hours
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
    console.log('token', token);
    return res.json({ token });
  }
  
  res.status(401).json({ error: "Unauthorized: Incorrect password" });
});

// 4. Form Routes
app.use('/api/form', inquiryRoutes);

// 5. LOCAL STARTUP LOGIC 
// This allows 'npm start' to work on your computer
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Local Server running on http://localhost:${PORT}`);
  });
}

// Required for Vercel deployment
export default app;