"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DropdownMenu = ({
  trigger,
  items = [],
  menuClassName = "",
  registerRef,
  unregisterRef,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  // Register dropdown for outside-click detection
  useEffect(() => {
    if (menuRef.current && registerRef) registerRef(menuRef.current);
    if (triggerRef.current && registerRef) registerRef(triggerRef.current);
    return () => {
      if (menuRef.current && unregisterRef) unregisterRef(menuRef.current);
      if (triggerRef.current && unregisterRef) unregisterRef(triggerRef.current);
    };
  }, [registerRef, unregisterRef]);

  return (
    <div className="relative inline-block">
      {/* Dropdown trigger */}
      <div
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation(); // prevent outside click listener from firing
          setOpen((prev) => !prev);
        }}
        className="dropdown-trigger cursor-pointer"
      >
        {trigger}
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()} // stop outside closing
            className={`dropdown-menu absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 p-1 z-[9999] ${menuClassName}`}
          >
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.onClick) item.onClick();
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-green-100 rounded"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;
