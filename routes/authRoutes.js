const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');


// Home redirect
router.get('/', (req, res) => res.redirect('/login'));

// Register
router.get('/register', authController.showRegister);
router.post('/register', authController.registerUser);

// Login
router.get('/login', authController.showLogin);
router.post('/login', authController.loginUser);

// Logout
router.get('/logout', authController.logout);

// User Dashboard
router.get('/dashboard', authMiddleware, authController.userDashboard);



module.exports = router;
