import { memo } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {

    LogOut,
    Menu,

} from "lucide-react";


const SideBar = ({ isOpen, toggleSidebar, isDesktop, menuItems }) => {
    return (
        <AnimatePresence>
            {(isOpen || isDesktop) && (
                <motion.aside
                    initial={{ x: -250 }}
                    animate={{ x: 0 }}
                    exit={{ x: -250 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-0 left-0 h-full bg-white shadow-lg z-40 w-64 md:translate-x-0"
                    aria-label="Sidebar navigation"
                >
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-4">
                        <NavLink to={"/"} className="text-lg font-bold text-green-600">
                            Futsal Booking
                        </NavLink>
                        {!isDesktop && (
                            <button className="md:hidden" onClick={toggleSidebar} aria-label="Close sidebar">
                                <Menu size={20} />
                            </button>
                        )}
                    </div>

                    {/* Menu Items */}
                    <nav className="mt-4 flex flex-col gap-1">
                        {menuItems.map((item, index) => (
                            <MenuItem
                                key={index}
                                name={item.name}
                                Icon={item.icon}
                                path={item.path}
                                onClick={() => !isDesktop && toggleSidebar()}
                            />
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="absolute bottom-4 w-full px-4">
                        <button className="flex items-center gap-3 px-4 py-2 w-full rounded-lg hover:bg-red-50 hover:text-red-600">
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
};


export default memo(SideBar);



// Memoized MenuItem component for performance
const MenuItem = memo(({ name, Icon, path, onClick }) => (
    <Link
        to={path}
        onClick={onClick}
        className="flex items-center p-3 rounded-lg transition-all hover:bg-green-50 hover:text-green-600"
    >
        <Icon className="mr-3 w-5 h-5" />
        <span>{name}</span>
    </Link>
));