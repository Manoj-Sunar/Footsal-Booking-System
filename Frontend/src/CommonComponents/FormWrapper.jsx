"use client";
import { memo } from "react";

const FormWrapper = ({ title, children, className }) => (
    <div className={`max-w-5xl w-full mx-auto p-6 bg-white shadow-lg rounded-xl space-y-5 ${className && className}`}>
        <h2 className="text-2xl font-bold text-green-700 text-center">{title}</h2>
        {children}
    </div>
);

export default memo(FormWrapper);
