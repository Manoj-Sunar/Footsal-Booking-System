import React, { memo, useCallback } from "react";

const FilteringComponent = memo(({ filtersConfig, filterBy, setValue }) => {
  const handleFilter = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValue((prev) => ({ ...prev, [name]: value }));
    },
    [setValue]
  );

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <p className="text-2xl font-bold text-gray-700">Search Bookings</p>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
        {filtersConfig.map((item) => (
          <div key={item.name} className="flex flex-col w-full md:w-auto">
            <label className="text-sm text-gray-600 mb-1">{item.label}</label>
            <input
              type={item.type}
              name={item.name}
              value={filterBy[item.name] || ""}
              onChange={handleFilter}
              placeholder={item.label}
              className="w-full px-4 py-2 border border-gray-400 rounded-lg shadow-sm
                focus:outline-none focus:ring-2 focus:ring-green-400
                focus:border-green-500 transition-all duration-200
                placeholder-gray-400 text-gray-700"
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export default FilteringComponent;
