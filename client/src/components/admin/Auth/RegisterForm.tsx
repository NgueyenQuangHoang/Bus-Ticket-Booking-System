import { useState } from "react";
import { useForm } from "react-hook-form";
import { Notification, type NotificationType } from "../../ui/Admin/Notification";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterType } from "../Schemas/auth";
import { Input } from "../../ui/Admin/Input";
import { Button } from "../../ui/Admin/Button";

interface RegisterFormProps {
  onToggle: () => void;
}

export const RegisterForm = ({ onToggle }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
  });

  const [notification, setNotification] = useState<{
    isVisible: boolean;
    message: string;
    type: NotificationType;
  }>({
    isVisible: false,
    message: "",
    type: "info",
  });

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  const onSubmit = async (data: RegisterType) => {
    console.log("Register Data:", data);
    // TODO: Integrate API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Show success notification
    setNotification({
      isVisible: true,
      message: "Registration successful! Redirecting to login...",
      type: "success",
    });

    // Wait for 2 seconds before redirecting
    setTimeout(() => {
      onToggle();
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full justify-center px-8 py-10">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-white/60">Join us and start your journey.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Input
          label="Email"
          placeholder="Enter your email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          placeholder="Create a password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" isLoading={isSubmitting} className="mt-4">
          Sign Up
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-white/60">
        Already have an account?{" "}
        <button
          onClick={onToggle}
          className="text-white font-semibold hover:underline focus:outline-none"
        >
          Sign in
        </button>
      </div>

      <Notification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
    </div>
  );
};
