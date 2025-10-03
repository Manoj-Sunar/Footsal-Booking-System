
"use client";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import Button from "../CommonComponents/Button";
import { Ellipsis, ChevronRight } from "lucide-react";
import DropdownMenu from "./DropdownMenu";

import { useApiMutation } from "../CustomsHooks/useApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "../ModalSystem/ModalContext";



// Reusable Slot Button
const SlotButton = ({
  time,
  dayData,
  selectedSlot,
  Isbooked,
  onSelectSlot,
  role,
  isAdmin,
  onClickRemove
}) => {

  const isSelected =
    selectedSlot?.day === dayData.day &&
    selectedSlot?.startTime === time.startTime &&
    selectedSlot?.endTime === time.endTime;

  const { openModal } = useModal();




  return (

    <div className="flex items-center justify-between gap-2">

      <button
        onClick={() =>
          !Isbooked &&
          onSelectSlot(dayData.day, dayData?._id, { ...time, package: dayData.package })
        }
        disabled={Isbooked && role === "user"}
        className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:scale-105 transform
          ${Isbooked
            ? "bg-red-500 text-white cursor-not-allowed"
            : isSelected
              ? "bg-green-600 text-white shadow-lg"
              : "bg-green-50 text-green-700 hover:bg-green-100"
          }`}
      >
        {time.startTime} - {time.endTime}{" "}
        <span className="text-xs text-gray-700">({time.duration})</span>
        {Isbooked && (role === "user" ? " - Booked" : " - Reserved")}
      </button>

      {isAdmin && (
        <DropdownMenu
          position="right"
          trigger={
            <div className="cursor-pointer text-gray-500 hover:text-gray-800">
              <ChevronRight size={18} />
            </div>
          }
          items={[
            { label: "Remove Slot", onClick: () => onClickRemove() },
            {
              label: "Edit Slot",

              onClick: () =>
                openModal("addHours", {
                  selectedSlot: selectedSlot,
                  time: time,
                }),
            },
            Isbooked && {
              label: "Start Match",
              onClick: () =>
                openModal("startMatch", {
                  duration: time?.duration,
                  slotId: time?._id,   // ✅ pass slot id
                }),
            }
          ].filter(Boolean)}
        />
      )}


    </div>
  );
};



const ScheduleGrid = ({
  scheduleData,
  selectedSlot,
  onSelectSlot,
  onAction,
  actionLabel = "Book Now",
  isAdmin,
}) => {

  const { openModal } = useModal();

  const { mutateAsync } = useApiMutation('DELETE');

  const queryClient = useQueryClient();



  const handleDeleteTime = useCallback(async (daySlotId, timeSlotId) => {

    try {

      const response = await mutateAsync({
        url: `/hourly/delete-time-slots/${daySlotId}/${timeSlotId}`,
      });

      if (response.status === true) {
        queryClient.invalidateQueries(['timeSlots']);
      }

    } catch (error) {

      throw new Error(error);

    }

  }, [mutateAsync, queryClient]);

  console.log(scheduleData)

  console.log(
    scheduleData?.times?.map((time) => { return time.isBooked })
  );



  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {scheduleData.map((dayData, index) => (
        <motion.div
          key={dayData.day}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="relative bg-white rounded-2xl shadow-lg p-4 flex flex-col hover:shadow-2xl transition-shadow duration-300"
        >
          {/* Day Header with Ellipsis aligned */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
            <h3 className="text-lg font-bold text-green-700">{dayData.day}</h3>

            {isAdmin && (
              <DropdownMenu
                position="right"
                trigger={
                  <div className="p-1 cursor-pointer text-gray-500 hover:text-gray-800">
                    <Ellipsis size={20} />
                  </div>
                }
                items={[
                  {
                    label: "Add Hours",
                    onClick: () =>
                      openModal("addHours", {
                        day: dayData.day,
                        package: dayData.package,
                        slotId: dayData._id,
                      }),
                  },
                  { label: "Remove Day" },
                ]}
              />
            )}
          </div>

          {/* Time Slots */}
          <div className="flex-1 overflow-y-auto max-h-90 space-y-2
            scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent
            hover:scrollbar-thumb-gray-400 transition-colors duration-300">
            {dayData.times.length === 0 ? (
              <p className="text-gray-400 text-center text-sm">No slots available</p>
            ) : (
              dayData.times.map((time) => (
                <SlotButton
                  key={time._id}
                  time={time}
                  dayData={dayData}
                  selectedSlot={selectedSlot}
                  onSelectSlot={onSelectSlot}
                  Isbooked={time?.isBooked}
                  onClickRemove={() => handleDeleteTime(dayData?._id, time?._id)}
                  isAdmin={isAdmin}
                />
              ))
            )}
          </div>

          {/* Book Button */}
          {selectedSlot?.day === dayData.day && (
            <Button
              label={actionLabel}
              onClick={() => onAction(selectedSlot)}
              className="mt-4 w-full bg-green-600 text-white hover:bg-green-700 shadow-md transition-all"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ScheduleGrid;
