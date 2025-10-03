
import { sentOTPEmail } from "../Middlewares/EmailVerification.js";
import User from "../Models/NewCustomerModel.js";
import { isValidNepalNumber } from "../UtilityFunctions/HelperFunctions.js";





export const registerUser = async (req, res) => {
    try {
        const { name, email, phone, address, password } = req.body;

        let errors = {};

        // 1. Field checks
        if (!name) errors.name = "Name is required.";
        if (!email) errors.email = "Email is required.";
        if (!phone) errors.phone = "Phone number is required.";
        if (!address) errors.address = "Address is required.";
        if (!password) errors.password = "Password is required.";

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ status: false, errors });
        }

        // 2. Format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            return res.status(400).json({
                status: false,
                errors: { email: "Invalid email format." }
            });
        }

        if (!isValidNepalNumber(phone)) {
            return res.status(400).json({
                status: false,
                errors: { phone: "Please enter a valid Nepal phone number." }
            });
        }

        // 3. Password strength validation
        if (password && password.length < 8) {
            return res.status(400).json({
                status: false,
                errors: { password: "Password must be at least 8 characters long." }
            });
        }

        // 4. Check existing user by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                status: false,
                errors: { email: "Email already in use." }
            });
        }

        // (Optional) Check existing user by phone
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res.status(409).json({
                status: false,
                errors: { phone: "Phone number already in use." }
            });
        }

        // 5. Create new user
        const newUser = new User({ name, email, phone, address, password });
        const savedUser = await newUser.save();

        // 6. Remove sensitive fields before sending response
        const safeUser = savedUser.toObject();
        delete safeUser.password;
        delete safeUser.__v;

        // 7. Success response
        return res.status(201).json({
            status: true,
            message: "User registered successfully.",
            user: safeUser,
            token: await newUser.generateToken(),
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            errors: { general: error.message }
        });
    }
};




export const UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        let errors = {};

        // Input validation
        if (!email) errors.email = "Email is required.";
        else {
            // Basic email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.email = "Invalid email format.";
            }
        }

        if (!password) errors.password = "Password is required.";

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ status: false, errors });
        }

        // Check if user exists
        const user = await User.findOne({ email }).select("+password"); // ensure password field is included if schema has select:false

        if (!user) {
            return res.status(400).json({
                status: false,
                errors: { email: "Unauthorized user" }
            });
        }

        // Validate password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({
                status: false,
                errors: { password: "Unauthorized user" }
            });
        }

        // Generate token
        const token = await user.generateToken();

        // Remove sensitive data before sending response
        const safeUser = user.toObject();
        delete safeUser.password;
        delete safeUser.__v;

        return res.status(200).json({
            status: true,
            token,
            user: safeUser
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            errors: { general: error.message }
        });
    }
};



export const AuthUserData = async (req, res) => {
    try {
        const { userId, email } = req.user || {};

        // 1. Authorization check
        if (!userId || !email) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized user"
            });
        }

        // 2. Find user (exclude sensitive fields)
        const authUser = await User.findOne(
            { _id: userId, email },
            "-password -__v" // projection: exclude sensitive fields
        );

        if (!authUser) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        // 3. Success response
        return res.status(200).json({
            status: true,
            user: authUser
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            errors: { general: error.message }
        });
    }
};



export const getAllCustomers = async (req, res) => {
    try {
        const { userId } = req.user || {};

        // 1. Authorization check
        if (!userId) {
            return res.status(401).json({
                status: false,
                message: "You need to login first."
            });
        }

        const authUser = await User.findById(userId).select("isAdmin");
        if (!authUser?.isAdmin) {
            return res.status(403).json({
                status: false,
                message: "You are not authorized to access this resource."
            });
        }

        // 2. Filters
        const { name, phone, date } = req.query;
        const filters = {};

        if (name) {
            filters.name = { $regex: name, $options: "i" };
        }
        if (phone) {
            filters.phone = { $regex: phone, $options: "i" };
        }
        if (date) {
            const start = new Date(date);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            filters.createdAt = { $gte: start, $lte: end }; // safer than filters.date
        }

        // 3. Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;

        // 4. Query with filters, pagination, and field selection
        const [customers, total] = await Promise.all([
            User.find(filters)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-password -__v") // exclude sensitive fields
                .lean(),
            User.countDocuments(filters),
        ]);

        // 5. Success response
        return res.status(200).json({
            status: true,
            message: "Customers retrieved successfully.",
            data: customers,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            },
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            errors: { general: error.message }
        });
    }
};



