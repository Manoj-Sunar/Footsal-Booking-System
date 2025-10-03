"use client";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import Button from "../CommonComponents/Button";
import { useModal } from "../ModalSystem/ModalContext";
import { useTimeSlots } from "../CustomsHooks/QueryAPICalls";
import DropdownMenu from "../CommonComponents/DropdownMenu";
import { ChevronRight, IndianRupee } from "lucide-react";

// ---------- Helpers ----------
const generateCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const calendar = [];
  let week = [];

  for (let i = 0; i < firstDay.getDay(); i++) week.push(null);

  for (let day = 1; day <= lastDay.getDate(); day++) {
    week.push(new Date(year, month, day));
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    calendar.push(week);
  }

  return calendar;
};

const parseSlotTime = (date, timeStr) => {
  const [rawTime, period] = timeStr.split(" ");
  let [hours, minutes] = rawTime.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  const slotDate = new Date(date);
  slotDate.setHours(hours, minutes, 0, 0);
  return slotDate;
};

const toFullDate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

// ---------- Component ----------
const FutsalBookingCalendar = ({ isAdmin, selectedSlot, setSelectedSlot }) => {
  const { openModal } = useModal();
  const today = useMemo(() => new Date(), []);
  const todayAtMidnight = useMemo(() => {
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [today]);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalPos, setModalPos] = useState({ top: 0, left: 0 });

  const buttonRef = useRef(null);

  const { data } = useTimeSlots();
  const timeSlotsData = data?.data || [];

  const monthName = useMemo(
    () =>
      new Date(currentYear, currentMonth).toLocaleString("default", {
        month: "long",
      }),
    [currentMonth, currentYear]
  );

  const weekdayFull = selectedDate?.toLocaleString("default", { weekday: "long" });

  const calendar = useMemo(
    () => generateCalendar(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const getSlotsForDate = useCallback(
    (date) => {
      if (!date) return { time: [], id: undefined, fullDate: null };
      const fullDate = toFullDate(date);
      const dayData = timeSlotsData.find((d) => d.fullDate === fullDate);
      return { time: dayData?.times || [], id: dayData?._id, fullDate };
    },
    [timeSlotsData]
  );

  const changeMonth = useCallback(
    (delta) => {
      let newMonth = currentMonth + delta;
      let newYear = currentYear;
      if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      }
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
      setSelectedDate(null);
      setSelectedSlot(null);
      setShowModal(false);
    },
    [currentMonth, currentYear, setSelectedSlot]
  );

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target)) {
        setSelectedDate(null);
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-1 md:p-6 min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6 drop-shadow-sm">
        🏆 Futsal Booking System
      </h1>

      {/* Month Selector */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-100 transition"
        >
          ◀
        </button>
        <h2 className="text-xl font-semibold text-green-800">
          {monthName} {currentYear}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-100 transition"
        >
          ▶
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-700 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2 text-green-800">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-center relative">
        {calendar.flat().map((date, idx) => {
          const isPast = date && date < todayAtMidnight;
          const isToday = date?.toDateString() === today.toDateString();
          const isSelected = selectedDate?.toDateString() === date?.toDateString();

          const dayButtonClass = !date
            ? "bg-transparent"
            : isPast
            ? "bg-gray-200 text-gray-400"
            : "bg-white hover:bg-green-50 text-green-700 shadow";

          return (
            <div key={idx} className="relative">
              <button
                ref={isSelected ? buttonRef : null}
                onClick={(e) => {
                  if (date && !isPast) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setModalPos({
                      top: rect.bottom + window.scrollY + 8, // 8px gap
                      left: rect.left + window.scrollX,
                    });
                    setSelectedDate(date);
                    setSelectedSlot(null);
                    setShowModal(!isSelected);
                  }
                }}
                disabled={!date || isPast}
                className={`w-full h-12 flex items-center justify-center rounded-lg shadow-sm transition ${dayButtonClass} 
                  ${isToday ? "border-2 border-green-600" : ""} 
                  ${isSelected ? "bg-green-500 text-white shadow-lg" : ""}`}
              >
                {date?.getDate() || ""}
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedDate && showModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                top: modalPos.top,
                left: modalPos.left,
                zIndex: 99,
              }}
              className="w-80 bg-white rounded-xl shadow-lg p-2 space-y-2"
            >
              {isAdmin && (
                <Button
                  label="Add Hours"
                  className="w-full bg-green-500 text-white"
                  onClick={() =>
                    openModal("addHours", {
                      currentYear,
                      currentMonth: monthName,
                      selectedDay: weekdayFull,
                      fullDate: toFullDate(selectedDate),
                    })
                  }
                />
              )}

              {getSlotsForDate(selectedDate).time.map((slot) => {
                const slotDate = parseSlotTime(selectedDate, slot.startTime);
                const isDisabled = slot.isBooked || slotDate < new Date();

                return (
                  <div key={slot._id} className="flex items-center gap-2">
                    <button
                      disabled={isDisabled}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedSlot({
                            slot,
                            selectedDate,
                            docId: getSlotsForDate(selectedDate).id,
                            fullDate: getSlotsForDate(selectedDate).fullDate,
                            day: weekdayFull,
                          });
                          setShowModal(false);
                        }
                      }}
                      className={`w-full p-2 text-sm rounded-md transition 
                        ${selectedSlot?.slot?._id === slot._id
                          ? "bg-green-500 text-white"
                          : isDisabled
                          ? "bg-gray-300 text-gray-500 font-medium"
                          : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                    >
                      {slot.startTime} - {slot.endTime}
                      {slot?.isBooked && (
                        <span className="block mt-1 text-red-500 font-bold">Booked</span>
                      )}
                    </button>

                    <span className="flex items-center gap-1 p-1 rounded-sm bg-green-50 text-green-700 font-semibold border border-green-200">
                      <IndianRupee size={16} className="text-green-600" />
                      {slot.price}
                    </span>

                    {isAdmin && (
                      <DropdownMenu
                        trigger={<ChevronRight className="text-gray-400 p-[2px]" />}
                        items={[
                          { label: "Remove Slots" },
                          {
                            label: "Edit Slots",
                            onClick: () =>
                              openModal("addHours", {
                                isEdit: true,
                                startTime: slot.startTime,
                                endTime: slot.endTime,
                                price: slot.price,
                              }),
                          },
                          slot?.isBooked && {
                            label: "Start Match",
                            onClick: () =>
                              openModal("startMatch", {
                                slotId: slot._id,
                                duration: slot.duration,
                                slot,
                              }),
                          },
                        ].filter(Boolean)}
                      />
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default FutsalBookingCalendar;
