// components/AdminSettings.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useWeareHouse } from "../../WeareHouse/WeareHouseContext";

import { useFormHandler } from "../../CustomsHooks/useFormHandler";
import toast, { Toaster } from "react-hot-toast";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import InputField from "../../CommonComponents/InputField";
import Button from "../../CommonComponents/Button";
import Settings from "../../Components/Settings";


const AdminSettings = () => {
  return (
    <>
    <Settings/>
    </>
  )
};

export default AdminSettings;
