import mongoose from "mongoose";
import BookingModel from "../Models/BookingModel.js";
import PaymentMethodModal from "../Models/PaymentMethodModal.js";
import TimeSlotsModal from "../Models/TimeSlotsModal.js";
import NotificationsModal from "../Models/NotificationsModal.js";




export const ConfirmPayment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId } = req.user;
        const { bookingId, day, timeSlotId, slotId } = req.params;
        const { selectedMethod } = req.body;

        console.log(bookingId, day, timeSlotId, slotId);

        // -----------------------
        // ✅ Basic Validation
        // -----------------------
        if (!userId) return res.status(401).json({ status: false, message: "You need to login" });
        if (!bookingId) return res.status(400).json({ status: false, message: "Booking ID required" });
        if (!day) return res.status(400).json({ status: false, message: "Day required" });
        if (!timeSlotId) return res.status(400).json({ status: false, message: "timeSlot ID required" });
        if (!slotId) return res.status(400).json({ status: false, message: "Slot ID required" });
        if (!selectedMethod) return res.status(400).json({ status: false, message: "Select a payment method first" });

        // -----------------------
        // ✅ Find Booking
        // -----------------------
        const booking = await BookingModel.findOne({ _id: bookingId, user: userId }).session(session);
        if (!booking) {
            return res.status(404).json({ status: false, message: "Booking not found for this user" });
        }

        // If already confirmed, prevent duplicate payments
        if (!booking.draft) {
            return res.status(400).json({ status: false, message: "This booking is already confirmed" });
        }

        // -----------------------
        // ✅ Validate Day + Slot
        // -----------------------
        const bookedDay = await TimeSlotsModal.findOne({ _id: slotId }).session(session);
        if (!bookedDay) {
            return res.status(404).json({ status: false, message: "Selected day not found" });
        }

        const bookedSlot = bookedDay.times.find(slot => slot._id.toString() === timeSlotId.toString());
        if (!bookedSlot) {
            return res.status(404).json({ status: false, message: "Time slot not found" });
        }

        // If slot already marked booked → block
        if (bookedSlot.isBooked) {
            return res.status(400).json({ status: false, message: "This time slot is already booked." });
        }

        // -----------------------
        // ✅ Confirm Booking + Payment (Atomic)
        // -----------------------
        bookedSlot.isBooked = true;
        booking.draft = false;

        const paymentConfirm = new PaymentMethodModal({
            booking: booking._id,
            user: userId,
            timeSlotId: slotId,
            bookingDay: day,
            method: selectedMethod,
            amount: booking.price,
        });


        const Notification = new NotificationsModal({
            customer: userId,
            message: `${booking.name} Booked Footsal ground`,
            bookingDate: booking.date,
            day: booking.day,
            time: {
                startTime: booking.startTime,
                endTime: booking.endTime,
            }

        });



        await Promise.all([
            paymentConfirm.save({ session }),
            booking.save({ session }),
            bookedDay.save({ session }),
            Notification.save({ session }),
        ]);



        await session.commitTransaction();

        return res.status(201).json({
            status: true,
            message: "Footsal booked & payment confirmed successfully",
            booking,
            payment: paymentConfirm
        });



    } catch (error) {
        await session.abortTransaction();
        console.error("ConfirmPayment error:", error);
        return res.status(500).json({ status: false, message: "Internal server error, please try again." });
    } finally {
        session.endSession();
    }
};
