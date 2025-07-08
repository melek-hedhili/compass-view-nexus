import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type CheckboxOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type ControlledCheckboxGroupProps = {
  name: string;
  label?: string;
  options: CheckboxOption[];
  required?: boolean;
  rules?: Record<string, any>;
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  direction?: "row" | "column";
  /** Allow only one selection (defaults to false = multi‑select) */
  singleSelection?: boolean;
  /** Add a "Tout" checkbox to select/deselect all options (only works in multi-select mode) */
  withSelectAllOption?: boolean;
};

export function ControlledCheckboxGroup({
  name,
  label,
  options,
  required,
  rules,
  className,
  checkboxClassName,
  labelClassName,
  direction = "column",
  singleSelection = false,
  withSelectAllOption = false,
}: ControlledCheckboxGroupProps) {
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
        let { value } = field;
        const { onChange } = field;
        const { error } = fieldState;
        if (!Array.isArray(value)) value = value ? [value] : [];

        const handleCheckboxChange = (
          checked: boolean,
          optionValue: string
        ) => {
          if (singleSelection) {
            // keep at most one value
            if (checked) {
              onChange([optionValue]);
            } else {
              onChange([]);
            }
          } else {
            // regular multi‑select logic
            if (checked) {
              onChange([...(value || []), optionValue]);
            } else {
              onChange((value || []).filter((v: string) => v !== optionValue));
            }
          }
        };

        const handleSelectAllChange = (checked: boolean) => {
          if (checked) {
            // Select all enabled options
            const allValues = options
              .filter((option) => !option.disabled)
              .map((option) => option.value);
            onChange(allValues);
          } else {
            // Deselect all
            onChange([]);
          }
        };

        // Check if all enabled options are selected
        const enabledOptions = options.filter((option) => !option.disabled);
        const selectedEnabledOptions = (value || []).filter((v) =>
          enabledOptions.some((option) => option.value === v)
        );
        const isAllSelected =
          enabledOptions.length > 0 &&
          selectedEnabledOptions.length === enabledOptions.length;

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
            <div
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
                  <Checkbox
                    checked={value?.includes(option.value)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(!!checked, option.value)
                    }
                    disabled={option.disabled}
                    className={checkboxClassName}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
              {withSelectAllOption && !singleSelection && (
                <label className="inline-flex items-center gap-2">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) =>
                      handleSelectAllChange(!!checked)
                    }
                    className={checkboxClassName}
                  />
                  <span>Tous</span>
                </label>
              )}
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
