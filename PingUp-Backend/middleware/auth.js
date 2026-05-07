const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'internal_network_secret_2024';

function generateToken(user) {
  return jwt.sign(
    { id: user._id.toString(), username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); }
  catch { return null; }
}

async function socketAuthMiddleware(socket, next) {
  const token   = socket.handshake.auth?.token;
  if (!token) return next(new Error('AUTH_REQUIRED'));
  const decoded = verifyToken(token);
  if (!decoded) return next(new Error('INVALID_TOKEN'));
  const user = await User.findById(decoded.id);
  if (!user) return next(new Error('USER_NOT_FOUND'));
  socket.user = { id: user._id.toString(), username: user.username, role: user.role };
  next();
}

module.exports = { generateToken, verifyToken, socketAuthMiddleware };
