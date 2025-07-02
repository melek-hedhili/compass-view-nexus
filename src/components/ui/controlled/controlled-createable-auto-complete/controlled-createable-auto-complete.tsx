import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Match ControlledInput's props
export type ControlledCreateableAutoCompleteProps = {
  label?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  size?: "small" | "medium" | "large";
  className?: string;
  name: string;
  rules?: Record<string, any>;
  chipSize?: "sm" | "md" | "lg";
  removeAsterisk?: boolean;
};

export function ControlledCreateableAutoComplete({
  label,
  id,
  required,
  disabled,
  placeholder,
  size = "medium",
  className,
  name,
  rules,
  chipSize = "sm",
  removeAsterisk,
}: ControlledCreateableAutoCompleteProps) {
  const { control } = useFormContext();
  const [inputValue, setInputValue] = React.useState("");
  const [showSuggestion, setShowSuggestion] = React.useState(false);
  const [highlighted, setHighlighted] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Chip size classes
  const chipSizeClass =
    chipSize === "lg"
      ? "text-base px-3 py-1.5"
      : chipSize === "md"
      ? "text-sm px-2.5 py-1.5"
      : "text-xs px-2 py-1";

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        ...(required && { required: `${label ?? name} est requis` }),
        ...rules,
      }}
      render={({ field, fieldState }) => {
        const { value = [], onChange } = field;
        const { error } = fieldState;
        const canAdd = inputValue.trim() && !value.includes(inputValue.trim());

        const addValue = () => {
          const newValue = inputValue.trim();
          if (newValue && !value.includes(newValue)) {
            onChange([...value, newValue]);
            setInputValue("");
            setShowSuggestion(false);
            if (inputRef.current) inputRef.current.focus();
          }
        };

        const removeValue = (valueToRemove: string) => {
          onChange(value.filter((v: string) => v !== valueToRemove));
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            if (showSuggestion && canAdd && highlighted) {
              e.preventDefault();
              addValue();
              setHighlighted(false);
            } else if (canAdd && !showSuggestion) {
              e.preventDefault();
              addValue();
            }
          } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            onChange(value.slice(0, -1));
          } else if (e.key === "ArrowDown" && showSuggestion && canAdd) {
            e.preventDefault();
            setHighlighted(true);
          } else if (e.key === "ArrowUp" && showSuggestion && canAdd) {
            e.preventDefault();
            setHighlighted(false);
          } else if (e.key === "Escape") {
            setShowSuggestion(false);
            setHighlighted(false);
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
                    !removeAsterisk &&
                    "after:ml-0.5 after:text-red-500 after:content-['*']"
                )}
              >
                {label}
              </label>
            )}
            <div
              className={cn(
                "relative",
                disabled && "opacity-50 pointer-events-none"
              )}
            >
              <div
                className={cn(
                  "flex items-center flex-wrap gap-1 w-full min-h-10 px-3 py-2 border rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                  error ? "border-red-500" : "border-input",
                  size === "small" && "min-h-8 text-xs px-2 py-1",
                  size === "medium" && "min-h-10 text-sm px-3 py-2",
                  size === "large" && "min-h-12 text-lg px-4 py-3"
                )}
                style={{ cursor: disabled ? "not-allowed" : "text" }}
                onClick={() => inputRef.current?.focus()}
              >
                {value.map((v: string) => (
                  <Badge
                    key={v}
                    variant="secondary"
                    className={cn(
                      "flex items-center gap-1",
                      chipSizeClass,
                      "m-0"
                    )}
                  >
                    {v}
                    <button
                      type="button"
                      onClick={() => removeValue(v)}
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      tabIndex={-1}
                      disabled={disabled}
                    >
                      <X
                        className={
                          chipSize === "lg"
                            ? "h-4 w-4"
                            : chipSize === "md"
                            ? "h-3.5 w-3.5"
                            : "h-3 w-3"
                        }
                      />
                      <span className="sr-only">Remove {v}</span>
                    </button>
                  </Badge>
                ))}
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowSuggestion(!!e.target.value.trim());
                  }}
                  onFocus={() => setShowSuggestion(!!inputValue.trim())}
                  onBlur={() => setTimeout(() => setShowSuggestion(false), 100)}
                  onKeyDown={handleKeyDown}
                  placeholder={value.length === 0 ? placeholder : ""}
                  disabled={disabled}
                  id={id || name}
                  aria-invalid={!!error}
                  aria-required={required}
                  autoComplete="off"
                  className={cn(
                    "flex-1 border-none outline-none bg-transparent min-w-[60px]",
                    size === "small" && "text-xs",
                    size === "medium" && "text-sm",
                    size === "large" && "text-lg"
                  )}
                  style={{ minWidth: 60 }}
                />
              </div>
              {showSuggestion && canAdd && !disabled && (
                <div
                  className={cn(
                    "absolute left-0 right-0 mt-1 z-20 bg-popover border border-destructive/30 rounded-md shadow text-sm cursor-pointer select-none transition-colors"
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    addValue();
                    setHighlighted(false);
                  }}
                  onMouseEnter={() => setHighlighted(true)}
                  onMouseLeave={() => setHighlighted(false)}
                >
                  <div
                    className={cn(
                      "px-4 py-2 text-destructive/90",
                      highlighted &&
                        "border-l-4 border-primary font-semibold text-primary"
                    )}
                    aria-selected={highlighted}
                  >
                    Ajouter "{inputValue.trim()}"
                  </div>
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
