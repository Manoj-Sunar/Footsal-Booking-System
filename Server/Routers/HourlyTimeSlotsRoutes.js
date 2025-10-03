
import express from "express";
import { authMiddleware } from "../Middlewares/AuthMiddleware.js";
import { CreateTimeSlots, GetAllTimeSlotsPublic } from "../Controllers/HourlyTimeSlotsController.js";


export const hourlyTimeSlotRouter = express.Router();

hourlyTimeSlotRouter.post("/admin-create-time-slot",authMiddleware,CreateTimeSlots);
hourlyTimeSlotRouter.get("/all-time-slots",GetAllTimeSlotsPublic);

