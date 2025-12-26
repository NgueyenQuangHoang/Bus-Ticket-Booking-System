import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginType } from "../Schemas/auth";
import { Input } from "../../ui/Admin/Input";
import { Button } from "../../ui/Admin/Button";

interface LoginFormProps {
  onToggle: () => void;
}

export const LoginForm = ({ onToggle }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginType) => {
    console.log("Login Data:", data);
    // TODO: Integrate API
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="flex flex-col h-full justify-center px-8 py-10">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-white/60">Please enter your details to sign in.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          placeholder="Enter your email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-white focus:ring-offset-0 focus:ring-white/30 cursor-pointer accent-white" 
            />
            <span className="text-white/80 group-hover:text-white transition-colors">Remember me</span>
          </label>
          <a href="#" className="text-white/80 hover:text-white transition-colors">
            Forgot password?
          </a>
        </div>

        <Button type="submit" isLoading={isSubmitting} className="mt-4">
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-white/60">
        Don't have an account?{" "}
        <button
          onClick={onToggle}
          className="text-white font-semibold hover:underline focus:outline-none"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};
