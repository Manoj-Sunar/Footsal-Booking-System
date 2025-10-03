"use client";
import { memo, useState } from "react";

const InputField = memo(
  ({
    label,
    name,
    type = "text",
    value = "",
    placeholder = "",
    error,
    textarea = false,
    min,
    ...props
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    const commonClass = `peer w-full p-3 pt-2 border rounded-md focus:ring outline-none transition-all duration-200 
      ${error ? "border-red-500 focus:ring-red-300 focus:border-red-500" : "border-gray-300 focus:ring-green-300 focus:border-green-500"}
    `;

    return (
      <div className="relative w-full">
        {textarea ? (
          <textarea
            id={name}
            name={name}
            value={value}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(value !== "")}
            className={`${commonClass} resize-none h-28`}
            {...props}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            min={min}
            placeholder={type === "text" ? "" : placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(value !== "")}
            className={`${commonClass} ${(type === "date" || type === "time") && !value
              ? "[&::-webkit-datetime-edit]:text-transparent"
              : ""
              }`}
            {...props}
          />
        )}
        <label
          htmlFor={name}
          className={`absolute left-3 transition-all duration-200 
          ${isFocused || value ? "text-xs -top-1 bg-white px-1 text-green-600" : "text-base top-3"} 
          ${error ? "text-red-500" : "text-gray-500"}`}
        >
          {label}
        </label>
      </div>
    );
  }
);

export default InputField;
