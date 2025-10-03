
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { DatabaseConnection } from "./DB_Connection.js";
import { AuthRouter } from "./Routers/AuthRoutes.js";
import { BookingRoutes } from "./Routers/BookingRoutes.js";
import { paymentRouter } from "./Routers/PaymentRoutes.js";

import { hourlyTimeSlotRouter } from "./Routers/HourlyTimeSlotsRoutes.js";
dotenv.config();

const port=process.env.PORT;


const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

app.use("/auth",AuthRouter);
app.use("/booking",BookingRoutes);
app.use("/booking-payment",paymentRouter);

app.use("/hourly",hourlyTimeSlotRouter);

DatabaseConnection();



const Start=()=>{
    app.listen(port,()=>{
        console.log(`Server listening at port ${port}`);
    })
}

Start();