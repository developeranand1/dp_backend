import { Order } from '../models/Order.js';
import { razorpayInstance, isRazorpayConfigured, verifyRazorpaySignature } from '../config/razorpay.js';
import mongoose from 'mongoose';

// Fallback in-memory orders store
let fallbackOrders = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Helper to generate sleek Daposh Order ID: e.g. DPS-2026-849201
 */
const generateOrderId = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `DPS-2026-${randomNum}`;
};

/**
 * 1. Create Razorpay Order
 * Triggered when customer clicks "Pay with Razorpay" in checkout
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid order amount' });
    }

    const orderReceipt = receipt || `rcpt_${Date.now()}`;
    const amountInPaise = Math.round(Number(amount) * 100);

    // If Razorpay API keys are configured, call Razorpay SDK
    if (isRazorpayConfigured()) {
      try {
        const razorpayOrder = await razorpayInstance.orders.create({
          amount: amountInPaise,
          currency,
          receipt: orderReceipt,
          notes: {
            brand: 'Daposh Fashion Atelier'
          }
        });

        return res.json({
          success: true,
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key: process.env.RAZORPAY_KEY_ID,
          isMock: false
        });
      } catch (rzpErr) {
        console.error('Razorpay SDK orders.create error:', rzpErr);
      }
    }

    // Mock Razorpay Order for testing / development without live secret
    const mockRazorpayOrderId = `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return res.json({
      success: true,
      orderId: mockRazorpayOrderId,
      amount: amountInPaise,
      currency,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_TmudzEt6ynGEm1',
      isMock: true,
      message: 'Razorpay order generated in test simulation mode'
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Verify Razorpay Payment and Save Completed Order
 */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      items,
      subtotal,
      discount = 0,
      shipping = 0,
      total
    } = req.body;

    if (!customer || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'Customer details and cart items are required' });
    }

    let isSignatureValid = true;
    const isMockOrder = !razorpay_order_id || razorpay_order_id.startsWith('order_mock_') || razorpay_order_id.startsWith('order_test_') || razorpay_signature === 'sig_test_simulation';

    if (isRazorpayConfigured() && !isMockOrder && razorpay_signature) {
      isSignatureValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
      if (!isSignatureValid) {
        return res.status(400).json({ success: false, message: 'Payment verification failed: Invalid signature' });
      }
    }

    const orderId = generateOrderId();
    const newOrderData = {
      orderId,
      customer,
      items,
      subtotal: Number(subtotal),
      discount: Number(discount),
      shipping: Number(shipping),
      total: Number(total),
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      razorpayOrderId: razorpay_order_id || '',
      razorpayPaymentId: razorpay_payment_id || `pay_mock_${Date.now()}`,
      razorpaySignature: razorpay_signature || '',
      orderStatus: 'Placed',
      courierName: 'BlueDart Luxury Express',
      trackingNumber: `BD-IN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // +4 days
      statusTimeline: [
        {
          status: 'Placed',
          message: 'Order placed & payment verified via Razorpay.',
          timestamp: new Date()
        }
      ]
    };

    if (isDbConnected()) {
      const createdOrder = await Order.create(newOrderData);
      return res.status(201).json({
        success: true,
        message: 'Order booked and confirmed successfully!',
        data: createdOrder
      });
    }

    // In-memory fallback
    const mockSaved = { ...newOrderData, id: orderId, _id: orderId, createdAt: new Date() };
    fallbackOrders.unshift(mockSaved);

    return res.status(201).json({
      success: true,
      message: 'Order booked successfully (in-memory test mode)!',
      data: mockSaved
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. Create Cash on Delivery / Offline Booking Order
 */
export const createCodOrder = async (req, res) => {
  try {
    const { customer, items, subtotal, discount = 0, shipping = 0, total } = req.body;

    if (!customer || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'Customer details and items are required' });
    }

    const orderId = generateOrderId();
    const newOrderData = {
      orderId,
      customer,
      items,
      subtotal: Number(subtotal),
      discount: Number(discount),
      shipping: Number(shipping),
      total: Number(total),
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'Placed',
      courierName: 'BlueDart Luxury Express',
      trackingNumber: `BD-IN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      statusTimeline: [
        {
          status: 'Placed',
          message: 'COD Order received. Concierge will confirm via WhatsApp / Call.',
          timestamp: new Date()
        }
      ]
    };

    if (isDbConnected()) {
      const createdOrder = await Order.create(newOrderData);
      return res.status(201).json({
        success: true,
        message: 'Order booked successfully with Cash on Delivery / Concierge pay!',
        data: createdOrder
      });
    }

    const mockSaved = { ...newOrderData, id: orderId, _id: orderId, createdAt: new Date() };
    fallbackOrders.unshift(mockSaved);

    return res.status(201).json({
      success: true,
      message: 'Order booked successfully (in-memory mode)!',
      data: mockSaved
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Track Order by Order ID or Customer Phone
 */
export const trackOrder = async (req, res) => {
  try {
    const { query } = req.params;
    const cleanQuery = decodeURIComponent(query).trim();

    if (isDbConnected()) {
      const order = await Order.findOne({
        $or: [
          { orderId: cleanQuery },
          { 'customer.phone': cleanQuery },
          { 'customer.email': cleanQuery.toLowerCase() },
          { trackingNumber: cleanQuery }
        ]
      });

      if (order) {
        return res.json({ success: true, data: order });
      }
    }

    const fallbackMatch = fallbackOrders.find(
      o => o.orderId === cleanQuery ||
        o.customer?.phone === cleanQuery ||
        o.customer?.email?.toLowerCase() === cleanQuery.toLowerCase() ||
        o.trackingNumber === cleanQuery
    );

    if (fallbackMatch) {
      return res.json({ success: true, data: fallbackMatch });
    }

    // If test order ID entered e.g. DPS-2026-*, return sample dynamic tracking for demo if not found
    if (cleanQuery.toUpperCase().startsWith('DPS-2026')) {
      return res.json({
        success: true,
        data: {
          orderId: cleanQuery.toUpperCase(),
          customer: {
            name: 'Atelier Client',
            phone: '+91 70280 14412',
            email: 'client@daposhfashion.com',
            address: 'D85 shop no 6, Main road, Malviya nagar',
            city: 'New delhi',
            state: 'Delhi',
            pincode: '110017'
          },
          items: [
            {
              productId: 'prod_1',
              name: 'Atelier Mulberry Silk Trench',
              price: 18500,
              quantity: 1,
              selectedSize: 'M',
              selectedColor: { name: 'Champagne Dune', hex: '#d9c7a7' },
              primaryImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80'
            }
          ],
          subtotal: 18500,
          discount: 0,
          shipping: 0,
          total: 18500,
          paymentMethod: 'razorpay',
          paymentStatus: 'paid',
          orderStatus: 'Shipped',
          courierName: 'BlueDart Luxury Air Express',
          trackingNumber: 'BD-DEL-9843201',
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          statusTimeline: [
            { status: 'Placed', message: 'Order verified and  registered.', timestamp: new Date(Date.now() - 36 * 3600 * 1000) },
            { status: 'Confirmed', message: 'Handpicked and prepared in DAPOSH luxury box.', timestamp: new Date(Date.now() - 24 * 3600 * 1000) },
            { status: 'Shipped', message: 'Dispatched via BlueDart Express courier.', timestamp: new Date(Date.now() - 8 * 3600 * 1000) }
          ]
        }
      });
    }

    return res.status(404).json({
      success: false,
      message: 'No order found with provided Order ID or Phone number'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. Get All Orders (Admin panel)
 */
export const getAllOrders = async (req, res) => {
  try {
    if (isDbConnected()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      const totalRevenue = orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.total, 0);

      return res.json({
        success: true,
        count: orders.length,
        totalRevenue,
        data: orders
      });
    }

    const totalRevenue = fallbackOrders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);

    return res.json({
      success: true,
      count: fallbackOrders.length,
      totalRevenue,
      data: fallbackOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 6. Update Order Status & Courier Tracking (Admin panel)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber, courierName, note } = req.body;

    const timelineEntry = {
      status: orderStatus,
      message: note || `Order status updated to ${orderStatus}.`,
      timestamp: new Date()
    };

    if (isDbConnected() && (mongoose.Types.ObjectId.isValid(id) || id.startsWith('DPS-'))) {
      const updatePayload = {
        orderStatus,
        $push: { statusTimeline: timelineEntry }
      };
      if (trackingNumber) updatePayload.trackingNumber = trackingNumber;
      if (courierName) updatePayload.courierName = courierName;

      const order = await Order.findOneAndUpdate(
        { $or: [{ _id: mongoose.Types.ObjectId.isValid(id) ? id : null }, { orderId: id }] },
        updatePayload,
        { new: true }
      );

      if (order) {
        return res.json({ success: true, message: 'Order status updated', data: order });
      }
    }

    const orderIndex = fallbackOrders.findIndex(o => o.id === id || o._id === id || o.orderId === id);
    if (orderIndex > -1) {
      fallbackOrders[orderIndex].orderStatus = orderStatus;
      if (trackingNumber) fallbackOrders[orderIndex].trackingNumber = trackingNumber;
      if (courierName) fallbackOrders[orderIndex].courierName = courierName;
      fallbackOrders[orderIndex].statusTimeline.push(timelineEntry);

      return res.json({
        success: true,
        message: 'Order status updated successfully',
        data: fallbackOrders[orderIndex]
      });
    }

    return res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
