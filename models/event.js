const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true }, 
  price: { type: Number, required: true },
  status:{type:String , enum:["active","canceled"],default:"active"}
});

module.exports = mongoose.model("Event", eventSchema);
