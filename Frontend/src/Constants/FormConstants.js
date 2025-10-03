export const formFieldDefinitions = {
  login: [
    { name: "email", label: "Email Address", type: "text", required: true },
    { name: "password", label: "Password", type: "password", required: true },
  ],

  register: [
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "text", required: true },
    { name: "phone", label: "Phone Number", type: "text", required: true },
    { name: "address", label: "Address", type: "text", required: true },
    { name: "password", label: "Password", type: "password", required: true },
  ],

  booking: [
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "phone", label: "Phone Number", type: "text", required: true },
    { name: "email", label: "Email Address", type: "text", required: true },
    { name: "address", label: "Address", type: "text", required: false },
    { name: "date", label: "Booking Date", type: "date", required: true },
    { name: "day", label: "Booking Day", type: "text", required: true },
    { name: "startTime", label: "Start Time", type: "time", required: true },
    { name: "endTime", label: "End Time", type: "time", required: true },
    { name: "price", label: "Price", type: "number", required: true },
  ],

  contact: [
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "phone", label: "Phone Number", type: "text", required: true },
    { name: "email", label: "Email Address", type: "text", required: true },
    { name: "address", label: "Address", type: "text", required: false },
    { name: "message", label: "Message", type: "textarea", required: false },
  ],



  addTimeSlots: [
    { name: "startTime", label: "Start Time", type: "time" },
    { name: "endTime", label: "End Time", type: "time" },
    { name: "price", label: "Price", type: "number" },
  ],


  adminSettings: [
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "text", required: true },
    { name: "phone", label: "Phone Number", type: "text", required: true },
    { name: "role", label: "Role", type: "select", required: true },
   
  ],

  adminPassword: [
    { name: "email", label: "Email Address", type: "text", required: true },
    { name: "password", label: "Old Password", type: "password", required: true },
    { name: "newPassword", label: "New Password", type: "password", required: false },
    { name: "confirmPassword", label: "Confirm Password", type: "password", required: false },
  ],




};


export const filteringBy = [
  { label: "Search By Customer Name", name: "name", type: "text" },
  { label: "Search By Booking Date", name: "date", type: "date" },
  { label: "Search By Phone Number", name: "phone", type: "number" },
];

export const DROP_DOWN_OPTIONS = {
  PACKAGE_LIST: ["Hourly Packages", "Weekly Packages", "Monthly Packages", "Yearly Packages"],
  DAY_LIST: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  TIME_TYPES: [
    "Morning Play", "Midday Match", "Afternoon Play", "After Lunch Game",
    "Power Play Hour", "Evening Warmup", "Evening Game", "Prime Time Match"
  ],
};

// ===== Animations =====
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: -50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
  exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.25 } },
};

export const PAYMENT_OPTIONS = [
  { name: "eSewa", details: "Pay instantly using your eSewa wallet.", img: "/esewa.png" },
  { name: "Khalti", details: "Quick and secure payment via Khalti wallet.", img: "/khalti.png" },
  { name: "IME Pay", details: "Fast transfer through IME Pay services.", img: "/imepay.png" },
  { name: "Cash on Arrival", details: "Pay directly when you arrive at the ground.", img: "https://cdn-icons-png.flaticon.com/512/1041/1041881.png" },
];
