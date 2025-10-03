
import mongoose from "mongoose";
import BookingModel from "../Models/BookingModel.js";
import User from "../Models/NewCustomerModel.js";
import TimeSlotsModal from "../Models/TimeSlotsModal.js";
import { formatDate, formatTimeTo12Hour, isValidNepalNumber, parseTimeToMinutes } from "../UtilityFunctions/HelperFunctions.js";
import NotificationsModal from "../Models/NotificationsModal.js";



export const AuthBookingDetails = async (req, res) => {
  try {
    const { userId } = req.user;

    // 1. Authentication check
    if (!userId) {
      return res.status(401).json({ status: false, message: "Authentication required" });
    }

    // 2. Fetch bookings
    const userBookings = await BookingModel.find({ user: userId, draft: false }).lean();

    // 3. Handle no bookings
    if (!userBookings || userBookings.length === 0) {
      return res.status(404).json({
        status: false,
        message: "It looks like you haven’t booked any Futsal program yet. Ready to make your first booking?",
      });
    }

    // 4. Success response
    return res.status(200).json({
      status: true,
      count: userBookings.length,
      bookings: userBookings,
    });

  } catch (error) {
    console.error("Error fetching booking details:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};








export const createBooking = async (req, res) => {

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const { userId } = req.user; // ✅ Auth middleware required

    const { timeSlotsId } = req.params;

    const { name, phone, email, address, date, day, startTime, endTime, price } = req.body;

    console.log(startTime, endTime)
    // -----------------------
    // ✅ Input Validation
    // -----------------------


    const requiredFields = { name, phone, email, address, date, day, startTime, endTime, price };

    const errors = {};

    if (!timeSlotsId) return res.status(404).json({ status: false, message: 'Times Slots id is Required' });



    for (const [field, value] of Object.entries(requiredFields)) {

      if (!value) errors[field] = `${field} is required.`;

    }


    if (Object.keys(errors).length > 0) {

      return res.status(400).json({ status: false, errors });

    }



    if (!isValidNepalNumber(phone)) {
      return res.status(400).json({ status: false, errors: { phone: "This number is not a valid phone number." } });
    }



    // -----------------------
    // ✅ Date Validation
    // -----------------------
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);


    if (bookingDate < today) {
      return res.status(400).json({ status: false, errors: { date: "Booking date cannot be in the past." } });
    }

    // -----------------------
    // ✅ Time Validation
    // -----------------------
    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);

    if (isNaN(startMinutes) || isNaN(endMinutes)) {
      return res.status(400).json({ status: false, errors: { time: "Invalid start or end time format." } });
    }

    if (endMinutes <= startMinutes) {
      return res.status(400).json({ status: false, errors: { endTime: "End time must be after start time." } });
    }

    const duration = endMinutes - startMinutes;
    if (duration < 60) {
      return res.status(400).json({ status: false, errors: { endTime: "Booking must be at least 1 hour long." } });
    }


    if (bookingDate.getTime() === today.getTime()) {
      const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
      if (startMinutes < nowMinutes) {
        return res.status(400).json({ status: false, errors: { startTime: "Start time cannot be in the past for today." } });
      }
    }

    // -----------------------


    // -----------------------
    // ✅ Overlap Check (same day)
    // -----------------------
    const startOfDay = new Date(bookingDate);

    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);

    endOfDay.setHours(23, 59, 59, 999);

    const existingBooking = await BookingModel.findOne({
      date: { $gte: startOfDay, $lte: endOfDay },
      draft: false,
      $and: [
        { startTimeMinutes: { $lt: endMinutes } },
        { endTimeMinutes: { $gt: startMinutes } },
      ],
    }).session(session);



    if (existingBooking) {
      return res.status(400).json({
        status: false,
        errors: {
          time: `This slot (${existingBooking.startTime} - ${existingBooking.endTime}) is already booked on ${formatDate(date)}.`
        }
      });
    }

    // -----------------------
    // ✅ Create Booking + Mark Slot (Atomic)
    // -----------------------


    const newBooking = new BookingModel({
      user: userId,
      TimeSlotId: timeSlotsId,
      name,
      phone,
      email,
      address,
      date: bookingDate,
      day,
      startTime: startTime,
      endTime: endTime,
      startTimeMinutes: startMinutes,
      endTimeMinutes: endMinutes,
      duration,
      price,
      draft: true,
    });

    await newBooking.save({ session });


    await session.commitTransaction();

    return res.status(201).json({ status: true, message: "Booking created successfully.", booking: newBooking });
  } catch (error) {
    await session.abortTransaction();

    console.log(error);

    return res.status(500).json({ status: false, errors: { general: error } });
  } finally {
    session.endSession();
  }
};










