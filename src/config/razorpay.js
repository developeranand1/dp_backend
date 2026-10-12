import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

export const getRazorpayKeyId = () => {
  return process.env.RAZORPAY_KEY_ID || '';
};

export const getRazorpayKeySecret = () => {
  return process.env.RAZORPAY_KEY_SECRET || '';
};

export const isRazorpayConfigured = () => {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();
  return (
    Boolean(keyId) &&
    Boolean(keySecret) &&
    keyId.startsWith('rzp_') &&
    !keyId.includes('DaposhFashion')
  );
};

let cachedInstance = null;
let lastKeyId = null;

export const getRazorpayInstance = () => {
  const key_id = getRazorpayKeyId();
  const key_secret = getRazorpayKeySecret();
  if (!cachedInstance || lastKeyId !== key_id) {
    cachedInstance = new Razorpay({ key_id, key_secret });
    lastKeyId = key_id;
  }
  return cachedInstance;
};

export const razorpayInstance = {
  get orders() {
    return getRazorpayInstance().orders;
  },
  get payments() {
    return getRazorpayInstance().payments;
  }
};

/**
 * Verify Razorpay payment signature
 */
export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  if (!orderId || !paymentId || !signature) return false;
  
  const secret = getRazorpayKeySecret();
  if (!secret) return false;

  const text = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(text)
    .digest('hex');
  
  return generatedSignature === signature;
};
