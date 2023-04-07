"use client";

import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

import axiosInstance from "@/app/libs/axiosInstance";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { USER_REGISTER_ENDPOINT } from "@/app/utils/constants";
import Modal from "./Modal";
import Heading from "../typography/Heading";
import Input from "../form/Input";
import Button from "../form/Button";
import useLoginModal from "@/app/hooks/useLoginModal";

function RegisterModal() {
  const [isLoading, setisLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async (data, event) => {
      event?.preventDefault();
      try {
        setisLoading(true);
        await axiosInstance.post(USER_REGISTER_ENDPOINT, data);
        registerModal.onClose();
        reset();
      } catch (error) {
        toast.error("Something went wrong.");
      } finally {
        setisLoading(false);
      }
    },
    [registerModal, reset]
  );

  const toggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [loginModal, registerModal]);

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

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn("github")}
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="flex flex-row items-center justify-center gap-2">
          <div>Already have an account?</div>
          <div
            onClick={toggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Log in
          </div>
        </div>
      </div>
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
      footer={footerContent}
    />
  );
}

export default RegisterModal;
