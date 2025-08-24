// controllers/adminController.js
const Event = require('../models/event');
const User = require('../models/user');

// --- Admin Dashboard ---
exports.adminDashboard = async (req, res) => {
  try {
    const events = await Event.find();
    const users = await User.find();
    res.render('admin/dashboard', { events, users, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// --- Show Create Event Form ---
exports.showCreateForm = (req, res) => {
  try {
    res.render('admin/createEvent'); // Renders form to create new event
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// --- Create Event ---
exports.createEvents = async (req, res) => {
  try {
    const { title, description, date, totalSeats, price,  availableSeats } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      totalSeats,
      availableSeats: totalSeats, 
      price,
      createdBy: req.user._id
    });

    await newEvent.save();
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


// --- Show Edit Form ---
exports.showEditForm = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.render('admin/editEvent', { event });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// --- Edit Event ---
exports.editEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, totalSeats, price } = req.body;
    await Event.findByIdAndUpdate(id, {
      title,
      description,
      date,
      totalSeats,
      price
    });
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// --- Cancel Event (update status) ---
exports.cancelEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await Event.findByIdAndUpdate(id, { status: 'canceled' });
    res.redirect('/admin/dashboard');
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
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
// --- Delete Event ---
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).send('Event not found');
    }

    // Only allow deletion if the event is canceled
    if (event.status !== 'canceled') {
      return res.status(400).send('Only canceled events can be deleted');
    }

    await Event.findByIdAndDelete(id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};



// --- Promote User to Staff ---
exports.promoteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { role: 'staff' });
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// --- Demote Staff to User ---
exports.demoteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { role: 'user' });
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
