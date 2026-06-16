import { ButtonHTMLAttributes } from "react";
import { cn } from "@shared/lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export const Button = ({ className, variant = "primary", ...props }: Props) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold tracking-wide transition-all select-none cursor-pointer duration-200",
        variant === "primary" && "bg-lime-brand text-primary-foreground hover:bg-lime-brand/95 shadow-sm shadow-lime-brand/10 hover:shadow-md hover:-translate-y-0.5",
        variant === "ghost" && "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
        className
      )}
      {...props}
    />
  );
}