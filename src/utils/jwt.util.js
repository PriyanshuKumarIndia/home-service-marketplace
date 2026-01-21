const jwt = require('jsonwebtoken')

const extractToken = (req) => {
  let token;

  // Authorization header
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  if (authHeader && typeof authHeader === "string") {
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  // Cookie fallback
  if (!token && req.cookies?.access_token) {
    token = req.cookies.access_token;
  }

  return token || null;
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Generate JWT token
const generateToken = (payload, expiry = '1d', options = {}) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiry,
    ...options,
  });
};

module.exports = {
  extractToken,
  verifyToken,
  generateToken,
};
