"use client";
import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../CommonComponents/Card";
import Button from "../CommonComponents/Button";
import { useApiMutation } from "../CustomsHooks/useApiMutation";
import LoadingEffect from "../CommonComponents/LoadingEffect";
import { useCurrentBooking } from "../CustomsHooks/QueryAPICalls";
import { PAYMENT_OPTIONS } from "../Constants/FormConstants";
import { useQueryClient } from "@tanstack/react-query";
import { CircleDotDashed } from 'lucide-react';





// ================= Reusable Components =================
const BookingDetail = React.memo(({ label, value }) => (
  <p className="text-gray-700 ">
    <span className="font-semibold text-gray-900 ">{label} :</span>{" "}
    <span className={`${value === 'Pending' && 'p-[2px] px-3 rounded-full italic text-sm bg-green-300 text-green-800'}`}>{value || "-"}</span>
  </p>
));

const PaymentOptionCard = React.memo(({ option, isSelected, onSelect }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => onSelect(option.name)}
    className={`cursor-pointer bg-white p-4 rounded-xl shadow-md flex flex-col items-center border-2 transition-all duration-300
      ${isSelected ? "border-green-500 shadow-xl bg-green-50" : "border-gray-200 hover:border-green-300"}
    `}
  >
    <img
      src={option.img}
      alt={option.name}
      className="w-20 h-10 object-contain mb-3"
    />
    <h4 className="text-lg font-semibold text-gray-800">{option.name}</h4>
    <p className="text-gray-500 text-sm text-center mt-2">{option.details}</p>
  </motion.div>
));

const BookingSummary = ({ booking }) => {



  const formattedDate = useMemo(() => {

    if (!booking?.date) return "-";
    const dateObj = new Date(booking.date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "long",
    });

  }, [booking?.date]);




  return (
    <Card title="📌 Booking Summary" highlight>
      <div className="flex justify-between items-center mb-4">
        <p className="text-3xl font-bold text-green-600">
          ₹ {booking.price}
        </p>
        <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full">
          Pending Payment
        </span>
      </div>
      <BookingDetail label="📅 Date" value={formattedDate} />
      <BookingDetail label="🕒 Duration" value={`${booking.duration} min`} />
      <BookingDetail label="⌛ Start Time" value={`${booking.startTime}`} />
      <BookingDetail label="⌛ End Time" value={`${booking.endTime}`} />
      <BookingDetail label={`Booking Status`} value={`${booking.bookingStatus}`} />
      <BookingDetail label="Address" value={`${booking.address}`} />
    </Card>
  );
};

const CustomerDetails = ({ booking }) => (
  <Card title="👤 Customer Details" highlight>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 w-full">
      <BookingDetail label="Name" value={booking.name} />
      <BookingDetail label="Phone" value={booking.phone} />
      <BookingDetail label="Email" value={booking.email} />

    </div>
  </Card>
);

// ================= Main Component =================
const PaymentMethod = () => {

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { bookingId, day, timeSlotId, slotId } = useParams();

  const { data, isLoading } = useCurrentBooking(bookingId);

  const { isPending, mutateAsync } = useApiMutation("POST");

  const [selectedMethod, setSelectedMethod] = useState(null);

  const currentBooking = data?.currentBooking || null;

  const handlePayment = useCallback(async () => {
    if (!selectedMethod) return;
    try {
      const response = await mutateAsync({
        url: `/booking-payment/payment-confirm/${bookingId}/${day}/${slotId}/${timeSlotId}`,
        data: { selectedMethod },
      });

      queryClient.invalidateQueries(["timeSlots"]);
      if (response.status) navigate("/");
    } catch (err) {
      console.error("Payment failed:", err);
    }
  }, [bookingId, day, timeSlotId, slotId, selectedMethod, mutateAsync, navigate, queryClient]);



  if (isLoading || isPending) return <LoadingEffect />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-green-50 to-white min-h-screen">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold mb-8 text-green-700 text-center drop-shadow-sm"
      >
        💳 Secure Payment Checkout
      </motion.h2>

      {/* Booking Info */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {currentBooking && (
          <>
            <BookingSummary booking={currentBooking} />
            <CustomerDetails booking={currentBooking} />
          </>
        )}
      </div>

      {/* Payment Options */}
      <h3 className="text-xl font-semibold mb-4 text-green-800">
        💰 Select a Payment Option
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {PAYMENT_OPTIONS.map((option) => (
          <PaymentOptionCard
            key={option.name}
            option={option}
            isSelected={selectedMethod === option.name}
            onSelect={setSelectedMethod}
          />
        ))}
      </div>

      {/* Confirm Button */}
      <div className="flex justify-center">
        <Button
          label=" Payment Confirm"
          onClick={handlePayment}
          disabled={!selectedMethod || isPending}
          className="mt-4 w-full md:w-1/1 text-lg font-bold cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md py-2 transition"
        />
      </div>
    </div>
  );
};

export default PaymentMethod;
