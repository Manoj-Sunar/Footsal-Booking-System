
import express from "express";

import { authMiddleware } from "../Middlewares/AuthMiddleware.js";

import { AdminAllBookingDetails, AdminBookingDelete, AdminCanChangedBookingStatus, AuthBookingDetails, BookingNotification, createBooking, getBookingDataByIdAndAuthUser, NotificationDelete } from "../Controllers/BookingControllers.js";

export const BookingRoutes = express.Router();

BookingRoutes.post("/booked-footsal/:timeSlotsId", authMiddleware, createBooking);

BookingRoutes.get("/user-booking-details", authMiddleware, AuthBookingDetails);

BookingRoutes.get("/booking-auth-bookingId/:bookingId", authMiddleware, getBookingDataByIdAndAuthUser);





// Admin Routes

BookingRoutes.get("/admin-booking", authMiddleware, AdminAllBookingDetails);


BookingRoutes.delete("/admin-booking-delete/:bookingId", authMiddleware, AdminBookingDelete);


BookingRoutes.put("/admin/booked-footsal-changed/:bookingId", authMiddleware, AdminCanChangedBookingStatus);


BookingRoutes.get("/admin/get-all-notification", authMiddleware, BookingNotification);

BookingRoutes.delete("/admin/delete-notification/:notificationId", authMiddleware, NotificationDelete);