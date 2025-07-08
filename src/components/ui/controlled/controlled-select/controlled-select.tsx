import * as SelectPrimitive from "@radix-ui/react-select";
import { Controller, useFormContext } from "react-hook-form";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ControlledSelectProps<T> = {
  name: string;
  label?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  selectItemEndAdornment?: (option: T) => React.ReactNode;
  hideError?: boolean;
  data: T[];
  getOptionValue: (option: T) => string;
  getOptionLabel: (option: T) => string;
  size?: "small" | "medium" | "large";
  className?: string;
  value?: string;
  onValueChange?: (value: string | number) => void;
  rules?: Record<string, any>;
  clear?: boolean;
};

function ControlledSelect<T>({
  name,
  label,
  id,
  required,
  disabled,
  placeholder,
  selectItemEndAdornment,
  hideError,
  data,
  getOptionValue,
  getOptionLabel,
  size = "medium",
  className,
  value: _value,
  onValueChange: _onValueChange,
  rules,
  clear = false,
}: ControlledSelectProps<T>) {
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
        const { value, onChange, ref } = field;
        const { error } = fieldState;
        // Find the selected option for adornment
        const selectedOption = data.find(
          (option) => getOptionValue(option) === value
        );
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
              <SelectPrimitive.Root
                value={value ?? ""}
                onValueChange={onChange}
                disabled={disabled}
              >
                <SelectPrimitive.Trigger
                  id={id || name}
                  className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    error ? "border-red-500" : "border-input",
                    size === "small" && "h-8 text-xs",
                    size === "medium" && "h-10 text-sm",
                    size === "large" && "h-12 text-lg",
                    clear && value ? "pr-9 md:pr-12" : ""
                  )}
                  aria-required={required}
                  aria-invalid={!!error}
                  ref={ref}
                >
                  <div className="flex items-center min-w-0 flex-1 overflow-hidden">
                    <span className="truncate flex items-center min-w-0 max-w-full">
                      <span className="truncate">
                        <SelectPrimitive.Value placeholder={placeholder} />
                      </span>
                      {selectItemEndAdornment && selectedOption && (
                        <span className="ml-2 truncate text-gray-400 max-w-[6rem] sm:max-w-[10rem]">
                          {selectItemEndAdornment(selectedOption)}
                        </span>
                      )}
                    </span>
                  </div>
                  <SelectPrimitive.Icon asChild>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>

                <SelectPrimitive.Portal>
                  <SelectPrimitive.Content
                    className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
                    position="popper"
                  >
                    <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
                      <ChevronUp className="h-4 w-4" />
                    </SelectPrimitive.ScrollUpButton>
                    {data.length > 0 ? (
                      <SelectPrimitive.Viewport className="p-1 h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]">
                        {data.map((option) => {
                          const optionValue = getOptionValue(option);
                          const optionLabel = getOptionLabel(option);
                          return (
                            <SelectPrimitive.Item
                              key={optionValue}
                              value={optionValue}
                              className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                            >
                              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                <SelectPrimitive.ItemIndicator>
                                  <Check className="h-4 w-4" />
                                </SelectPrimitive.ItemIndicator>
                              </span>
                              <SelectPrimitive.ItemText>
                                {optionLabel.length > 50
                                  ? optionLabel.slice(0, 50) + "..."
                                  : optionLabel}
                              </SelectPrimitive.ItemText>
                              {selectItemEndAdornment && (
                                <span className="absolute right-2">
                                  {selectItemEndAdornment?.(option)}
                                </span>
                              )}
                            </SelectPrimitive.Item>
                          );
                        })}
                      </SelectPrimitive.Viewport>
                    ) : (
                      <SelectPrimitive.Viewport className="p-1 h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]">
                        <SelectPrimitive.Item
                          value="no-data"
                          className="relative flex w-full select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent"
                        >
                          Aucune donnée trouvée
                        </SelectPrimitive.Item>
                      </SelectPrimitive.Viewport>
                    )}

                    <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
                      <ChevronDown className="h-4 w-4" />
                    </SelectPrimitive.ScrollDownButton>
                  </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
              </SelectPrimitive.Root>
              {clear && value && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange(undefined);
                  }}
                  className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 p-1 rounded hover:bg-gray-100 focus:outline-none"
                  aria-label="Effacer la sélection"
                  tabIndex={0}
                  style={{ zIndex: 2 }}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            {!hideError && error && (
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

export { ControlledSelect };
