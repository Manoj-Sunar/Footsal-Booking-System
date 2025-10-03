"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Users, Clock } from "lucide-react";
import HeroSection from "../CommonComponents/HeroSection";
import InfoSection from "../CommonComponents/InfoSection";
import PrimaryButton from "../CommonComponents/PrimaryButton";

const Home = () => {
  const homeFeatures = useMemo(() => [
    { title: "Instant Booking", desc: "Reserve your favorite futsal ground in seconds without any hassle.", icon: <CalendarCheck size={40} className="text-green-600" /> },
    { title: "Play With Friends", desc: "Easily invite and manage your team members for your booked session.", icon: <Users size={40} className="text-green-600" /> },
    { title: "Flexible Timing", desc: "Choose the time slot that suits you best and enjoy the game.", icon: <Clock size={40} className="text-green-600" /> },
  ], []);

  return (
    <div className="bg-gradient-to-b from-green-50 to-white text-gray-900">
      <HeroSection />

      <InfoSection
        title="Why Choose Our Futsal Booking?"
        data={homeFeatures}
        bgColor="bg-white"
        textColor="text-green-700"
      />

      {/* ✅ Call-to-Action Section */}
      <section className="px-6 md:px-16 py-16 text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Ready to Play Your Next Match?
        </motion.h2>
        <p className="text-lg mb-6">
          Book your futsal court today and never miss a game again!
        </p>
        <PrimaryButton
          label="Find Available Grounds"
          className="bg-gray-800 text-green-600  hover:bg-gray-100 shadow-lg"
        />
      </section>
    </div>
  );
};

export default Home;
