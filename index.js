// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import inquiryRoutes from './api/form.js'; // Import your route file

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // 1. Middleware
// app.use(cors()); // For development, you can leave it empty to allow all
// app.use(express.json());

// // 2. Database Connection (CRITICAL: You need this to save data)
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch((err) => console.error('❌ MongoDB connection error:', err));

// // 3. Routes
// // This mounts your form logic at http://localhost:5000/api/inquiries
// app.use('/api/form', inquiryRoutes);

// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import inquiryRoutes from './api/form.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'https://www.shagunutsav.in',
    'wedding-khaki-iota.vercel.app'

  ]
}));
app.use(express.json());

// MongoDB connection (cached for serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log('✅ MongoDB connected');
};

// Run DB connection before every request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/form', inquiryRoutes);

// ✅ This is the key change for Vercel
export default app;