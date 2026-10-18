import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Admin name is required'],
      trim: true,
      default: 'Daposh Maison Administrator'
    },
    email: {
      type: String,
      required: [true, 'Admin email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN'],
      default: 'SUPER_ADMIN'
    },
    phone: {
      type: String,
      default: '70280 14412'
    },
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    },
    lastLogin: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const Admin = mongoose.model('Admin', adminSchema);

/**
 * Ensure at least one initial Super Admin exists in the database
 */
export const ensureInitialAdmin = async () => {
  try {
    const emailsToSeed = [
      (process.env.ADMIN_EMAIL || 'daposhfashion1@gmail.com').toLowerCase().trim(),
      (process.env.EMAIL_USER || 'anand8126137013@gmail.com').toLowerCase().trim(),
      'anand8126137013@gmail.com',
      'daposhfashion1@gmail.com'
    ];

    const uniqueEmails = [...new Set(emailsToSeed)].filter(Boolean);

    for (const email of uniqueEmails) {
      const existing = await Admin.findOne({ email });
      if (!existing) {
        const initialPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const superAdmin = new Admin({
          name: email.includes('anand') ? 'Anand (Super Admin)' : 'Daposh Founder & Super Admin',
          email,
          password: initialPassword,
          role: 'SUPER_ADMIN',
          phone: '70280 14412'
        });
        await superAdmin.save();
        console.log(`👑 Super Admin initialized for: ${email}`);
      } else {
        console.log(`✓ Super Admin present in DB: ${email}`);
      }
    }
  } catch (err) {
    console.warn(`⚠️ Warning initializing admin: ${err.message}`);
  }
};
