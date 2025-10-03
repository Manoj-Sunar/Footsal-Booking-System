import nodemailer from "nodemailer";
import { generateOtpTemplate } from "./EmailOtpTemplate.js";



export const sentOTPEmail = async (to, otp) => {


    const transporter = nodemailer.createTransport({

        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },

    });

    const html = generateOtpTemplate(otp);

    const mailOptions = {
        from: `"Footsal Booking System" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'OTP for Password Reset',
        html,
    };

    await transporter.sendMail(mailOptions);

}


