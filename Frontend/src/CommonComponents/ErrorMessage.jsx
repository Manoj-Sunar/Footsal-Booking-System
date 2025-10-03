"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react"; // optional icon
import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-2 p-2 mt-1 text-sm rounded-md   text-red-600"
        >
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorMessage;
