"use client";
import { memo, useCallback, useState } from "react";
import Button from "../CommonComponents/Button";
import AuthWrapper from "../CommonComponents/AuthWrapper";
import LabelInput from "../CommonComponents/InputField";
import AuthRedirectMessage from "../CommonComponents/AuthRedirectMessage";
import { useFormHandler } from "../CustomsHooks/useFormHandler";
import PhoneInputNepal from "../CommonComponents/PhoneInputNepal";
import { useApiMutation } from "../CustomsHooks/useApiMutation";
import LoadingEffect from "../CommonComponents/LoadingEffect";
import ErrorMessage from "../CommonComponents/ErrorMessage";
import { useNavigate } from "react-router-dom";

const Register = () => {

  const Navigation = useNavigate();

  const { formData, handleChange, fields } = useFormHandler("register");

  const { isPending, mutateAsync } = useApiMutation("POST");

  const [errors, setErrors] = useState({});


  const handleRegister = useCallback(async (e) => {

    e.preventDefault();
    setErrors({});

    try {
      const response = await mutateAsync({
        url: "/auth/customer-register",
        data: formData,
      });

      if (response?.status === false && response?.errors) {

        setErrors(response.errors); // always an object now

      } else {

        Navigation("/login");
      }



    } catch (error) {

      setErrors({ general: "Something went wrong. Please try again." });
    }
  }, [formData, mutateAsync]);





  return (
    <AuthWrapper title="Create an Account 📝">
      <form onSubmit={handleRegister} className="space-y-3">
        {fields.map(({ type, name, label }, index) => (
          <div key={index} className="space-y-2">
            {name !== "phone" && (
              <>
                <LabelInput
                  type={type}
                  label={label}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  error={!!errors[name]}
                />
                {errors[name] && <ErrorMessage message={errors[name]} />}
              </>
            )}

            {name === "address" && (
              <>
                <PhoneInputNepal
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                />
                {errors.phone && <ErrorMessage message={errors.phone} />}
              </>
            )}
          </div>
        ))}

        {errors.general && <ErrorMessage message={errors.general} />}

        <Button type="submit" label="Register" className="w-full cursor-pointer bg-green-500 text-white" Loading={isPending} />
      </form>

      <AuthRedirectMessage
        message="Already have an account?"
        linkText="Login here"
        linkTo="/login"
      />
    </AuthWrapper>
  );
};

export default memo(Register);
