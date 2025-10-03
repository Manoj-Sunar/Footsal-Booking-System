import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    timeSlotId: { type: mongoose.Schema.Types.ObjectId, ref: "HourlyTimeSlot", required: true },
    bookingDay: {
      type: String,
      required: true,
    },
    method: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "NPR" },
    status: { type: String, enum: ["Pending", "Paid", "Failed", "Refunded"], default: "Pending" },

  },

  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
