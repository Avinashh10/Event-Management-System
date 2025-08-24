const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).select('name email role _id');
    if (!user) return res.redirect('/login');

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT verify failed:', err.message);
    res.redirect('/login');
  }
};
