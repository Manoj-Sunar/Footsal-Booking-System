// components/AdminSettings.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useFormHandler } from "../CustomsHooks/useFormHandler";
import { useWeareHouse } from "../WeareHouse/WeareHouseContext";
import InputField from "../CommonComponents/InputField";
import ErrorMessage from "../CommonComponents/ErrorMessage";
import Button from "../CommonComponents/Button";
import { useMemo } from "react";



const Settings = () => {
    
    const { AuthUser } = useWeareHouse();

    const authData = useMemo(() => {
        return AuthUser?.user;
    }, [AuthUser])
   

    // ✅ Use reusable form handler
    const { formData, setFormData, handleChange, fields } = useFormHandler("adminSettings", {
        name: authData?.name || "",
        email: authData?.email || "",
        phone: authData?.phone || "",
        role: authData?.isAdmin === true ? 'ADMIN' : 'CUSTOMER',

    });

    const { formData: PasswordCredentials, setFormData: setCredentials, handleChange: CredentialChange, fields: credentialField } = useFormHandler("adminPassword");

    const [errors, setErrors] = useState({});

    // ✅ Simple validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.role) newErrors.role = "Role is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Fake API call
        setTimeout(() => {
            toast.success("Settings updated successfully!");
        }, 800);
    };



    useEffect(() => {
        setFormData({
            name: authData?.name || "",
            email: authData?.email || "",
            phone: authData?.phone || "",
            role: authData?.isAdmin === true ? 'ADMIN' : 'CUSTOMER',
            password: "",
        })
    }, [authData])


    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 lg:p-10 flex justify-center"
        >
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Settings</h2>
                    <p className="text-gray-500 text-sm">
                        Update your account details and preferences
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                        {
                            fields?.map(({ type, name, label }, index) => <div key={index}>
                                <InputField

                                    type={type}
                                    label={label}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    error={!!errors[name]}
                                />
                                {errors[name] && <ErrorMessage message={errors[name]} />}
                            </div>)
                        }
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-center w-full bord">
                        <Button label={"Save Changes"} type="submit"
                            className="w-full  bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl px-6 py-2 transition-all duration-300 shadow-md disabled:opacity-50"
                        />
                    </div>
                </form>

                <form onSubmit={handleSubmit} className="space-y-6 mt-10">
                    <div className="grid  grid-cols-1 gap-2">
                        {
                            credentialField?.map(({ type, name, label }, index) => <div key={index}>
                                <InputField

                                    type={type}
                                    label={label}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    error={!!errors[name]}
                                />
                                {errors[name] && <ErrorMessage message={errors[name]} />}
                            </div>)
                        }
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-center w-full bord">
                        <Button label={"Save Changes"} type="submit"
                            className="w-full  bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl px-6 py-2 transition-all duration-300 shadow-md disabled:opacity-50"
                        />
                    </div>
                </form>

            </div>

            {/* Toast Notifications */}
            <Toaster position="top-right" />
        </motion.div>
    );
};

export default Settings;