// delete customer

export const deleteCustomer = async (req, res) => {
    try {
        const { userId } = req.user; // set by auth middleware
        const { customerId } = req.params;

        // 1. Authentication check
        if (!userId) {
            return res.status(401).json({ status: false, message: "Authentication required" });
        }

        // 2. Validate customerId format
        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            return res.status(400).json({ status: false, message: "Invalid Customer ID" });
        }

        // 3. Check if requesting user is an admin
        const adminUser = await User.findById(userId);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(403).json({ status: false, message: "Access denied. Admins only" });
        }

        // 4. Prevent admin from deleting themselves
        if (userId.toString() === customerId.toString()) {
            return res.status(400).json({ status: false, message: "You cannot delete your own account" });
        }

        // 5. Check if customer exists
        const customer = await User.findById(customerId);
        if (!customer) {
            return res.status(404).json({ status: false, message: "Customer not found" });
        }

        // 6. Perform deletion
        const result = await User.deleteOne({ _id: customerId });

        if (result.deletedCount === 0) {
            return res.status(500).json({ status: false, message: "Failed to delete customer" });
        }

        return res.status(200).json({ status: true, message: "Customer deleted successfully" });

    } catch (error) {
        console.error("Error deleting customer:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
};



// Forgot password 

let otpStore = {};
let verifiedEmails = {};
let verifiedOTP = {};



export const sendForgotPasswordOtp = async (req, res) => {

    const { email } = req.body;


    if (!email) return res.status(400).json({ status: false, msg: 'Email is required' });

    const isEmailExist = await User.findOne({ email: email });

    if (!isEmailExist) return res.status(400).json({ status: false, msg: 'User is not Exist Yet.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 mins

    try {
        await sentOTPEmail(email, otp);
        return res.status(200).json({ status: true, msg: 'OTP sent to your email' });
    } catch (error) {
        return res.status(500).json({ status: false, msg: 'Failed to send OTP', error });
    }
};

export const verifyForgotOtp = (req, res) => {

    const { email, otp } = req.body;

    console.log(email);

    console.log(otp);




    if (!email || !otp) return res.status(400).json({ status: false, msg: 'Email and OTP are required' });

    const record = otpStore[email];

    if (!record) return res.status(400).json({ status: false, msg: 'No OTP sent to this email' });

    if (record.expiresAt < Date.now()) {
        delete otpStore[email];
        return res.status(400).json({ status: false, msg: 'OTP expired' });
    }


    if (record.otp !== otp) {
        return res.status(400).json({ status: false, msg: 'Invalid OTP' });
    }
    verifiedOTP[email] = true;


    delete otpStore[email];
    verifiedEmails[email] = true;


    return res.status(200).json({ status: true, msg: 'OTP verified successfully', verifiedOTP, verifiedEmails });
};


export const resetForgotPassword = async (req, res) => {

    const { email, newPassword, confirmPassword } = req.body;



    if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({ status: false, msg: 'Email and new password are required' });
    }

    if (newPassword !== confirmPassword) return res.status(400).json({ status: false, msg: 'Confirm password does not matched' });

    if (!verifiedEmails[email]) {
        return res.status(401).json({ status: false, msg: 'OTP not verified or session expired' });
    }



    try {

        const user = await User.findOne({ email: email });

        if (!user) return res.status(404).json({ status: false, msg: 'User not found' });




        user.password = newPassword;
        await user.save();

        delete verifiedEmails[email];

        return res.status(200).json({ status: true, msg: 'Password reset successfully' });


    } catch (error) {

        return res.status(500).json({ status: false, msg: 'Failed to reset password', error });

    }
};