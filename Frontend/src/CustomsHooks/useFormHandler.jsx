// hooks/useFormHandler.js
import { useState, useEffect, useMemo } from "react";
import { formFieldDefinitions } from "../Constants/FormConstants";

export const useFormHandler = (formType, initialValues) => {

  const fields = formFieldDefinitions[formType] || [];



  // Build default state for the given formType
  const buildState = (extraValues = {}) => {
    const state = {};
    fields.forEach((field) => {
      state[field.name] = field.defaultValue || "";
    });
    return { ...state, ...extraValues };
  };



  // ✅ Only compute once at mount or when formType changes
  const defaultState = useMemo(() => buildState(initialValues || {}), [formType]);

  const [formData, setFormData] = useState(defaultState);



  // ✅ Reset only when formType actually changes
  useEffect(() => {
    setFormData(buildState(initialValues || {}));
  }, [formType]);



  // Generic change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };




  return {
    formData,
    setFormData,
    handleChange,
    fields,
  };
};
