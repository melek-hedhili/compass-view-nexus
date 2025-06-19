import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export type RadioOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type ControlledRadioGroupProps = {
  name: string;
  label?: string;
  options: RadioOption[];
  required?: boolean;
  rules?: Record<string, any>;
  className?: string;
  radioClassName?: string;
  direction?: "row" | "column";
  labelClassName?: string;
};

export function ControlledRadioGroup({
  name,
  label,
  options,
  required,
  rules,
  className,
  radioClassName,
  direction = "column",
  labelClassName,
}: ControlledRadioGroupProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        ...(required && { required: `${label ?? name} est requis` }),
        ...rules,
      }}
      render={({ field, fieldState }) => {
        const { value, onChange } = field;
        const { error } = fieldState;
        return (
          <div className={cn("flex flex-col gap-1", className)}>
            {label && (
              <span
                className={cn(
                  "text-sm font-medium",
                  labelClassName,
                  required &&
                    "after:ml-0.5 after:text-red-500 after:content-['*']"
                )}
              >
                {label}
              </span>
            )}
            <RadioGroup
              value={value ?? ""}
              onValueChange={onChange}
              className={cn(
                "flex flex-col gap-2 mt-1",
                direction === "row" && "flex-row"
              )}
            >
              {options.map((option) => (
                <label
                  key={option.value}
                  className="inline-flex items-center gap-2"
                >
                  <RadioGroupItem
                    value={option.value}
                    disabled={option.disabled}
                    className={radioClassName}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </RadioGroup>
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
