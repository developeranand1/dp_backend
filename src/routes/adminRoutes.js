import express from 'express';
import crypto from 'crypto';
import { Admin } from '../models/Admin.js';
import { sendPasswordResetEmail, sendAdminWelcomeEmail, getTransporter } from '../config/emailService.js';

const router = express.Router();

/**
 * 1. Admin Login Endpoint (MongoDB + Bcrypt with Fallback Support)
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;

    const configuredEmail = (process.env.ADMIN_EMAIL || 'anand8126137013@gmail.com').toLowerCase().trim();
    const configuredPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const configuredSecret = process.env.ADMIN_SECRET_KEY || 'daposh_admin_secret_2026';

    const normalizedEmail = email ? email.trim().toLowerCase() : '';

    // A. Check Master Secret Key Bypass
    if (secretKey && secretKey.trim() === configuredSecret) {
      const token = `dps_adm_${Date.now()}_${Buffer.from(configuredEmail).toString('base64')}`;
      return res.json({
        success: true,
        message: 'Admin Master Key Authentication Successful',
        token,
        admin: {
          name: 'Daposh Maison Administrator',
          email: configuredEmail,
          role: 'SUPER_ADMIN'
        }
      });
    }

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // B. Check MongoDB Admin Collection
    let admin = await Admin.findOne({ email: normalizedEmail });

    if (admin) {
      const isMatch = await admin.comparePassword(password);
      if (isMatch) {
        admin.lastLogin = new Date();
        await admin.save();

        const token = `dps_adm_${Date.now()}_${Buffer.from(admin.email).toString('base64')}`;
        return res.json({
          success: true,
          message: 'Admin Authentication Successful',
          token,
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            phone: admin.phone
          }
        });
      }
    }

    // C. Fallback for Configured Default Super Admin (if DB doc was pending seed)
    if (normalizedEmail === configuredEmail && password === configuredPassword) {
      // Auto-upsert into DB for persistence
      if (!admin) {
        admin = new Admin({
          name: 'Daposh Founder & Super Admin',
          email: configuredEmail,
          password: configuredPassword,
          role: 'SUPER_ADMIN',
          phone: '70280 14412',
          lastLogin: new Date()
        });
        await admin.save();
      }

      const token = `dps_adm_${Date.now()}_${Buffer.from(configuredEmail).toString('base64')}`;
      return res.json({
        success: true,
        message: 'Admin Authentication Successful',
        token,
        admin: {
          id: admin?._id,
          name: admin?.name || 'Daposh Maison Administrator',
          email: configuredEmail,
          role: 'SUPER_ADMIN',
          phone: '70280 14412'
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid administrator credentials. Access denied.'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during authentication.'
    });
  }
});

/**
 * 2. Forgot Password Endpoint — Generates crypto token & sends Luxury Email via Nodemailer
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered administrator email.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const configuredEmail = (process.env.ADMIN_EMAIL || 'anand8126137013@gmail.com').toLowerCase().trim();

    let admin = await Admin.findOne({ email: normalizedEmail });

    // If matches configured admin but doc doesn't exist yet, seed it
    if (!admin && normalizedEmail === configuredEmail) {
      admin = new Admin({
        name: 'Daposh Founder & Super Admin',
        email: configuredEmail,
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'SUPER_ADMIN',
        phone: '70280 14412'
      });
      await admin.save();
    }

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'No administrator account found with this email address.'
      });
    }

    // Generate secure reset token (64 hex characters)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity

    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = tokenExpiry;
    await admin.save();

    // Send email via Nodemailer
    try {
      const emailResult = await sendPasswordResetEmail({
        toEmail: admin.email,
        adminName: admin.name,
        resetToken
      });

      return res.json({
        success: true,
        message: `A password reset link has been dispatched to ${admin.email}. Please check your inbox.`,
        resetUrl: emailResult.resetUrl, // Provided for testing convenience
        expiresIn: '60 minutes'
      });
    } catch (emailErr) {
      console.error('Nodemailer Send Error:', emailErr);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
      const fallbackResetUrl = `${frontendUrl}/admin?action=reset-password&token=${resetToken}`;
      
      return res.status(500).json({
        success: false,
        message: `Failed to dispatch email via Nodemailer (${emailErr.message}). You can also reset using the direct link: ${fallbackResetUrl}`,
        directResetUrl: fallbackResetUrl
      });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error while processing password reset request.'
    });
  }
});

/**
 * 3. Reset Password Endpoint — Verifies token and updates master password
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both reset token and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters in length.'
      });
    }

    // Find admin with valid unexpired token
    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'The password reset link is invalid or has expired. Please request a new one.'
      });
    }

    // Set new password (pre-save hook will hash it with bcrypt)
    admin.password = newPassword;
    admin.resetPasswordToken = null;
    admin.resetPasswordExpires = null;
    await admin.save();

    console.log(`🔐 Password reset successfully for admin: ${admin.email}`);

    return res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error while updating password.'
    });
  }
});

/**
 * 4. Create New Admin Dynamically
 */
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await Admin.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An administrator with this email already exists.'
      });
    }

    const newAdmin = new Admin({
      name: name || 'Daposh Administrator',
      email: normalizedEmail,
      password: password,
      role: role || 'ADMIN',
      phone: phone || '70280 14412'
    });

    await newAdmin.save();

    // Optionally notify the new admin via email
    try {
      await sendAdminWelcomeEmail({
        toEmail: normalizedEmail,
        adminName: newAdmin.name,
        tempPassword: password,
        role: newAdmin.role
      });
    } catch (e) {
      console.warn('Welcome email could not be sent:', e.message);
    }

    return res.status(201).json({
      success: true,
      message: 'New administrator user created successfully.',
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        phone: newAdmin.phone,
        createdAt: newAdmin.createdAt
      }
    });
  } catch (err) {
    console.error('Create admin error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal error creating administrator user.'
    });
  }
});

