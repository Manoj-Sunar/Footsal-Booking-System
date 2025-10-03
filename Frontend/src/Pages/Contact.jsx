"use client";
import { memo } from "react";
import InputField from "../CommonComponents/InputField";
import Button from "../CommonComponents/Button";
import FormWrapper from "../CommonComponents/FormWrapper";
import { useFormHandler } from "../CustomsHooks/useFormHandler";
import { motion } from "framer-motion";
import PhoneInputNepal from "../CommonComponents/PhoneInputNepal";

const Contact = () => {
  const { formData, handleChange, fields } = useFormHandler('contact');

  const handleSubmit = () => {

    
    console.log(formData);

  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen px-6 md:px-16 py-12 flex flex-col lg:flex-row gap-10 items-center">

      {/* ✅ Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2"
      >
        <FormWrapper title="📩 Get in Touch With Us">
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            We'd love to hear from you! Fill out the form below and we'll get back to you shortly.
          </p>
          <div className="space-y-3">
            {
              fields?.map(({ type, name, label }, index) => <div key={index} className="space-y-3">
                {
                  name !== 'phone' && <InputField

                    name={name}
                    type={type === 'date' ? "date" : type === 'time' ? "time" : "text"}
                    placeholder={type==='textarea'?'':label.replace(/([A-Z])/g, " $1")}
                    value={formData[name]}
                    onChange={handleChange}
                    label={label.charAt(0).toUpperCase() + label.slice(1)}
                    textarea={type==='textarea'}
                  />
                }

                {
                  name === 'name' && <PhoneInputNepal value={formData.phone}
                    onChange={handleChange} />
                }

              </div>)
            }
       
            <Button type="submit" label="📤 Send Message" onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300" />
          </div>
        </FormWrapper>
      </motion.div>

      {/* ✅ Map Section */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 bg-white shadow-lg rounded-xl p-4 border border-green-100"
      >
        <h3 className="text-lg font-semibold text-green-700 mb-3">📍 Our Location</h3>
        <p className="text-gray-500 mb-4 text-sm md:text-base">Find us easily on the map below:</p>
        <div className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
          <iframe
            title="Pokhara Lakeside Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.414877424062!2d83.95866187544669!3d28.20960177587783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399595e50f77e7cd%3A0xf66d7f9c29b28b60!2sLakeside%2C%20Pokhara%2033700%2C%20Nepal!5e0!3m2!1sen!2snp!4v1691243510023!5m2!1sen!2snp"
            width="100%"
            height="300"
            allowFullScreen=""
            loading="lazy"
            className="border-0"
          ></iframe>
        </div>
        <div className="mt-4 text-gray-600 text-sm">
          <p>📌 Lakeside, Pokhara 33700, Nepal</p>
          <p>📞 +977 9800000000</p>
          <p>📧 support@futsalbooking.com</p>
        </div>
      </motion.div>

    </div>
  );
};

export default memo(Contact);
