import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, CalendarDays, Clock } from "lucide-react";
import DropdownMenu from "../../CommonComponents/DropdownMenu";
import { Ellipsis } from 'lucide-react';
import { useApiMutation } from "../../CustomsHooks/useApiMutation";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Format functions
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // invalid date fallback
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

// utils/formatTimeAgo.js
export const formatTimeAgo = (dateString) => {
  if (!dateString) return "";

  const now = new Date();
  const past = new Date(dateString);

  if (isNaN(past.getTime())) return "";

  const diffInSeconds = Math.floor((now - past) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const divisions = [
    { amount: 60, unit: "second" },   // 60 sec → 1 min
    { amount: 60, unit: "minute" },   // 60 min → 1 hr
    { amount: 24, unit: "hour" },     // 24 hr → 1 day
    { amount: 7, unit: "day" },       // 7 days → 1 week
    { amount: 4.34524, unit: "week" },// ~4.3 weeks → 1 month
    { amount: 12, unit: "month" },    // 12 months → 1 year
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ];

  let duration = diffInSeconds;
  for (let i = 0; i < divisions.length; i++) {
    if (Math.abs(duration) < divisions[i].amount) {
      return rtf.format(-Math.round(duration), divisions[i].unit);
    }
    duration /= divisions[i].amount;
  }
};


const NotificationModal = ({ notifications = [], isOpen, onClose, anchorRef }) => {
  const anchorRect = anchorRef?.current?.getBoundingClientRect();


  const queryClient = useQueryClient();
  const { mutateAsync } = useApiMutation('DELETE');

  const notificationDelete = useCallback(async (notificationId) => {
    try {
      const response = await mutateAsync({
        url: `/booking/admin/delete-notification/${notificationId}`,
      });

      if (response.status === true) {
        queryClient.invalidateQueries(['booking']);
      }
    } catch (error) {
      throw new Error(error);
    }
  }, [queryClient, mutateAsync]);


  return (
    <AnimatePresence>
      {isOpen && anchorRect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="fixed z-[99999] w-[360px] bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden"
          style={{
            top: anchorRect.bottom + 3,
            left: anchorRect.right - 360,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-b-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <h2 className="font-semibold">Notifications</h2>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/20 rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications list */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm text-center">
                No notifications yet
              </p>
            ) : (
              notifications.map((n, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="p-4 hover:bg-gray-50 transition-colors flex gap-3 items-start border-b border-b-gray-200 last:border-b-0"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="flex flex-col gap-y-1">
                    <p className="text-sm font-medium text-gray-800">
                      {n?.message || "No message available"}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {formatDate(n?.bookingDate)}

                      {n?.time?.startTime && n?.time?.endTime && (
                        <> • {n?.time?.startTime} - {n?.time?.endTime}</>
                      )}

                      {n?.day && ` (${n?.day})`}
                    </p>
                    <p className="text-xs  italic text-blue-900">{formatTimeAgo(n?.createdAt)}</p>
                  </div>

                  <DropdownMenu
                    trigger={
                      <Ellipsis className="w-4" />

                    }
                    items={[
                      {
                        label: "Remove",
                        onClick: () => notificationDelete(n?._id),
                      },
                      {
                        label: "Mark as read"
                      }
                    ]}
                  />
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
