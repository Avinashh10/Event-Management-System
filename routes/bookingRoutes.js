const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authMiddleware } = require('../middleware/authMiddleware');

// Show form to book event seats
router.get("/events/:eventId/bookings/create",authMiddleware, bookingController.createBookingForm);

// Create booking (POST)
router.post("/events/:eventId/bookings",authMiddleware, bookingController.createBooking);

// List my bookings
router.get("/booking/my", authMiddleware,bookingController.listBookings);

// Show booking details
router.get("/booking/:id/detail", authMiddleware, bookingController.getBookingById);
;

// Cancel booking form
router.get("/booking/:id/cancel",authMiddleware, bookingController.cancelBookingForm);

// Cancel booking (POST)
router.post("/booking/:id/cancel", bookingController.cancelBooking);

module.exports = router;