export const getBookingDataByIdAndAuthUser = async (req, res) => {

  try {

    const { userId } = req.user;

    const { bookingId } = req.params;

    if (!userId) return res.status(400).json({ status: false, message: "you need to login" });

    if (!bookingId) return res.status(404).json({ status: false, message: 'The Booking Id is needed' });

    const currentBooking = await BookingModel.findOne({ user: userId, _id: bookingId });

    if (!currentBooking) return res.status(404).json({ status: false, message: 'Currently booking is not exist' });

    return res.status(200).json({ status: true, currentBooking });

  } catch (error) {

  }
}







export const AdminAllBookingDetails = async (req, res) => {
  try {
    const { userId } = req.user || {};

    // ✅ Authentication
    if (!userId) {
      return res.status(401).json({
        status: false,
        message: "Authentication required. Please log in.",
      });
    }

    // ✅ Authorization
    const authUser = await User.findById(userId).select("isAdmin");
    if (!authUser?.isAdmin) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to access this resource.",
      });
    }

    // ✅ Extract filters
    const { name, phone, date } = req.query;
    const filters = {};

    if (name) {
      filters.name = { $regex: name, $options: "i" }; // case-insensitive
    }
    if (phone) {
      filters.phone = { $regex: phone, $options: "i" };
    }
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999); // include entire day
      filters.date = { $gte: start, $lte: end };
    }

    // ✅ Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    // ✅ Query with filters + pagination
    const [bookings, total] = await Promise.all([
      BookingModel.find(filters)
        .populate({
          path: "user",
          select: "name email phone", // only minimal user info
        })
        .populate({
          path: "TimeSlotId",
          select: "slotLabel startTime endTime", // only necessary fields
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // faster read
      BookingModel.countDocuments(filters),
    ]);

    return res.status(200).json({
      status: true,
      message: "Bookings retrieved successfully.",
      data: bookings,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("AdminAllBookingDetails Error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};








export const AdminBookingDelete = async (req, res) => {
  try {
    const { userId } = req.user;
    const { bookingId } = req.params;

    const isAdmin = await User.findOne({ _id: userId });

    if (!bookingId) return res.status(404).json({ status: false, message: 'Booking details not found' });

    const bookingData = await BookingModel.findOne({ _id: bookingId });

    if (!bookingData) return res.status(404).json({ status: false, message: 'Booking Data Not Found' });

    if (!isAdmin.isAdmin) return res.status(400).json({ status: false, message: 'You are not able to delete booking data' });

    const deleteBooking = await BookingModel.deleteOne({ _id: bookingId });

    if (!deleteBooking) return res.status(400).json({ status: false, message: 'Booking data Not Deleted Yet' });

    return res.status(201).json({ status: true, message: 'Booking Data Deleted Successfully' });

  } catch (error) {
    throw new Error(error);

  }
}




export const AdminCanChangedBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { userId } = req.user;
    const { status } = req.body;

    if (!userId) return res.status(404).json({ status: false, message: 'Login User is Required' });

    const IsLogin = await User.findOne({ _id: userId });

    if (!IsLogin.isAdmin) return res.status(404).json({ status: false, message: 'You are unable to change status' });

    if (!bookingId) return res.status(404).json({ status: false, message: 'Booking Id is Required' });

    if (!status) return res.status(404).json({ status: false, message: "Updated Status is required" });

    const BookedFootsal = await BookingModel.findOne({ _id: bookingId });

    if (!BookedFootsal) return res.status(404).json({ status: false, message: "Booked Footsal is not found" });

    BookedFootsal.bookingStatus = status;

    await BookedFootsal.save();

    return res.status(201).json({ status: true, message: "Status Updated Successfully" });


  } catch (error) {

  }
}



export const BookingNotification = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).json({
        status: false,
        message: "Authentication required",
      });
    }

    const loginUser = await User.findById(userId).lean();

    if (!loginUser?.isAdmin) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to view notifications",
      });
    }

    // Fetch notifications (latest first)
    const notifications = await NotificationsModal.find()
      .sort({ createdAt: -1 })
      .lean();

    if (notifications.length === 0) {
      return res.status(200).json({
        status: true,
        notification: [],
        unreadLength: 0,
        message: "No notifications yet",
      });
    }

    // More efficient unread count
    const unreadCount = await NotificationsModal.countDocuments({ read: false });

    return res.status(200).json({
      status: true,
      notification: notifications,
      unreadLength: unreadCount,
    });

  } catch (error) {
    console.error("BookingNotification error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};




export const NotificationDelete = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.user;

    // ✅ Authentication check
    if (!userId) {
      return res.status(401).json({
        status: false,
        message: "Authentication required",
      });
    }

    // ✅ Validate ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid notification ID",
      });
    }

    // ✅ Authorization check
    const adminUser = await User.findById(userId).lean();
    if (!adminUser?.isAdmin) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to delete notifications",
      });
    }

    // ✅ Perform delete
    const result = await NotificationsModal.deleteOne({ _id: notificationId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: false,
        message: "Notification not found or already deleted",
      });
    }

    // ✅ Success response
    return res.status(200).json({
      status: true,
      message: "Notification deleted successfully",
    });

  } catch (error) {
    console.error("NotificationDelete error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
