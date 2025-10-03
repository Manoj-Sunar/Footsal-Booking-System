"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";




const DropdownMenu = ({ trigger, items = [], position = "right" }) => {

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);




  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  return (
    <div className="relative inline-block" ref={menuRef}>

      {/* Trigger */}
      
      <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>



      {/* Dropdown Items */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute mt-2 w-43 bg-white shadow-lg rounded-md overflow-hidden z-50 
              ${position === "right" ? "right-0" : "left-0"}`}
          >
            {items.map((item, idx) => (
              <li key={idx}>
                {item.component ? (
                  <item.component
                    to={item.to}
                    className="block px-4 py-2 text-gray-800 hover:bg-yellow-100 transition"
                    onClick={() => {
                      item.onClick?.();
                      setOpen(false);

                    }}
                  >
                    {item.label}
                  </item.component>
                ) : (
                  <button
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-yellow-100 transition"
                    onClick={() => {
                      item.onClick?.();
                      setOpen(false);

                    }}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>


    </div>
  );
};

export default DropdownMenu;
