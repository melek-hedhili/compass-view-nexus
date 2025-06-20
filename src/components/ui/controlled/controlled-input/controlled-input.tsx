import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

type ControlledInputProps = {
  label?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  size?: "small" | "medium" | "large";
  className?: string;
  name: string;
  rules?: Record<string, any>;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  autoFocus?: boolean;
  startAdornment?: React.ReactNode; // 👈 NEW
};

function ControlledInput({
  label,
  id,
  required,
  disabled,
  placeholder,
  type = "text",
  size = "medium",
  className,
  name,
  rules,
  minLength,
  maxLength,
  min,
  max,
  autoFocus,
  startAdornment, // 👈 NEW
}: ControlledInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        ...(required && { required: `${label ?? name} est requis` }),
        ...(minLength && {
          minLength: {
            value: minLength,
            message: `Minimum length is ${minLength}`,
          },
        }),
        ...(maxLength && {
          maxLength: {
            value: maxLength,
            message: `Maximum length is ${maxLength}`,
          },
        }),
        ...(typeof min === "number" && {
          min: { value: min, message: `Minimum value is ${min}` },
        }),
        ...(typeof max === "number" && {
          max: { value: max, message: `Maximum value is ${max}` },
        }),
        ...rules,
      }}
      render={({ field, fieldState }) => {
        const { value, onChange, onBlur, ref } = field;
        const { error } = fieldState;

        return (
          <div className={cn("flex flex-col gap-1", className)}>
            {label && (
              <label
                htmlFor={id || name}
                className={cn(
                  "text-sm font-medium",
                  required &&
                    "after:ml-0.5 after:text-red-500 after:content-['*']"
                )}
              >
                {label}
              </label>
            )}

            <div className="relative">
              {startAdornment && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  {startAdornment}
                </div>
              )}
              <input
                id={id || name}
                type={type}
                disabled={disabled}
                placeholder={placeholder}
                className={cn(
                  "w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  error ? "border-red-500" : "border-input",
                  size === "small" && "h-8 text-xs",
                  size === "medium" && "h-10 text-sm",
                  size === "large" && "h-12 text-lg",
                  startAdornment && "pl-10" // 👈 add padding-left when icon present
                )}
                aria-invalid={!!error}
                aria-required={required}
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                minLength={minLength}
                maxLength={maxLength}
                min={min}
                max={max}
                autoFocus={autoFocus}
              />
            </div>

            {error && (
              <p className="text-red-600 text-xs mt-1" role="alert">
                {error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}

export { ControlledInput };
