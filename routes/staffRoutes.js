const express = require('express');
const router = express.Router();
const staff = require('../controllers/staffController');
const { authMiddleware } = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

// Dashboard
router.get('/staff/dashboard', authMiddleware, allowRoles(['staff']), staff.showEvents);

// Cancel / Reactivate Event
router.put('/staff/events/:id/cancel', authMiddleware, allowRoles(['staff']), staff.cancelEvent);
// Reactivate event
router.put('/staff/events/:id/activate', authMiddleware, allowRoles(['staff']), staff.reactivateEvent);

// View Event
router.get('/staff/events/:id', authMiddleware, allowRoles(['staff']), staff.viewEvent);

router.get(
  '/staff/events/:id/attendees',
  authMiddleware,
  allowRoles(['staff']),
  staff.showAtendee
);


module.exports = router;
