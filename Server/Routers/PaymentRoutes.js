
import express from "express";

import { authMiddleware } from "../Middlewares/AuthMiddleware.js";

import { ConfirmPayment } from "../Controllers/PaymentControler.js";


export const paymentRouter = express.Router();

paymentRouter.post("/payment-confirm/:bookingId/:day/:slotId/:timeSlotId", authMiddleware, ConfirmPayment);


