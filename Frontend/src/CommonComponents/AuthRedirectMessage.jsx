"use client";
import { memo } from "react";
import { Link } from "react-router-dom";

const AuthRedirectMessage = ({ message, linkText, linkTo }) => {
  return (
    <p className="text-center text-gray-600 mt-6 text-sm">
      {message}{" "}
      <Link to={linkTo} className="text-green-600 font-semibold hover:underline">
        {linkText}
      </Link>
    </p>
  );
};

export default memo(AuthRedirectMessage);
