"use client";

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "highlight" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

export function Card({
  children,
  className,
  variant = "default",
  padding = "md",
  onClick,
}: CardProps) {
  const variants = {
    default: "bg-white shadow-md",
    highlight:
      "bg-gradient-to-br from-blue-50 to-green-50 shadow-lg border-2 border-blue-100",
    outlined: "border-2 border-gray-200 bg-white",
  };

  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl",
        variants[variant],
        paddings[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-lg font-bold text-gray-900", className)}>
      {children}
    </h3>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("text-gray-600", className)}>{children}</div>;
}
