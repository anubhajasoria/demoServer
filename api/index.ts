const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Initialize express app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost/eventBooking", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Event Schema
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subText: String,
  date: { type: Date, required: true },
  location: { type: String, required: true },
  totalTickets: { type: Number, required: true },
  ticketsLeft: { type: Number, required: true },
  description: String,
  priceLower: Number,
  priceHigher: Number,
});

const Event = mongoose.model("Event", eventSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: String, required: true },
  organization: { type: String, required: true },
  jobDescription: { type: String, required: true },
  isStudent: { type: Boolean, required: true },
  heardFrom: { type: String, required: true },
  status: { type: String, default: "pending" },
});

const Booking = mongoose.model("Booking", bookingSchema);

// Routes
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/book", async (req, res) => {
  const {
    eventId,
    userId,
    organization,
    jobDescription,
    isStudent,
    heardFrom,
  } = req.body;

  if (
    !eventId ||
    !userId ||
    !organization ||
    !jobDescription ||
    isStudent == null ||
    !heardFrom
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.ticketsLeft <= 0) {
      return res
        .status(400)
        .json({ message: "No tickets left for this event" });
    }

    const booking = new Booking({
      eventId,
      userId,
      organization,
      jobDescription,
      isStudent,
      heardFrom,
    });

    await booking.save();

    // Update tickets left
    event.ticketsLeft -= 1;
    await event.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new event route
app.post("/events", async (req, res) => {
  const {
    name,
    subText,
    date,
    location,
    totalTickets,
    ticketsLeft,
    description,
    priceLower,
    priceHigher,
  } = req.body;

  if (!name || !date || !location || !totalTickets || ticketsLeft == null) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const event = new Event({
      name,
      subText,
      date,
      location,
      totalTickets,
      ticketsLeft,
      description,
      priceLower,
      priceHigher,
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
