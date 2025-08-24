const Event = require("../models/event");
const Booking = require("../models/booking");

exports.createBookingForm = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).send("Event not found");

    // Always render create.ejs — template handles seat full case
    res.render("bookings/create", { title: "Create Booking", event });
  } catch (err) {
    console.error("Booking form error:", err);
    res.status(500).send("Server error");
  }
};






// Create booking
exports.createBooking = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).send("Event not found");
    }

    // Check if event has available seats
    if (event.availableSeats <= 0) {
      return res.status(400).send("No seats available for this event");
    }

    // Create booking
    const booking = new Booking({
      event: event._id,
      user: req.user._id,
      seats: 1 // or req.body.seats if you allow multiple
    });

    await booking.save();

    // Decrease available seats
    event.availableSeats -= booking.seats;
    await event.save();

    // Redirect to booking detail page
    res.redirect(`/booking/${booking._id}/detail`);
  } catch (err) {
    console.error("Error creating booking:", err.message);
    res.status(500).send("Server error");
  }
};




// List bookings
exports.listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("event");
    res.render("bookings/list", { title: "My Bookings", bookings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Show booking details
exports.getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId)
      .populate("event")
          .populate("user", "name email"); 

    if (!booking) return res.status(404).send("Booking not found");

    res.render("bookings/details", { booking, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


// Cancel booking form
exports.cancelBookingForm = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event");
    if (!booking) return res.status(404).send("Booking not found");

    res.render("bookings/cancel", { title: "Cancel Booking", booking });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Cancel booking action
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).send("Booking not found");

    const event = await Event.findById(booking.event);
    if (event) {
      event.availableSeats += booking.seats;
      await event.save();
    }

    booking.status = "canceled";
    await booking.save();

    res.redirect("/booking/my"); // ✅ updated
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
