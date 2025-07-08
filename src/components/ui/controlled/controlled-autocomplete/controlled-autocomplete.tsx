import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

export type ControlledAutocompleteProps = {
  name: string;
  label?: string;
  data: string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  rules?: Record<string, any>;
  type?: React.HTMLInputTypeAttribute;
};

export function ControlledAutocomplete({
  name,
  label,
  data,
  placeholder,
  required,
  disabled,
  type = "text",
  className,
  id,
  rules,
}: ControlledAutocompleteProps) {
  const { control, watch } = useFormContext();
  const [inputValue, setInputValue] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number | null>(
    null
  );
  const inputRef = React.useRef<HTMLInputElement>(null);
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // Sync inputValue with form value (clear on reset)
  const fieldValue = watch(name);
  React.useEffect(() => {
    if (!fieldValue) setInputValue("");
  }, [fieldValue, name]);

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (highlightedIndex !== null && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  // Filter options based on input
  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return data;
    return data.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, data]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        ...(required && { required: `${label ?? name} est requis` }),
        ...rules,
      }}
      render={({ field, fieldState }) => {
        const { value, onChange } = field;
        const { error } = fieldState;

        const handleSelect = (option: string) => {
          onChange(option);
          setInputValue(option);
          setShowSuggestions(false);
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setInputValue(e.target.value);
          setShowSuggestions(e.target.value.trim() !== "");
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (!showSuggestions || filteredOptions.length === 0) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev === null || prev === filteredOptions.length - 1
                ? 0
                : prev + 1
            );
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev === null || prev === 0
                ? filteredOptions.length - 1
                : prev - 1
            );
          } else if (e.key === "Enter" && highlightedIndex !== null) {
            e.preventDefault();
            handleSelect(filteredOptions[highlightedIndex]);
            setHighlightedIndex(null);
          } else if (e.key === "Escape") {
            setShowSuggestions(false);
            setHighlightedIndex(null);
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
            <div className="relative">
              <input
                ref={inputRef}
                id={id || name}
                type={type}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => {
                  if (inputValue.trim() !== "") setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={!!error}
                aria-required={required}
                className={cn(
                  "w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none",
                  error ? "border-red-500" : "border-input"
                )}
                autoComplete="off"
              />
              {showSuggestions &&
                inputValue.trim() !== "" &&
                filteredOptions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 z-20 bg-popover border border-gray-200 rounded-md shadow text-sm max-h-48 overflow-auto animate-fadeInScale">
                    {filteredOptions.map((option, idx) => (
                      <div
                        key={option}
                        ref={(el) => (itemRefs.current[idx] = el)}
                        className={cn(
                          "px-4 py-2 cursor-pointer select-none",
                          highlightedIndex === idx &&
                            "bg-primary/10 font-semibold"
                        )}
                        onMouseDown={() => handleSelect(option)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
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
