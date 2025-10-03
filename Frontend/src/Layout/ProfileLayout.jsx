import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    CalendarCheck,
    Wallet,
    Settings,
    Menu,
    Users,
    Trophy,
    Bell,
    Search,
    PlusCircle,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import SideBar from "../CommonComponents/SideBar";
import { ProfileNavbar } from "../CommonComponents/ProfileNavbar";
import { ModalProvider } from "../ModalSystem/ModalContext";
// import your InputField component

// Sidebar menu configuration for Futsal Booking System
const menuItems = [
    { name: "My Bookings", icon: CalendarCheck, path: "booking-details" },

    { name: "Settings", icon: Settings, path: "/profile/settings" },
];





const ProfileLayout = () => {
    const isDesktop = useIsDesktop();
    // Sidebar is open by default on desktop, closed on mobile
    const [isOpen, setIsOpen] = useState(isDesktop);

    // When screen size changes, sync sidebar open state accordingly
    useEffect(() => {
        setIsOpen(isDesktop);
    }, [isDesktop]);

    const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);

    return (
        <ModalProvider>

            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} isDesktop={isDesktop} menuItems={menuItems} />

                {/* Main Content */}
                <div className="flex flex-col flex-1">
                    {/* Navbar */}
                    <ProfileNavbar toggleSidebar={toggleSidebar} />

                    {/* Page Content */}
                    <main className="flex-1 p-4 mt-20  md:w-[83.3%] w-full ml-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </ModalProvider>
    );
};

export default ProfileLayout;






// Custom hook to track if screen is desktop size (>=768px)
export const useIsDesktop = () => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isDesktop;
};