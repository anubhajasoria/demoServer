const express = require("express");
const mongoose = require("mongoose");
const { db } = require("../models/Event");
const app = express();
const port = process.env.PORT || 3000;
const dotenv = require("dotenv");
dotenv.config();

const MONGODB_URI =
  "mongodb+srv://anubhajasoria:NV1xarV0sGZNXK4p@cluster0.lowdfg7.mongodb.net/eventBooking?retryWrites=true&w=majority";
const eventSchema = new mongoose.Schema({
  // Define your schema here based on your collection structure
  name: String,
  subText: String,
  date: Date,
  location: String,
  totalTickets: Number,
  ticketsLeft: Number,
  description: String,
  priceLower: Number,
  priceHigher: Number,
  // Add other fields as needed
});

const Event = mongoose.model("Event", eventSchema);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(
      "MongoDB connected",
      db.listCollections().then(async (res) => {
        // let te = await res.json();
        console.log(res);
      })
    );
    // Check if collection exists
    mongoose.connection.db
      .listCollections({ name: "event" })
      .next((err, collectionInfo) => {
        if (err) {
          console.error("Error listing collections:", err);
        } else if (collectionInfo) {
          console.log('Collection "event" exists.');
        } else {
          console.log('Collection "event" does not exist.');
        }
      });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
// Define a schema and model for your collection
// const eventSchema = new mongoose.Schema({
//   // Define your schema here based on your collection structure
//   name: String,
//   subText: String,
//   date: Date,
//   location: String,
//   totalTickets: Number,
//   ticketsLeft: Number,
//   description: String,
//   priceLower: Number,
//   priceHigher: Number,
//   // Add other fields as needed
// });

// const Event = mongoose.model("Event", eventSchema);

// Define a route to fetch the record
app.get("/api/events", async (req, res) => {
  console.log("Request received");
  try {
    const events = await Event.find();
    console.log("Events found:", events);
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