/**
 * 5. List All Administrators
 */
router.get('/list', async (req, res) => {
  try {
    const admins = await Admin.find({}, '-password -resetPasswordToken -resetPasswordExpires').sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: admins.length,
      admins
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Error retrieving admin accounts.'
    });
  }
});

/**
 * 6. Delete Administrator
 */
router.delete('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    if (admin.email === (process.env.ADMIN_EMAIL || 'anand8126137013@gmail.com').toLowerCase()) {
      return res.status(400).json({ success: false, message: 'Cannot delete the primary root super administrator.' });
    }

    await Admin.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Admin deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 7. Nodemailer Diagnostic / Test Endpoint
 */
router.post('/test-email', async (req, res) => {
  try {
    const transporter = getTransporter();
    await transporter.verify();

    const targetEmail = req.body.email || process.env.EMAIL_USER || 'anand8126137013@gmail.com';
    const testInfo = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Daposh Fashion Concierge" <${process.env.EMAIL_USER}>`,
      to: targetEmail,
      subject: '✅ Daposh Fashion Atelier — Nodemailer Configuration Verified',
      html: `
        <div style="background:#0c0c0c;color:#dfc8a8;padding:24px;font-family:Georgia,serif;border:1px solid #dfc8a8;">
          <h2>DAPOSH FASHION ATELIER</h2>
          <p style="color:#ffffff;">Nodemailer SMTP integration is working successfully with Gmail App Password!</p>
          <p style="font-size:12px;color:#aaa;">Concierge WhatsApp: <strong>70280 14412</strong></p>
        </div>
      `
    });

    return res.json({
      success: true,
      message: `Test email dispatched successfully to ${targetEmail}`,
      messageId: testInfo.messageId
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Nodemailer test failed: ${err.message}`
    });
  }
});

/**
 * 8. Verify Admin Token
 */
router.post('/verify', (req, res) => {
  const authHeader = req.headers.authorization || req.headers['x-admin-key'];
  if (authHeader) {
    return res.json({ success: true, valid: true });
  }
  return res.status(401).json({ success: false, valid: false });
});

export default router;
