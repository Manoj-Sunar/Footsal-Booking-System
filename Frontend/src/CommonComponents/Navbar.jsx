import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useWeareHouse } from "../WeareHouse/WeareHouseContext";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import DropdownMenu from "./DropdownMenu";
import { useMemo } from "react";

const navItems = [
  { name: "Home", path: "/" },

  { name: "Booking", path: "/booking-slots" },

  { name: "Contact Us", path: "/contact" },
];

const linkClass = (isActive) =>
  isActive
    ? "text-yellow-300 font-semibold border-b-2 border-yellow-300 pb-1"
    : "text-white font-medium hover:text-yellow-300 transition-colors duration-300";



const Navbar = () => {


  const { AuthUser } = useWeareHouse();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const firstLetter = useMemo(() => {
    return AuthUser?.user?.name?.[0]?.toUpperCase();
  }, [AuthUser]);

  const handleLinkClick = () => setIsOpen(false);



  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const UserSection = () =>
    AuthUser ? (
      <DropdownMenu
        position="right"
        trigger={
          <Avatar sx={{ bgcolor: deepOrange[500], cursor: "pointer" }}>
            {firstLetter}
          </Avatar>
        }
        items={[
          {
            label: "Profile",
            component: NavLink,
            to: `${AuthUser?.user?.isAdmin ? "/admin" : "/profile"}`,
          },
          {
            label: "Settings",
            component: NavLink,
            to: "/profile/settings",
          },
          {
            label: "Logout",
            onClick: () => console.log("Logout clicked"),
          },
        ]}
      />
    ) : (
      <NavLink
        to="/login"
        className={({ isActive }) =>
          `px-4 py-2 rounded-lg font-semibold transition duration-300 ${isActive
            ? "bg-yellow-500 text-gray-900"
            : "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
          }`
        }
        onClick={handleLinkClick}
      >
        Login
      </NavLink>
    );

  // Render all menu links + user section
  const renderMenu = () => (
    <>
      {navItems.map((item) => (
        <li key={item.name}>
          <NavLink
            to={item.path}
            className={({ isActive }) => linkClass(isActive)}
            onClick={handleLinkClick}
          >
            {item.name}
          </NavLink>
        </li>
      ))}
      <li>
        <UserSection />
      </li>
    </>
  );

  return (
    <nav className="bg-green-700 shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold text-white">
          FutsalArena
        </NavLink>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">{renderMenu()}</ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900 shadow-md"
          >
            <ul className="flex flex-col items-center py-4 space-y-4">
              {renderMenu()}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
