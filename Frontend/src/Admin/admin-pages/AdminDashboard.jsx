"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Users, CalendarCheck2, IndianRupee } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  AreaChart, Area, Tooltip, XAxis, YAxis, CartesianGrid
} from "recharts";
import { useAllCustomers, useBookingDetails } from "../../CustomsHooks/QueryAPICalls";
import SmartTable from "../admin-component/SmartTable";

const COLOR_MAP = {
  blue: { bg: "bg-blue-100", text: "text-blue-600", strong: "text-blue-700" },
  green: { bg: "bg-green-100", text: "text-green-600", strong: "text-green-700" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600", strong: "text-yellow-700" },
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = COLOR_MAP[color];
  return (
    <motion.div className="flex flex-col items-center justify-center p-6 rounded-2xl shadow-md bg-white hover:shadow-xl transition-all">
      <div className={`p-3 rounded-full ${colors.bg} mb-3`}>
        <Icon className={`w-8 h-8 ${colors.text}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{label}</h3>
      <p className={`text-3xl font-bold ${colors.strong} mt-1`}>{value}</p>
    </motion.div>
  );
};

const ChartCard = ({ title, chart }) => (
  <motion.div className="bg-white p-6 rounded-2xl shadow-md">
    <h2 className="text-2xl font-semibold text-gray-700 mb-4">{title}</h2>
    <ResponsiveContainer width="100%" height={280}>{chart}</ResponsiveContainer>
  </motion.div>
);

const AdminDashboard = () => {
  const { data, isLoading } = useBookingDetails(["booking", {}]);
  const bookings = data?.data || [];

  const { data: allCustomers } = useAllCustomers({});
  console.log(allCustomers);


  // unique years/months for filter
  const { availableYears, availableMonths } = useMemo(() => {
    const years = new Set(), months = new Set();
    bookings.forEach((b) => {
      const d = new Date(b.date);
      years.add(d.getFullYear().toString());
      months.add(d.toLocaleString("default", { month: "short" }));
    });
    return { availableYears: [...years], availableMonths: [...months] };
  }, [bookings]);


  const [selectedYear, setSelectedYear] = useState(availableYears[0] || new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState("All");

  // stats
  const stats = useMemo(() => {
    const totalCustomers = new Set(bookings.map((b) => b.user?.id || b.name)).size;
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
    return { totalCustomers, totalBookings, totalRevenue };
  }, [bookings]);

  // chart data
  const chartData = useMemo(() => {
    const grouped = {};
    bookings.forEach((b) => {
      const d = new Date(b.date);
      const year = d.getFullYear().toString();
      const month = d.toLocaleString("default", { month: "short" });
      if (!grouped[`${year}-${month}`]) {
        grouped[`${year}-${month}`] = { year, month, customers: 0, bookings: 0, revenue: 0 };
      }
      grouped[`${year}-${month}`].bookings++;
      grouped[`${year}-${month}`].revenue += b.price || 0;
      grouped[`${year}-${month}`].customers++;
    });
    return Object.values(grouped).filter(
      (item) => item.year === selectedYear && (selectedMonth === "All" || item.month === selectedMonth)
    );
  }, [bookings, selectedYear, selectedMonth]);

  // universal table columns
  const columns = [
    { key: "user", header: "User", render: (_, row) => row.user?.name || row.name },
    { key: "phone", header: "Phone" },
    { key: "date", header: "Date", render: (v, row) => new Date(row.date).toLocaleDateString() },
    { key: "day", header: "Day" },
    { key: "time", header: "Time", render: (_, row) => `${row.startTime} - ${row.endTime}` },
    { key: "price", header: "Price", render: (v) => `₹ ${v}` },
    { key: "bookingStatus", header: "Status" },
  ];

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-3 md:p-5 min-h-screen">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">🏆 Admin Dashboard</h1>

      {/* Filters */}
      <div className="flex gap-3 justify-end mb-6">
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border rounded-lg px-3 py-2">
          {availableYears.map((y) => <option key={y}>{y}</option>)}
        </select>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border rounded-lg px-3 py-2">
          <option value="All">All Months</option>
          {availableMonths.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard icon={Users} label="Total Customers" value={allCustomers?.pagination?.total} color="blue" />
        <StatCard icon={Users} label="Total Booking Customers" value={stats.totalCustomers} color="green" />
        <StatCard icon={CalendarCheck2} label="Total Bookings" value={stats.totalBookings} color="green" />
        <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${stats.totalRevenue}`} color="yellow" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <ChartCard title="👥 Customers Growth" chart={<LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line dataKey="customers" stroke="#2563eb" /></LineChart>} />
        <ChartCard title="📅 Bookings Trend" chart={<BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="bookings" fill="#16a34a" radius={[8, 8, 0, 0]} /></BarChart>} />
        <ChartCard title="💰 Revenue Growth" chart={<AreaChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area dataKey="revenue" stroke="#f59e0b" fill="#f59e0b" /></AreaChart>} />
      </div>

      {/* Recent Bookings */}
      <motion.div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">📝 Recent Bookings</h2>
        <SmartTable columns={columns} data={bookings.slice(0, 5)} />
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
