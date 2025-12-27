const validateOrigin = (req, res, next) => {
  // Skip CSRF validation for GET requests (safe methods)
  if (req.method === 'GET') {
    return next();
  }

  const origin = req.get('Origin') || req.get('Referer');
  const allowedOrigins = [
    process.env.CORS_ORIGIN || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5173'
  ];

  if (!origin) {
    return res.status(403).json({ error: 'Missing origin header' });
  }

  const isValidOrigin = allowedOrigins.some(allowed => 
    origin.startsWith(allowed)
  );

  if (!isValidOrigin) {
    return res.status(403).json({ error: 'Invalid origin - CSRF protection' });
  }

  next();
};

module.exports = { validateOrigin };