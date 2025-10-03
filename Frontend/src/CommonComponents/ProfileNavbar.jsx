import React from "react";
import Avatar from "@mui/material/Avatar";
import { useActionButton } from "../ModalSystem/ModalContext";
import { Menu, Search, Bell } from "lucide-react";


export const ProfileNavbar = ({ toggleSidebar, setNotificationOpen, reference,unreadMsgLength}) => {

    const actionButton = useActionButton();




    return (
        <header className="bg-white shadow-sm fixed w-full md:w-[83.4%] top-0 z-30 right-0">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
                {/* Mobile Sidebar Toggle */}
                <button onClick={toggleSidebar} className="md:hidden p-2 rounded hover:bg-gray-100">
                    <Menu size={24} />
                </button>


                {/* Search Bar */}
                <div className="flex items-center gap-2 w-full max-w-md bg-gray-100 px-3 py-2 rounded-lg">
                    <Search size={18} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search bookings, teams..."
                        className="bg-transparent outline-none w-full text-sm"
                    />
                </div>


                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {actionButton && (
                        <button
                            className="hidden md:flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition"
                            onClick={actionButton.onClick}
                        >
                            <actionButton.icon size={18} /> {actionButton.label}
                        </button>
                    )}


                    <button className="relative p-2 hover:bg-gray-100 rounded-full " ref={reference} onClick={() => setNotificationOpen(true)} >

                        <Bell size={20} />

                        {
                            unreadMsgLength>0&&<span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {unreadMsgLength}
                        </span>
                        }
                    </button>


                    <Avatar variant="circular">M</Avatar>
                </div>
            </div>
        </header>
    );
};