"use client";
import { memo } from "react";

import { motion } from "framer-motion";
import FootBallAnimation from "./FootBallAnimation";

const AuthWrapper = memo(({ title, children }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white px-6">
            <div className="grid md:grid-cols-2 bg-white shadow-lg rounded-xl overflow-hidden w-full max-w-4xl">
                {/* ✅ Left Section */}
                <FootBallAnimation />

                {/* ✅ Right Section */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="p-8 flex flex-col justify-center"
                >
                    <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
                        {title}
                    </h1>
                    {children}
                </motion.div>
            </div>
        </div>
    );
});

export default AuthWrapper;
