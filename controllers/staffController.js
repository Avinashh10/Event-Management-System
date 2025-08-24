const Event = require('../models/event');
const Booking = require('../models/booking');

exports.showEvents = async (req, res) => {
  try {
    const events = await Event.find();
  res.render('staff/dashboard', { events, user: req.user });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


// --- Cancel Event (update status) ---
exports.cancelEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await Event.findByIdAndUpdate(id, { status: 'canceled' });
    res.redirect('/staff/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// --- Reactivate Event ---
exports.reactivateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await Event.findByIdAndUpdate(id, { status: 'active' });
    res.redirect('/staff/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}; 

// view event

exports.viewEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).send("Event not found");
    res.render('staff/viewEvent', { event });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// show atendee
 
exports.showAtendee = async (req,res) => {
  try {
    const eventId = req.params.id;

    const attendees = await Booking.find({ event: eventId }).populate("user");

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).send("Event not found");

    res.render('staff/attendees', { attendees, event, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}
