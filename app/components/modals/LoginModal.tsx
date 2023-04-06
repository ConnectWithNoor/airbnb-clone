"use client";

import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import Modal from "./Modal";
import Heading from "../typography/Heading";
import Input from "../form/Input";
import Button from "../form/Button";
import { useRouter } from "next/navigation";

function LoginModal() {
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
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
        const cb = await signIn("credentials", {
          ...data,
          redirect: false,
        });

        if (cb?.ok) {
          // successful login
          toast.success("Logged in");
          loginModal.onClose();
          router.refresh();
        }

        if (cb?.error) {
          toast.error(cb.error);
        }

        reset();
      } catch (error) {
        toast.error("Something went wrong.");
      } finally {
        setisLoading(false);
      }
    },
    [reset, loginModal, router]
  );

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="Login to your account!" />
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
            onClick={registerModal.onClose}
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
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      body={bodyContent}
      onSubmit={handleSubmit(onSubmit)}
      footer={footerContent}
    />
  );
}

export default LoginModal;
