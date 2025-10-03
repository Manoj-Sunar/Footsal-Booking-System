import { parsePhoneNumberFromString } from 'libphonenumber-js';


export function isValidNepalNumber(number) {
  const phoneNumber = parsePhoneNumberFromString(number, 'NP');
  return phoneNumber?.isValid();
}

// Helper to parse time string "HH:mm" into minutes from midnight
export function parseTimeToMinutes(time) {
  if (!time || typeof time !== "string") return NaN;

  // Match "HH:mm" or "hh:mm AM/PM"
  const match = time.match(/(\d{1,2}):(\d{2})\s?(AM|PM)?/i);
  if (!match) return NaN;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridian = match[3];

  if (isNaN(hours) || isNaN(minutes)) return NaN;

  if (meridian) {
    if (meridian.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }
    if (meridian.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }
  }

  return hours * 60 + minutes;
}






// Format date as "Month DD, YYYY"
export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


// utils/time.js
export const formatTimeTo12Hour = (time24) => {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
};

export const calculateDuration = (start, end) => {
  const [sH, sM] = start.split(":").map(Number);
  const [eH, eM] = end.split(":").map(Number);
  const startDate = new Date(2000, 0, 1, sH, sM);
  const endDate   = new Date(2000, 0, 1, eH, eM);
  let diff = (endDate - startDate) / 60000;
  if (diff < 0) diff += 24 * 60;
  const hours = Math.floor(diff / 60);
  const mins  = diff % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const toMinutes24 = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

export const toFullDateKey = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// Accept either fullDate (preferred) or { year, month, date }
export const coerceToDate = ({ fullDate, year, month, date }) => {
  if (fullDate) {
    const d = new Date(fullDate);
    if (Number.isNaN(d.getTime())) throw new Error("Invalid fullDate");
    return d;
  }
  if (!year || (!month && month !== 0) || !date) throw new Error("Missing date parts");
  // month can be name ("September") or number (1-12 or 0-11)
  let monthIndex;
  if (typeof month === "number") {
    monthIndex = (month >= 1 && month <= 12) ? month - 1 : month;
  } else {
    monthIndex = new Date(`${month} 1, ${year}`).getMonth();
  }
  const d = new Date(Number(year), monthIndex, Number(date));
  if (Number.isNaN(d.getTime())) throw new Error("Invalid Y/M/D");
  return d;
};

