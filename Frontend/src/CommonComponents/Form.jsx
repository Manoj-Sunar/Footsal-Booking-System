import { DROP_DOWN_OPTIONS, formFieldDefinitions } from "../Constants/FormConstants";
import { motion, AnimatePresence } from "framer-motion";
import SelectOptionsfield from "./SelectOptionsfield";
import InputField from "./InputField";
import ErrorMessage from "./ErrorMessage";

const SPECIAL_FIELDS = {
  title: DROP_DOWN_OPTIONS.TIME_TYPES,
  day: DROP_DOWN_OPTIONS.DAY_LIST,
};

// Render a single field
const renderField = (field, value, onChange, error) => {
  if (SPECIAL_FIELDS[field.name]) {
    return (
      <SelectOptionsfield
        key={field.name}
        label={field.label}
        name={field.name}
        options={SPECIAL_FIELDS[field.name]}
        value={value}
        onChange={onChange}
        error={!!error?.[field.name]}
      />
    );
  }

  return (
    <div key={field.name}>
      <InputField
        {...field}
        value={value}
        onChange={onChange}
        textarea={field.type === "textarea"}
        error={!!error?.[field.name]}
      />
      <ErrorMessage message={error?.[field.name]} />
    </div>
  );
};





export const PackageForm = ({ formKey, formData, handleChange, error }) => {

  
  const fields = formFieldDefinitions[formKey] || [];

  return (
    <AnimatePresence>
      {fields.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden mt-4 space-y-3"
        >
          {fields
            .filter(f => f.name !== "packageType") // hide internal field
            .map(f => renderField(f, formData[f.name], handleChange, error))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
