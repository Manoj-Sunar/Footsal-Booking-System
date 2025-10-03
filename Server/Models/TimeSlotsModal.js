// models/HourlyTimeSlot.js
import mongoose from "mongoose";

const selectedTime = new mongoose.Schema({
  startTime: { type: String, required: true }, // "06:00 PM"
  endTime:   { type: String, required: true }, // "07:00 PM"
  duration:  { type: String, required: true }, // "1h 0m"
  price:     { type: Number, required: true },
  isBooked:  { type: Boolean, default: false },
}, { _id: true });

const TimeSlotsSchema = new mongoose.Schema({
  // 🔑 the only key we use for identity/lookups
  fullDate: { type: String, required: true }, // "2025-09-06"

  // For display/convenience only
  year:  { type: String, required: true },    // "2025"
  month: { type: String, required: true },    // "September"
  day:   { type: String, required: true },    // "Saturday"

  times: { type: [selectedTime], default: [] },
}, { timestamps: true });

// Ensure one doc per calendar date
TimeSlotsSchema.index({ fullDate: 1 }, { unique: true });

export default mongoose.model("HourlyTimeSlot", TimeSlotsSchema);
