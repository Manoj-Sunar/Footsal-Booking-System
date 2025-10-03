import React, { useEffect } from "react";

import AdminBookingSlotsModalContent from "./Modals/AdminBookingSlotsContent";
import { useModal } from "./ModalContext";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import AdminAddHoursModalContent from "./Modals/AdminAddhoursModal";
import StartMatchModal from "./Modals/StartMatchModal";
import AdminBookingEditModal from "./Modals/AdminBookingEditModal";


const REGISTRY = {

    bookingSlots: AdminBookingSlotsModalContent,
    addHours: AdminAddHoursModalContent,
    startMatch: StartMatchModal,
    adminBookingEdit: AdminBookingEditModal,
};


const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
};


const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18 } },
    exit: { opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.12 } },
};


const UnifiedModal = () => {
    const { isOpen, type, props, closeModal } = useModal();


    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && closeModal();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [closeModal]);


    const Content = type ? REGISTRY[type] : null;


    return (
        <AnimatePresence>
            {isOpen && Content && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-[100]"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={closeModal}
                    />


                    <motion.div
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4 scale-90"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div
                            className={`relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 ${type === "startMatch" ? "p-0" : "p-5"
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeModal}
                                className="absolute -top-3 -right-3 bg-white rounded-full shadow p-2 hover:bg-gray-50"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>


                            {/* Render actual content */}
                            <Content closeModal={closeModal} {...props} />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


export default UnifiedModal;