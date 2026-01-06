import React from "react";
import { cn } from "../../../utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10",
      secondary: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10",
      ghost: "hover:bg-white/5 text-white",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full",
          variants[variant],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
