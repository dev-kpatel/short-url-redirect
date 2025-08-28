import { ButtonHTMLAttributes } from "react";
import { cn } from "@shared/lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export const Button = ({ className, variant = "primary", ...props }: Props) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium",
        variant === "primary" && "bg-indigo-600 text-white hover:bg-indigo-700",
        variant === "ghost" && "bg-transparent text-gray-700 hover:bg-gray-100",
        className
      )}
      {...props}
    />
  );
}