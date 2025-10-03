"use client";
import { memo, useMemo } from "react";
import { motion } from "framer-motion";

const FootballAnimation = () => {
  const bounceAnimation = useMemo(() => ({
    y: [0, -30, 0],
    transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
  }), []);

  const shadowAnimation = useMemo(() => ({
    scale: [1, 0.8, 1],
    opacity: [0.4, 0.2, 0.4],
    transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
  }), []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="hidden md:flex  items-center justify-center relative"
      aria-hidden="true"
    >
      <motion.img
        loading="lazy"
        src="/football.png"
        alt="Football"
        className="w-44 h-44"
        animate={bounceAnimation}
      />
      <motion.div
        className="absolute bottom-20 w-20 h-2 bg-black/20 rounded-full"
        animate={shadowAnimation}
      ></motion.div>
    </motion.div>
  );
};

export default memo(FootballAnimation);
