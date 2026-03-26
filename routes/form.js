import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const router = express.Router();

// --- Middleware to protect the GET route ---
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

const inquirySchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phoneWhatsApp: String,
    location: String,
    date: Date,
    event: String,
    referralSource: String,
  },
  { timestamps: true }
);

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);

// POST: Public route (Anyone can submit the form)
router.post('/', async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).json({ message: "Inquiry saved successfully!", data: inquiry });
  } catch (err) {
    res.status(500).json({ error: 'Server error while saving data' });
  }
});

// GET: Protected route (Only Admin can see data)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching data' });
  }
});

export default router;