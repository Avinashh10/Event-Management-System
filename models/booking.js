const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    status: {
        type: String,
        enum: ["booked", "canceled", "paid"],
        default: "booked"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
    seats: {
        type: Number,
        default: 1
    },
    bookedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
