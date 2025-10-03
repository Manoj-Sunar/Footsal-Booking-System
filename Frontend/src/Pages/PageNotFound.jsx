"use client";
import { memo } from "react";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";
import FootBallAnimation from "../CommonComponents/FootBallAnimation";

const PageNotFound = () => {
    return (
        <div className="flex  flex-col-reverse items-center justify-center min-h-screen p-6 bg-gradient-to-b from-green-50 to-white text-center md:text-left">
            {/* Text Section */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md flex flex-col items-center "
            >
                <h1 className="text-6xl font-bold text-green-700">404</h1>
                <p className="mt-4 text-lg text-gray-700 text-center">
                    Oops! The page you are looking for doesn’t exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block mt-6 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors"
                >
                    Go Home
                </Link>
            </motion.div>

            {/* Animation Section */}
            <div className="w-full md:w-auto mb-8 md:mb-0">
                <FootBallAnimation />
            </div>
        </div>
    );
};

export default memo(PageNotFound);
