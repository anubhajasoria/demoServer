const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: String,
    subText: String,
    date: Date,
    location: String,
    totalTickets: Number,
    ticketsLeft: Number,
    description: String,
    priceLower: Number,
    priceHigher: Number,
  },
  { collection: "events" }
);

const Event = mongoose.model("Events", eventSchema);

module.exports = Event;
