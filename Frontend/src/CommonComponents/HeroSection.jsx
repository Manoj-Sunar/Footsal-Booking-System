"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useId, memo } from "react";

const HeroSection = memo(() => {

    const buttonId = useId();

    return (
        <section className="flex flex-col md:flex-row items-center justify-between px-11 md:px-16 py-20">
            {/* Left Content */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 text-center md:text-left"
            >
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Book Your <span className="text-green-600">Futsal Ground</span> Instantly
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    Find available futsal courts near you, schedule your match, and enjoy a seamless booking experience with just a few clicks.
                </p>
                <button
                    id={buttonId}
                    aria-label="Book futsal ground instantly"
                    className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center gap-2 mx-auto md:mx-0 transition-all duration-300 shadow-md"
                >
                    Book Now <ArrowRight size={20} />
                </button>
            </motion.div>

            {/* Hero Image */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 mt-10 md:mt-0"
            >
                <img

                    src="/footsal.png"
                    alt="Futsal Booking Illustration"
                    loading="lazy"
                    className="w-full max-w-md mx-auto drop-shadow-lg"
                />
            </motion.div>
        </section>
    );
});

export default HeroSection;
