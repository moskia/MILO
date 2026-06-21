// Small Tailwind UI primitives shared across the popup.
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500",
    ghost: "text-zinc-600 hover:bg-zinc-100",
    danger: "text-red-600 hover:bg-red-50",
  };
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
      {children}
    </span>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-zinc-600">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition ${checked ? "bg-indigo-600" : "bg-zinc-300"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}
