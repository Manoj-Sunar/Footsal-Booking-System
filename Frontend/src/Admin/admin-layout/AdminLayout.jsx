import React, { useCallback, useRef, useState } from "react";
import { useIsDesktop } from "../../Layout/ProfileLayout";
import SideBar from "../../CommonComponents/SideBar";
import { ProfileNavbar } from "../../CommonComponents/ProfileNavbar";

import UnifiedModal from "../../ModalSystem/UnifiedModal";
import { Home, CalendarCheck, BookDashed, Wallet, FileText, Users, Settings } from "lucide-react"
import { Outlet } from "react-router-dom";
import NotificationModal from "../../ModalSystem/Modals/NotificationModal";
import { useAllNotification } from "../../CustomsHooks/QueryAPICalls";




const menuItems = [
    { name: "Dashboard", icon: Home, path: "/admin" },
    { name: "Bookings", icon: CalendarCheck, path: "/admin/bookings" },
    { name: "Monthly Bookings", icon: BookDashed, path: "/admin/booking-slots-manage" },


    { name: "Customers", icon: Users, path: "/admin/users" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
];




const AdminLayout = () => {
    const isDesktop = useIsDesktop();
    const [isOpen, setIsOpen] = useState(isDesktop);

    const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);

    const [openNotification, setOpenNotification] = useState(false);
    const bellRef = useRef(null);

   const{data}=useAllNotification();
   const notifications=data?.notification;




    return (
        <>
            <div className="flex min-h-screen bg-gray-100 ">
                <SideBar
                    isOpen={isOpen}
                    toggleSidebar={toggleSidebar}
                    isDesktop={isDesktop}
                    menuItems={menuItems}
                />


                <div className="flex flex-col flex-1">
                    <ProfileNavbar toggleSidebar={toggleSidebar} setNotificationOpen={setOpenNotification} reference={bellRef} unreadMsgLength={data?.unreadLength} />


                    <main className="flex-1 p-2 mt-15 md:w-[83.3%] w-full ml-auto relative">
                        <Outlet />
                        <NotificationModal
                            notifications={notifications}
                            isOpen={openNotification}                 // ✅ fixed
                            onClose={() => setOpenNotification(false)}
                            anchorRef={bellRef}                       // ✅ added
                        />
                    </main>

                </div>


            </div>


            {/* Mount once per app */}
            <UnifiedModal />
        </>
    );
};


export default AdminLayout;