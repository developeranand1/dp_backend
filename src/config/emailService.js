import nodemailer from 'nodemailer';

/**
 * Configure Nodemailer Transporter using Gmail SMTP App Password
 */
export const getTransporter = () => {
  const user = process.env.EMAIL_USER || 'anand8126137013@gmail.com';
  const pass = process.env.EMAIL_PASS || 'rqvlgkkduftddppz';

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user.trim(),
      pass: pass.trim().replace(/\s+/g, '') // remove any stray spaces in app password
    }
  });
};

/**
 * Generate Luxury Haute-Couture HTML Email Template for Admin Password Reset
 */
export const getPasswordResetEmailTemplate = ({ adminName, resetUrl, expireMinutes = 60 }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Daposh Fashion Administrator Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0d0d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0d0d0d; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #141414; border: 1px solid #2a2520; border-radius: 4px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Gold Accent Top Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #b8860b 0%, #dfc8a8 50%, #b8860b 100%);"></td>
          </tr>

          <!-- Header / Maison Branding -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px; border-bottom: 1px solid #222222;">
              <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; border: 1px solid #dfc8a8; color: #dfc8a8; font-size: 20px; font-weight: 700; font-family: Georgia, serif; text-align: center; margin-bottom: 16px;">
                D
              </div>
              <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; letter-spacing: 4px; color: #ffffff; text-transform: uppercase; font-weight: 600;">
                DAPOSH FASHION
              </h1>
              <p style="margin: 6px 0 0; font-size: 11px; letter-spacing: 3px; color: #dfc8a8; text-transform: uppercase;">
                HAUTE ATELIER &bull; MALVIYA NAGAR, NEW DELHI
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 36px 24px;">
              <div style="background-color: rgba(223, 200, 168, 0.08); border-left: 3px solid #dfc8a8; padding: 10px 14px; margin-bottom: 24px;">
                <span style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #dfc8a8; font-weight: 700;">
                  CONFIDENTIAL &bull; SECURE CONCIERGE AUTHENTICATION
                </span>
              </div>

              <h2 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 20px; color: #ffffff; font-weight: normal;">
                Administrator Password Reset
              </h2>

              <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #cccccc;">
                Dear <strong style="color: #ffffff;">${adminName || 'Daposh Administrator'}</strong>,
              </p>

              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #b3b3b3;">
                A password reset request was initiated for your administrator account on the <strong style="color: #ffffff;">Daposh Fashion Maison Control Panel</strong>. Click the button below to securely configure your new master password:
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; background: #dfc8a8; color: #0c0c0c; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; padding: 16px 36px; border-radius: 2px; border: 1px solid #ffffff; box-shadow: 0 6px 20px rgba(223, 200, 168, 0.25);">
                      RESET ADMIN PASSWORD &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry Alert -->
              <div style="background: #1a1816; border: 1px solid #332d26; border-radius: 3px; padding: 14px 18px; margin-bottom: 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="24" valign="top" style="font-size: 16px; color: #dfc8a8;">⏳</td>
                    <td style="font-size: 12px; line-height: 1.5; color: #b8b0a5;">
                      <strong>Security Notice:</strong> This single-use authorization link is valid for exactly <strong>${expireMinutes} minutes</strong>. If you did not request this change, please ignore this notice — your admin access remains entirely secure.
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Fallback Direct URL -->
              <p style="margin: 0 0 8px; font-size: 12px; color: #888888;">
                If the button above does not open directly, copy and paste this link into your browser:
              </p>
              <div style="background: #080808; border: 1px solid #222222; padding: 10px 12px; font-size: 11px; word-break: break-all; color: #dfc8a8; font-family: monospace; border-radius: 3px; margin-bottom: 20px;">
                ${resetUrl}
              </div>
            </td>
          </tr>

          <!-- Footer / Atelier Details -->
          <tr>
            <td style="background-color: #0b0b0b; padding: 26px 36px; border-top: 1px solid #1f1f1f; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 1px; color: #888888; text-transform: uppercase;">
                Daposh Fashion Atelier &bull; D85 shop no 6, Main road, Malviya nagar, New Delhi 110017
              </p>
              <p style="margin: 0 0 10px; font-size: 12px; color: #cccccc;">
                WhatsApp Concierge: <strong style="color: #ffffff;">70280 14412</strong> &bull; Instagram: <strong style="color: #dfc8a8;">@daposhfashion</strong>
              </p>
              <p style="margin: 0; font-size: 10px; color: #555555;">
                &copy; ${new Date().getFullYear()} Daposh Fashion. All rights reserved. Highly confidential administrative communication.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Send Password Reset Email to Admin
 */
export const sendPasswordResetEmail = async ({ toEmail, adminName, resetToken }) => {
  const transporter = getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
  const resetUrl = `${frontendUrl}/admin?action=reset-password&token=${resetToken}`;
  const sender = process.env.EMAIL_FROM || `"Daposh Fashion Atelier" <${process.env.EMAIL_USER || 'anand8126137013@gmail.com'}>`;

  const htmlContent = getPasswordResetEmailTemplate({
    adminName,
    resetUrl,
    expireMinutes: 60
  });

  const mailOptions = {
    from: sender,
    to: toEmail,
    subject: '🔐 Daposh Fashion Atelier — Admin Password Reset Request',
    text: `Daposh Fashion Atelier - Admin Password Reset\n\nDear ${adminName || 'Administrator'},\n\nA password reset request was received for your Daposh Maison account.\nPlease use the following link to reset your password (valid for 60 minutes):\n${resetUrl}\n\nIf you did not request this, please disregard.\n\nDaposh Fashion Concierge (+91 70280 14412)`,
    html: htmlContent
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✉️ Password reset email delivered to ${toEmail}: ${info.messageId}`);
  return { success: true, messageId: info.messageId, resetUrl };
};

/**
 * Send Welcome / Access Email When a New Admin is Dynamically Created
 */
export const sendAdminWelcomeEmail = async ({ toEmail, adminName, tempPassword, role }) => {
  const transporter = getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
  const adminUrl = `${frontendUrl}/admin`;
  const sender = process.env.EMAIL_FROM || `"Daposh Fashion Atelier" <${process.env.EMAIL_USER || 'anand8126137013@gmail.com'}>`;

  const mailOptions = {
    from: sender,
    to: toEmail,
    subject: '👑 Welcome to Daposh Fashion Atelier — Admin Access Granted',
    html: `
      <div style="background:#0d0d0d;color:#fff;padding:32px;font-family:Georgia,serif;max-width:560px;margin:auto;border:1px solid #332d26;">
        <div style="text-align:center;border-bottom:1px solid #222;padding-bottom:16px;">
          <h2 style="letter-spacing:3px;color:#dfc8a8;margin:0;">DAPOSH FASHION</h2>
          <small style="color:#aaa;">MAISON ATELIER CONCIERGE</small>
        </div>
        <div style="padding:24px 0;">
          <p>Dear <strong>${adminName}</strong>,</p>
          <p>You have been granted administrator access to the Daposh Fashion Management Console with role: <strong>${role || 'ADMIN'}</strong>.</p>
          <div style="background:#1a1816;padding:16px;border-left:3px solid #dfc8a8;margin:20px 0;">
            <p style="margin:4px 0;"><strong>Console URL:</strong> <a href="${adminUrl}" style="color:#dfc8a8;">${adminUrl}</a></p>
            <p style="margin:4px 0;"><strong>Admin Email:</strong> ${toEmail}</p>
            <p style="margin:4px 0;"><strong>Temporary Password:</strong> <code style="background:#0c0c0c;padding:3px 8px;color:#dfc8a8;">${tempPassword}</code></p>
          </div>
          <p style="font-size:12px;color:#aaa;">We recommend logging in and updating your password immediately.</p>
          <div style="text-align:center;margin-top:24px;">
            <a href="${adminUrl}" style="background:#dfc8a8;color:#0c0c0c;padding:12px 28px;text-decoration:none;font-weight:bold;display:inline-block;letter-spacing:1px;">ACCESS CONSOLE &rarr;</a>
          </div>
        </div>
        <div style="border-top:1px solid #222;padding-top:14px;font-size:11px;color:#777;text-align:center;">
          D85 shop no 6, Main road, Malviya nagar, New Delhi 110017 | WhatsApp: 70280 14412
        </div>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
};
