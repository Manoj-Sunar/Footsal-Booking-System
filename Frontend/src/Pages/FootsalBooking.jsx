import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FutsalBookingCalender from "../Components/FootsalBookingCalender";
import BookingForm from "../Components/BookingForm";

const FutsalBookingMerged = ({ isAdmin }) => {

  const [selectedSlot, setSelectedSlot] = useState(null);


  // Unified handler: set slot or null
  const handleSlotSelection = useCallback((slot = null) => {
    setSelectedSlot(slot);
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen gap-4 p-4 bg-gradient-to-b from-green-50 to-green-100">

      {/* Calendar Section */}
      <motion.div
        layout
        className={`transition-all duration-500 
          ${selectedSlot ? "hidden md:block md:w-1/1" : "w-full md:w-1/1"}
        `}
      >
        <FutsalBookingCalender
          isAdmin={isAdmin}
          onBookNow={handleSlotSelection} // slot passed from calendar
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
        />
      </motion.div>

      {/* Booking Section */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            key="booking-form"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-full md:w-1/2 rounded-xl"
          >
            <BookingForm
              slotData={selectedSlot}
              onClose={() => handleSlotSelection(null)}
              timeId={selectedSlot?.slot?._id}
              slotId={selectedSlot?.docId}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FutsalBookingMerged;
