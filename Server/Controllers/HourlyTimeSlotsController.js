// controllers/timeSlots.js
import TimeSlotsModal from "../Models/TimeSlotsModal.js";
import User from "../Models/NewCustomerModel.js";
import {
  formatTimeTo12Hour,
  calculateDuration,
  toMinutes24,
  toFullDateKey,
  coerceToDate,
} from "../UtilityFunctions/HelperFunctions.js"



export const CreateTimeSlots = async (req, res) => {
  try {
    const { startTime, endTime, price, } = req.body;
    const { userId } = req.user;
    console.log(req.body);

    if (!userId) return res.status(401).json({ status: false, message: "You need to login" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ status: false, message: "User not found" });
    if (!user.isAdmin) return res.status(403).json({ status: false, message: "Only admins can create time slots" });

    if (!startTime || !endTime || price == null)
      return res.status(400).json({ status: false, message: "Missing required fields" });

    // ✅ Resolve the exact calendar date from the payload
    // Prefer req.body.fullDate = "YYYY-MM-DD".
    // Backward compatible: { year, month, date } where "date" is day-of-month (1..31).
    let dateObj;
    try {
      dateObj = coerceToDate({
        fullDate: req.body.fullDate,
        year: req.body.year,
        month: req.body.month,

      });
    } catch (e) {
      return res.status(400).json({ status: false, message: e.message });
    }

    const fullDate = toFullDateKey(dateObj);
    const yearStr = String(dateObj.getFullYear());
    const monthName = dateObj.toLocaleString("default", { month: "long" });
    const weekday = dateObj.toLocaleString("default", { weekday: "long" });

    // ✅ Time sanity + convert to display format
    const startMin = toMinutes24(startTime);
    const endMin = toMinutes24(endTime);
    if (endMin <= startMin) {
      return res.status(400).json({ status: false, message: "End time must be after start time" });
    }

    const formattedStart = formatTimeTo12Hour(startTime);
    const formattedEnd = formatTimeTo12Hour(endTime);
    const duration = calculateDuration(startTime, endTime);

    // ✅ Find/Upsert document for this exact date
    let slotDoc = await TimeSlotsModal.findOne({ fullDate });

    if (!slotDoc) {
      slotDoc = new TimeSlotsModal({
        fullDate,
        year: yearStr,
        month: monthName,
        day: weekday,
        times: [{ startTime: formattedStart, endTime: formattedEnd, duration, price: Number(price) }],
      });
    } else {
      // prevent duplicate time range
      const duplicate = slotDoc.times.some(t => t.startTime === formattedStart && t.endTime === formattedEnd);
      if (duplicate) {
        return res.status(400).json({ status: false, message: "This time slot already exists for this date" });
      }

      // prevent overlaps
      const toMin12h = (time) => {
        const [raw, period] = time.split(" ");
        let [h, m] = raw.split(":").map(Number);
        if (period === "PM" && h !== 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        return h * 60 + m;
      };

      const overlap = slotDoc.times.some(t => {
        const s = toMin12h(t.startTime);
        const e = toMin12h(t.endTime);
        return startMin < e && endMin > s;
      });

      if (overlap) {
        return res.status(400).json({ status: false, message: "Time slot overlaps with an existing slot on this date" });
      }

      slotDoc.times.push({ startTime: formattedStart, endTime: formattedEnd, duration, price: Number(price) });
    }

    await slotDoc.save();
    return res.status(201).json({ status: true, message: "Time slot created successfully", data: slotDoc });
  } catch (error) {
    console.error("CreateTimeSlots error:", error);
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};






export const GetAllTimeSlotsPublic = async (req, res) => {
  try {
    const slots = await TimeSlotsModal.find({})
      .sort({ fullDate: 1, "times.startTime": 1 })
      .lean();

    const formattedSlots = slots.map((slot) => ({
      _id: slot._id,
      fullDate: slot.fullDate,   // ✅ return fullDate
      year: slot.year,
      month: slot.month,
      day: slot.day,
      times: slot.times.map((t) => ({
        _id: t._id,
        startTime: t.startTime,
        endTime: t.endTime,
        duration: t.duration,
        isBooked: t.isBooked,
        price: t.price,
      })),
    }));

    return res.status(200).json({
      status: true,
      message: "All time slots fetched successfully",
      data: formattedSlots,
    });
  } catch (error) {
    console.error("GetAllTimeSlotsPublic error:", error);
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};
