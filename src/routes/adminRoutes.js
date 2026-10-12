import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password, secretKey } = req.body;
  
  const configuredEmail = process.env.ADMIN_EMAIL || 'admin@daposhfashion.com';
  const configuredPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const configuredSecret = process.env.ADMIN_SECRET_KEY || 'daposh_admin_secret_2026';

  const isEmailMatch = email && email.trim().toLowerCase() === configuredEmail.toLowerCase();
  const isPasswordMatch = password && password === configuredPassword;
  const isSecretMatch = secretKey && secretKey.trim() === configuredSecret;

  if ((isEmailMatch && isPasswordMatch) || isSecretMatch) {
    const token = `dps_adm_${Date.now()}_${Buffer.from(configuredEmail).toString('base64')}`;
    return res.json({
      success: true,
      message: 'Admin Authentication Successful',
      token,
      admin: {
        name: 'Daposh Maison Administrator',
        email: configuredEmail,
        role: 'SUPER_ADMIN'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. Please verify admin email and password.'
  });
});

router.post('/verify', (req, res) => {
  const authHeader = req.headers.authorization || req.headers['x-admin-key'];
  if (authHeader) {
    return res.json({ success: true, valid: true });
  }
  return res.status(401).json({ success: false, valid: false });
});

export default router;
