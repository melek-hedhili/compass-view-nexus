import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Textarea } from "../../textarea";

type ControlledInputProps = {
  label?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;

  size?: "small" | "medium" | "large";
  className?: React.HTMLAttributes<HTMLTextAreaElement>["className"];
  name: string; // required for RHF
  rules?: Record<string, any>;
  minLength?: number;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  autoFocus?: boolean;
  // Add other props as needed
};

function ControlledTextarea({
  label,
  id,
  required,
  disabled,
  placeholder,
  size = "medium",

  name,
  rules,
  minLength,
  maxLength,
  minRows,
  maxRows,
  className,
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
            <Textarea
              id={id || name}
              disabled={disabled}
              placeholder={placeholder}
              className={cn(
                className,

                "w-full min-h-[180px] border border-gray-200 rounded-md p-3 resize-none",
                minRows && `min-h-[${minRows * 24}px]`,
                maxRows && `max-h-[${maxRows * 24}px]`,
                error ? "border-red-500" : "border-input"
              )}
              aria-invalid={!!error}
              aria-required={required}
              value={value ?? ""}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              rows={minRows ?? 1}
              minLength={minLength}
              maxLength={maxLength}
            />
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

export { ControlledTextarea };
