import express from "express";
import { AuthUserData,  deleteCustomer,  getAllCustomers,  registerUser, resetForgotPassword, sendForgotPasswordOtp, UserLogin, verifyForgotOtp } from "../Controllers/AuthController.js";
import { authMiddleware } from "../Middlewares/AuthMiddleware.js";


export const AuthRouter = express.Router();

AuthRouter.post("/customer-register", registerUser);

AuthRouter.post("/customer-login", UserLogin);

AuthRouter.get("/auth-customer", authMiddleware, AuthUserData);

AuthRouter.get("/all-customers", authMiddleware, getAllCustomers);

AuthRouter.delete("/customer-delete/:customerId",authMiddleware,deleteCustomer);


// Forgot password otp

AuthRouter.post("/send-forgot-password-otp",sendForgotPasswordOtp);

AuthRouter.post("/verify-otp",verifyForgotOtp);

AuthRouter.post("/reset-password",resetForgotPassword);