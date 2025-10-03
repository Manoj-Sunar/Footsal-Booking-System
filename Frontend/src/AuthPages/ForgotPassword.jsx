"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useApiMutation } from "../CustomsHooks/useApiMutation";

// Animation variants
const inputVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
};

// Reusable Input Field
const InputField = ({ icon: Icon, error, ...props }) => (
    <div className="space-y-1">
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-3.5 text-gray-400" size={18} />}
            <input
                {...props}
                className={`w-full pl-11 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none shadow-sm
          ${error ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-blue-400"}
        `}
            />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
);

// Reusable Button
const ActionButton = ({ children, icon: Icon, variant = "primary", disabled, ...props }) => {
    const base =
        "flex items-center justify-center gap-2 py-3 px-5 rounded-lg font-semibold transition-shadow shadow-md";
    const variants = {
        primary: "bg-blue-600 text-white hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    };

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            className={`${base} ${variants[variant]} w-full sm:w-auto`}
            disabled={disabled}
            {...props}
        >
            {Icon && <Icon size={16} />}
            {children}
        </motion.button>
    );
};

// Reusable OTP Input Component
const OtpInput = ({ otp, onChange }) => {
    const handleKeyDown = (e, i) => {
        if (e.key === "Backspace" && !otp[i] && i > 0) {
            document.getElementById(`otp-${i - 1}`)?.focus();
        }
        if (e.key === "ArrowLeft" && i > 0) {
            document.getElementById(`otp-${i - 1}`)?.focus();
        }
        if (e.key === "ArrowRight" && i < otp.length - 1) {
            document.getElementById(`otp-${i + 1}`)?.focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").replace(/\D/g, "");
        if (paste.length === otp.length) {
            const newOtp = paste.split("");
            onChange(newOtp, -1);
        }
    };

    return (
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {otp.map((digit, i) => (
                <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => onChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="w-12 h-12 text-center text-lg font-semibold rounded-lg border border-gray-300 
            focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
            ))}
        </div>
    );
};

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
    const [errors, setErrors] = useState({ email: "", password: "", confirm: "" });

    const { isPending, mutateAsync } = useApiMutation("POST");

    // Step content config
    const steps = [
        {
            title: "Forgot Password",
            description: "Enter your email to receive a verification code",
            render: (
                <InputField
                    icon={Mail}
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    error={errors.email}
                />
            ),
        },
        {
            title: "Verify OTP",
            description: "Enter the 6-digit code sent to your email",
            render: <OtpInput otp={otp} onChange={handleOtpChange} />,
        },
        {
            title: "Reset Password",
            description: "Enter your new password below",
            render: (
                <div className="space-y-4">
                    <InputField
                        icon={Lock}
                        type="password"
                        placeholder="New password"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        required
                        error={errors.password}
                    />
                    <InputField
                        icon={Lock}
                        type="password"
                        placeholder="Confirm password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        required
                        error={errors.confirm}
                    />
                </div>
            ),
        },
    ];

    // Submit handler
    async function handleSubmit(e) {
        e.preventDefault();

        if (step === 1) {
            if (!validateEmail(email)) {
                setErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
                return;
            }
            await sendOtp();
        } else if (step === 2) {
            if (otp.join("").length < 6) return;
            await verifyOtp();
        } else if (step === 3) {
            if (!validatePasswords()) return;
            await resetPassword();
        }
    }

    // API Handlers
    const sendOtp = async () => {
        try {
            const res = await mutateAsync({ url: "/auth/send-forgot-password-otp", data: { email } });
            if (res.status) setStep(2);
        } catch (err) {
            console.error(err);
        }
    };

    const verifyOtp = async () => {
        try {
            const res = await mutateAsync({
                url: "/auth/verify-otp",
                data: { email, otp: otp.join("") },
            });
            if (res.status) setStep(3);
        } catch (err) {
            console.error(err);
        }
    };

    const resetPassword = async () => {
        try {
            const res = await mutateAsync({
                url: "/auth/reset-password",
                data: { email, ...passwords },
            });
            if (res.status) {
                setPasswords({ newPassword: "", confirmPassword: "" });
                alert("Password reset successful!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    // OTP Logic
    function handleOtpChange(value, index) {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value.replace(/[^0-9]/g, "");
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    }

    // Validators
    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const validatePasswords = () => {
        let valid = true;
        const { newPassword, confirmPassword } = passwords;

        if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
            setErrors((prev) => ({
                ...prev,
                password: "Password must be 8+ chars, include uppercase, number, and special char",
            }));
            valid = false;
        } else {
            setErrors((prev) => ({ ...prev, password: "" }));
        }

        if (confirmPassword !== newPassword) {
            setErrors((prev) => ({ ...prev, confirm: "Passwords do not match" }));
            valid = false;
        } else {
            setErrors((prev) => ({ ...prev, confirm: "" }));
        }

        return valid;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f9ff] via-white to-[#eef6ff] p-6">
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 overflow-hidden"
            >
                {/* Decorations */}
                <div className="absolute -top-14 -right-16 w-40 h-40 bg-blue-50 rounded-full pointer-events-none" />
                <div className="absolute -bottom-14 -left-16 w-40 h-40 bg-blue-50 rounded-full pointer-events-none" />

                <div className="relative z-10">
                    {/* Stepper */}
                    <div className="flex items-center justify-center gap-6 mb-6">
                        {steps.map((_, idx) => (
                            <div key={idx} className="flex items-center">
                                <div
                                    className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold
                    ${step >= idx + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                                >
                                    {idx + 1}
                                </div>
                                {idx < steps.length - 1 && <div className="w-10 h-[2px] bg-gray-300 mx-2" />}
                            </div>
                        ))}
                    </div>

                    {/* Title & Description */}
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">{steps[step - 1].title}</h1>
                    <p className="text-center text-gray-500 mb-6">{steps[step - 1].description}</p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                variants={inputVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.4 }}
                            >
                                {steps[step - 1].render}
                            </motion.div>
                        </AnimatePresence>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                            {step > 1 && (
                                <ActionButton type="button" variant="secondary" icon={ArrowLeft} onClick={() => setStep(step - 1)}>
                                    Back
                                </ActionButton>
                            )}
                            <ActionButton
                                type="submit"
                                icon={ArrowRight}
                                disabled={
                                    isPending ||
                                    (step === 1 && !email) ||
                                    (step === 2 && otp.join("").length < 6) ||
                                    (step === 3 && (!passwords.newPassword || !passwords.confirmPassword))
                                }
                            >
                                {isPending ? (
                                    <Loader2 className="animate-spin" />
                                ) : step === 1 ? (
                                    "Continue"
                                ) : step === 2 ? (
                                    "Verify OTP"
                                ) : (
                                    "Reset Password"
                                )}
                            </ActionButton>
                        </div>
                    </form>

                    {/* Back to login */}
                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
