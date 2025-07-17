import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ControlledCheckboxProps {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  hideError?: boolean;
}

export function ControlledCheckbox({
  name,
  label,
  required,
  disabled,
  className,
  hideError,
}: ControlledCheckboxProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={required ? { required: `${label ?? name} est requis` } : undefined}
      render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
        <div className={cn("flex items-center gap-2", className)}>
          <Checkbox
            id={name}
            checked={!!value}
            onCheckedChange={onChange}
            ref={ref}
            disabled={disabled}
          />
          {label && (
            <label htmlFor={name} className="text-sm select-none">
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
          {!hideError && error && (
            <span className="text-red-600 text-xs ml-2" role="alert">
              {error.message}
            </span>
          )}
        </div>
      )}
    />
  );
}
