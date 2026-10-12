import { Inquiry } from '../models/Inquiry.js';
import mongoose from 'mongoose';

let fallbackInquiries = [
  {
    id: 'inq_1',
    _id: 'inq_1',
    name: 'Priyanka Kapoor',
    email: 'priyanka.k@example.com',
    phone: '+91 98112 34567',
    subject: 'Bespoke Mulberry Silk Bridal Gown Consultation',
    category: 'Bridal & Bespoke',
    message: 'Hello Daposh Atelier, I loved your SS26 collection on Instagram. I would like to book a private salon consultation at your Malviya Nagar boutique next weekend.',
    status: 'unread',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000)
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, category, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, phone and message are required' });
    }

    const payload = {
      name,
      email,
      phone,
      subject: subject || 'General Atelier Inquiry',
      category: category || 'General Inquiry',
      message,
      status: 'unread'
    };

    if (isDbConnected()) {
      const created = await Inquiry.create(payload);
      return res.status(201).json({
        success: true,
        message: 'Your inquiry has been received by our concierge. We will respond promptly.',
        data: created
      });
    }

    const mock = { ...payload, id: `inq_${Date.now()}`, _id: `inq_${Date.now()}`, createdAt: new Date() };
    fallbackInquiries.unshift(mock);

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been registered with our concierge team!',
      data: mock
    });
  } catch (err) {
    console.error('Error creating inquiry:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    if (isDbConnected()) {
      const list = await Inquiry.find().sort({ createdAt: -1 });
      const unreadCount = list.filter(i => i.status === 'unread').length;
      return res.json({
        success: true,
        count: list.length,
        unreadCount,
        data: list
      });
    }

    const unreadCount = fallbackInquiries.filter(i => i.status === 'unread').length;
    return res.json({
      success: true,
      count: fallbackInquiries.length,
      unreadCount,
      data: fallbackInquiries
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
      if (updated) {
        return res.json({ success: true, message: 'Status updated', data: updated });
      }
    }

    const idx = fallbackInquiries.findIndex(i => i.id === id || i._id === id);
    if (idx > -1) {
      fallbackInquiries[idx].status = status;
      return res.json({ success: true, message: 'Status updated', data: fallbackInquiries[idx] });
    }

    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      await Inquiry.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Inquiry deleted' });
    }

    fallbackInquiries = fallbackInquiries.filter(i => i.id !== id && i._id !== id);
    return res.json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
