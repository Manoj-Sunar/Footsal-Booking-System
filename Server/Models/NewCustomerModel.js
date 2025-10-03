// models/User.js

import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Full Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email Address is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/.+@.+\..+/, "Please enter a valid email address"],
        },
        phone: {
            type: String,
            required: [true, "Phone Number is required"],
            trim: true,
            
        },
        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },

        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);



userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            userId: this._id,
            isAdmin: this.isAdmin,
            email: this.email,
        },

        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
    );
}



userSchema.pre("save", async function (next) {
    
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});


userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
