import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Define Schema
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

// Define Model (prevents OverwriteModelError)
const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);

// POST: http://localhost:5000/api/inquiries
router.post('/', async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).json({ message: "Inquiry saved successfully!", data: inquiry });
  } catch (err) {
    console.error('Error saving inquiry:', err);
    res.status(500).json({ error: 'Server error while saving data' });
  }
});

// GET: http://localhost:5000/api/inquiries
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ error: 'Server error while fetching data' });
  }
});

export default router;