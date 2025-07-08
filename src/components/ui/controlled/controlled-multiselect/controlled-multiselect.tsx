import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

export type ControlledMultiSelectProps<T> = {
  name: string;
  label?: string;
  data: T[];
  getOptionValue: (option: T) => string;
  getOptionLabel: (option: T) => string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  rules?: Record<string, any>;
};

export function ControlledMultiSelect<T>({
  name,
  label,
  data,
  getOptionValue,
  getOptionLabel,
  placeholder,
  required,
  disabled,
  className,
  id,
  rules,
}: ControlledMultiSelectProps<T>) {
  const { control } = useFormContext();
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        ...(required && { required: `${label ?? name} est requis` }),
        ...rules,
      }}
      render={({ field, fieldState }) => {
        const { onChange } = field;
        let { value } = field;
        const { error } = fieldState;
        if (!Array.isArray(value)) value = value ? [value] : [];
        const selectedOptions = data.filter((option) =>
          value.includes(getOptionValue(option))
        );
        const summary =
          selectedOptions.length === 0
            ? placeholder
            : selectedOptions.map(getOptionLabel).join(", ");

        const handleToggle = (optionValue: string) => {
          if (value.includes(optionValue)) {
            onChange(value.filter((v: string) => v !== optionValue));
          } else {
            onChange([...value, optionValue]);
          }
        };

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
            <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
              <PopoverPrimitive.Trigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    error ? "border-red-500" : "border-input"
                  )}
                  aria-haspopup="listbox"
                  aria-expanded={open}
                  aria-controls={`${id || name}-popover`}
                  disabled={disabled}
                >
                  <span className="truncate text-left flex-1">{summary}</span>
                  <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
                </button>
              </PopoverPrimitive.Trigger>
              <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                  id={`${id || name}-popover`}
                  role="listbox"
                  align="start"
                  sideOffset={4}
                  className={cn(
                    "z-50 min-w-[var(--radix-popover-trigger-width)] max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-fadeInScale",
                    "p-1"
                  )}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setOpen(false);
                    }
                  }}
                >
                  {data.length === 0 && (
                    <div className="px-4 py-2 text-gray-400">Aucune option</div>
                  )}
                  {data.map((option, idx) => {
                    const optionValue = getOptionValue(option);
                    const optionLabel = getOptionLabel(option);
                    const isSelected = value.includes(optionValue);
                    return (
                      <div
                        key={optionValue}
                        role="option"
                        aria-selected={isSelected}
                        tabIndex={0}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 cursor-pointer select-none hover:bg-primary/10",
                          isSelected && "bg-primary/10 font-semibold"
                        )}
                        onClick={() => handleToggle(optionValue)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleToggle(optionValue);
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="accent-primary h-4 w-4 rounded border-gray-300"
                        />
                        <span>{optionLabel}</span>
                      </div>
                    );
                  })}
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>
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

// Add fade/scale animation
// In your global CSS (e.g., index.css or tailwind.css), add:
// .animate-fadeInScale { animation: fadeInScale 0.18s cubic-bezier(0.16, 1, 0.3, 1); }
// @keyframes fadeInScale { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
