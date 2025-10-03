
import { useApiQuery } from "./useApiQuery";



export const useTimeSlots = () =>
    useApiQuery({
        queryKey: "timeSlots", // unique key for caching
        url: "/hourly/all-time-slots", // your backend endpoint
        params: {},
        enabled: true, // load immediately
    });





// Custom hook for fetching bookings safely
export const useBookingDetails = (queryKey = []) => {
    // ✅ Destructure safely with defaults
    const [_key = "booking", queryParams = {}] = queryKey;
    const { filters = {}, page = 1 } = queryParams;

    // ✅ Ensure queryKey is always stable and params are plain object
    return useApiQuery({
        queryKey: [_key, filters, page],
        url: `/booking/admin-booking`,
        params: { ...filters, page, limit: 10 },
    });
};








export const useCurrentBooking = (bookingId) => useApiQuery({
    queryKey: ["Booking", bookingId],
    url: `/booking/booking-auth-bookingId/${bookingId}`,
    enabled: true,
});





export const useAllCustomers = ({ filters = {}, page = 1 } = {}) => {
    return useApiQuery({
        // stable/react-query-friendly queryKey
        queryKey: ["allCustomers", filters, page],
        url: `/auth/all-customers`,
        params: { ...filters, page, limit: 10 },

        // optional niceties
        keepPreviousData: true,
        staleTime: 1000 * 30,
    });
};



export const useAllNotification = () => useApiQuery({
    queryKey: 'allNotifications',
    url: "/booking/admin/get-all-notification",
    enabled: true,
});