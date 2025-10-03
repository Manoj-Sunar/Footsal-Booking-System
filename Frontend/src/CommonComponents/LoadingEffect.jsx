"use client";
import { memo } from "react";
import { motion } from "framer-motion";

const LoadingEffect = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        {/* 🔵 Rotating Circle Loader */}
        <motion.div
          className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-t-green-500 border-green-200"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        >
          {/* 🌟 Inner glowing pulse */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-green-400"
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 0.2, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </motion.div>

        {/* 🟢 Loading text */}
        <motion.p
          className="mt-6 text-green-600 font-semibold text-lg md:text-xl"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
};

export default memo(LoadingEffect);
