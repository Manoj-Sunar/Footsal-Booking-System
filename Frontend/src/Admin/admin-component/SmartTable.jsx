"use client";
import { motion } from "framer-motion";
import React, { memo } from "react";

const STATUS_STYLES = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const SmartTable = memo(({ columns = [], data = [], showActions = false, extraActions }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="p-3 text-left">{col.header}</th>
            ))}
            {showActions && <th className="p-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <motion.tr
              key={row._id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="border-b border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              {columns.map((col) => {
                const cellValue = col.render ? col.render(row[col.key], row) : row[col.key];

                // ✅ Special styling for bookingStatus (or any status field)
                if (col.key === "bookingStatus" && STATUS_STYLES[cellValue]) {
                  return (
                    <td key={col.key} className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[cellValue]}`}>
                        {cellValue}
                      </span>
                    </td>
                  );
                }

                return <td key={col.key} className="p-3">{cellValue}</td>;
              })}
              {showActions && <td className="p-3">{extraActions ? extraActions(row) : "-"}</td>}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

SmartTable.displayName = "SmartTable";
export default SmartTable;
