import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
    {

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to your User model
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        bookingDate: {
            type: Date, // exact booking date & time
            required: true,
        },

        day:{
            type:String,
            required:true,
        },

        time: {

            startTime: {
                type: String, // e.g., "10:00 AM"
                required: true,
            },

            endTime: {
                type: String, // e.g., "12:00 PM"
                required: true,
            },
        },

        read: {
            type: Boolean,
            default: false, // unread by default
        },

    },
    { timestamps: true } // adds createdAt & updatedAt automatically
);

export default mongoose.model("Notification", NotificationSchema);
