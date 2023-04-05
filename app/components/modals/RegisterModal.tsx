"use client";

import { useState, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";

import axiosInstance from "@/lib/axiosInstance";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { USER_REGISTER_ENDPOINT } from "@/app/utils/constants";
import Modal from "./Modal";
import Heading from "../typography/Heading";
import Input from "../form/Input";

function RegisterModal() {
  const [isLoading, setisLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const registerModal = useRegisterModal();

  const onSubmit: SubmitHandler<FieldValues> = async (data, event) => {
    event?.preventDefault();
    try {
      setisLoading(true);
      await axiosInstance.post(USER_REGISTER_ENDPOINT, data);
      registerModal.onClose();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setisLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to Airbnb" subtitle="Create an account!" />
      <Input
        id="email"
        label="Email"
        type="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="name"
        label="Name"
        type="text"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      body={bodyContent}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}

export default RegisterModal;
