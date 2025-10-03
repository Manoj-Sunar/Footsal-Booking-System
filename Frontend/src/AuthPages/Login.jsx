"use client";
import { memo, useState, useCallback } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import Button from "../CommonComponents/Button";
import LoadingEffect from "../CommonComponents/LoadingEffect";
import AuthWrapper from "../CommonComponents/AuthWrapper";
import LabelInput from "../CommonComponents/InputField";
import AuthRedirectMessage from "../CommonComponents/AuthRedirectMessage";
import { useFormHandler } from "../CustomsHooks/useFormHandler";
import { useApiMutation } from "../CustomsHooks/useApiMutation";
import ErrorMessage from "../CommonComponents/ErrorMessage";
import { useQueryClient } from "@tanstack/react-query";


const Login = () => {

  const { formData, handleChange, fields } = useFormHandler("login");

  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useApiMutation("POST");

  const Navigation = useNavigate();

  const [errors, setErrors] = useState({});




  const handleLogin = useCallback(async (e) => {

    e.preventDefault();

    setErrors({});

    try {

      const response = await mutateAsync({
        url: '/auth/customer-login',
        data: formData,
      });



      if (response?.status === false && response?.errors) {

        setErrors(response.errors); // always an object now

      } else {

        localStorage.setItem('token', response?.token);
        queryClient.invalidateQueries(['Auth']);

        if (!response?.isUserExist?.isAdmin) {
          Navigation("/");

        } else {
          Navigation("/admin");

        }


      }

    } catch (error) {
      setErrors({ general: "Something went wrong. Please try again." });
    }



  }, [formData, mutateAsync, queryClient]);



 

  return (
    <AuthWrapper title="Welcome Back 👋">
      <form onSubmit={handleLogin} className="space-y-5">
        {
          fields?.map(({ type, name, label }, index) => <div key={index}>
            <LabelInput

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



        <div className="text-right">
          <Link to="/forgot-password" className="text-green-600 hover:underline text-sm">
            Forgot Password?
          </Link>
        </div>

        {errors.general && <ErrorMessage message={errors.general} />}
        <Button type="submit" label="Login" className="w-full cursor-pointer bg-green-500 text-white hover:bg-green-600" Loading={isPending}/>
      </form>

      <AuthRedirectMessage
        message="Don't have an account?"
        linkText="Register here"
        linkTo="/register"
      />
    </AuthWrapper>
  );
};

export default memo(Login);
