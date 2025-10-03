import React, { memo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Users, Mail, Phone } from "lucide-react";
import { useApiQuery } from "../../CustomsHooks/useApiQuery";





const BookingDetails = () => {

  
  const { data: bookings, isLoading } = useApiQuery({
    queryKey: "authBooking",
    url: "/Booking/user-booking-details",
    params: {},
    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!bookings?.status) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500">{bookings?.message || "No bookings found."}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center md:text-left">
        My Futsal Bookings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bookings?.bookings?.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>
    </div>
  );
};


export default BookingDetails;


const DetailItem = React.memo(({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 text-sm text-gray-700">
    {Icon && <Icon size={18} />}
    <span>
      {label && <strong>{label}: </strong>}
      {value || "-"}
    </span>
  </div>
));


const BookingCard = memo(({ booking }) => {
  const statusClasses = {
    Confirmed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all p-5 flex flex-col justify-between"
      aria-label={`Booking for ${booking.name}`}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{booking.name}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[booking.bookingStatus] || "bg-gray-100 text-gray-700"}`}>
          {booking.bookingStatus}
        </span>
      </header>

      {/* Booking Details */}
      <section className="space-y-2 flex-grow">
        <DetailItem icon={Mail} value={booking.email} />
        <DetailItem icon={Phone} value={booking.phone} />
        <DetailItem
          icon={CalendarDays}
          value={new Date(booking.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
        />
        <DetailItem icon={Clock} value={`${booking.startTime} - ${booking.endTime}`} />
        <DetailItem icon={Users} value={`${booking.players} players`} />
      </section>

      {/* Footer */}
      <footer className="mt-4 pt-4 border-t border-gray-300 flex flex-col gap-2 text-sm font-semibold text-gray-800">
        <DetailItem value={`💰 Amount: NPR ${booking?.price}`} />
        <DetailItem value={`🧾 Payment Status: ${booking.paymentStatus}`} />
      </footer>
    </motion.article>
  );
});

