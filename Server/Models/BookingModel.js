import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(

  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "NewCustomer" depending on your project
      required: true,
    },

    TimeSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HourlyTimeSlot',
      required:true,
    },

    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    date: { type: Date, required: true },
    day: { type: String, required: true },

    // Formatted display times (12-hour format)
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    // Numeric minutes (used for overlap check)
    startTimeMinutes: { type: Number, required: true },
    endTimeMinutes: { type: Number, required: true },

    duration: { type: Number, required: true }, // in minutes
    price: { type: Number, required: true },

    bookingStatus: {
      type: String,
      default: 'Pending',
    },

    draft: { type: Boolean, default: true }, // pending until confirm
  },
  { timestamps: true }
);


export default mongoose.model("Booking", bookingSchema);
