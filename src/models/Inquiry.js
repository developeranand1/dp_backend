import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  subject: {
    type: String,
    default: 'General Concierge Inquiry'
  },
  category: {
    type: String,
    enum: ['Custom Couture', 'Order Status', 'Bridal & Bespoke', 'Size Consultation', 'General Inquiry'],
    default: 'General Inquiry'
  },
  message: {
    type: String,
    required: [true, 'Message content is required']
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'in-progress', 'resolved'],
    default: 'unread'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
