const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Event = require('../models/event')

// --- Helpers ---
function issueAuthCookie(res, payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
  });
}

// --- Controllers ---
exports.showRegister = (req, res) => {
  res.render('Register', { error: null });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.render('Register', { error: 'All fields required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.render('Register', { error: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });

    res.redirect('/Login');
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.showLogin = (req, res) => {
  res.render('Login', { error: null });
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.render('Login', { error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.render('Login', { error: 'Invalid email or password' });

    issueAuthCookie(res, { name: user.name, email: user.email, role: user.role });

    if (user.role === 'admin') return res.redirect('/admin/dashboard');
    if (user.role === 'staff') return res.redirect('/staff/dashboard');
    return res.redirect('/Dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/Login');
};

;

exports.userDashboard = async (req, res) => {
  const events = await Event.find({}); // get all events
  res.render('Dashboard', { user: req.user, events });
};


