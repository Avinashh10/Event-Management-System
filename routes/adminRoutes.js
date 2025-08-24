const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

// --- Admin Dashboard ---
router.get('/admin/dashboard', authMiddleware, allowRoles(['admin']), adminController.adminDashboard);

// --- Create Event ---
router.get('/admin/events/create', authMiddleware, allowRoles(['admin']), (req, res) => {
  res.render('admin/createEvent');
});
router.post('/admin/events/create', authMiddleware, allowRoles(['admin']), adminController.createEvents);

// --- Edit Event ---
router.get('/admin/events/:id/edit', authMiddleware, allowRoles(['admin', 'staff']), adminController.showEditForm);
router.post('/admin/events/:id/edit', authMiddleware, allowRoles(['admin', 'staff']), adminController.editEvent);

// --- Cancel Event ---
router.post('/admin/events/:id/cancel', authMiddleware, allowRoles(['admin', 'staff']), adminController.cancelEvent);

// --- Reactivate Event ---
router.post('/admin/events/:id/reactivate', authMiddleware, allowRoles(['admin', 'staff']), adminController.reactivateEvent);

// --- Delete Event ---
router.post('/admin/events/:id/delete', authMiddleware, allowRoles(['admin','staff']), adminController.deleteEvent);


// --- Promote User to Staff ---
router.post('/admin/users/:id/promote', authMiddleware, allowRoles(['admin']), adminController.promoteUser);

// --- Demote Staff to User ---
router.post('/admin/users/:id/demote', authMiddleware, allowRoles(['admin']), adminController.demoteStaff);

module.exports = router;
