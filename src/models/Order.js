import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  primaryImage: { type: String },
  selectedColor: {
    name: { type: String, default: 'Default' },
    hex: { type: String, default: '#000000' }
  },
  selectedSize: { type: String, default: 'M' },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
}, { _id: false });

const orderTimelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customer: {
    name: { type: String, required: [true, 'Customer name is required'] },
    email: { type: String, required: [true, 'Customer email is required'] },
    phone: { type: String, required: [true, 'Customer phone number is required'] },
    address: { type: String, required: [true, 'Street address is required'] },
    city: { type: String, required: [true, 'City is required'] },
    state: { type: String, default: 'Delhi' },
    pincode: { type: String, required: [true, 'Pincode is required'] },
    notes: { type: String, default: '' }
  },
  items: {
    type: [orderItemSchema],
    required: true
  },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: { type: String, default: 'INR' },

  // Payment Details
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod', 'upi'],
    default: 'razorpay'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  razorpayOrderId: { type: String, default: '' },
  razorpayPaymentId: { type: String, default: '' },
  razorpaySignature: { type: String, default: '' },

  // Order Fulfillment & Tracking
  orderStatus: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Placed'
  },
  courierName: { type: String, default: 'BlueDart Luxury Express' },
  trackingNumber: { type: String, default: '' },
  estimatedDelivery: { type: Date },
  statusTimeline: {
    type: [orderTimelineSchema],
    default: []
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

// Auto initialize status timeline upon order creation
orderSchema.pre('save', function (next) {
  if (this.isNew && (!this.statusTimeline || this.statusTimeline.length === 0)) {
    this.statusTimeline.push({
      status: this.orderStatus,
      message: 'Order placed successfully and received by Daposh Atelier.',
      timestamp: new Date()
    });
  }
  next();
});

export const Order = mongoose.model('Order', orderSchema);
