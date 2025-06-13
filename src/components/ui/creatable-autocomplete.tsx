import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CreatableAutoCompleteProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  chipSize?: "sm" | "md" | "lg";
}

export function CreatableAutoComplete({
  values,
  onChange,
  placeholder = "Type and press enter...",
  className,
  chipSize = "sm",
}: CreatableAutoCompleteProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [showSuggestion, setShowSuggestion] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const canAdd = inputValue.trim() && !values.includes(inputValue.trim());

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && canAdd) {
      e.preventDefault();
      addValue();
    } else if (e.key === "Backspace" && !inputValue && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const addValue = () => {
    const newValue = inputValue.trim();
    if (newValue && !values.includes(newValue)) {
      onChange([...values, newValue]);
      setInputValue("");
      setShowSuggestion(false);
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const removeValue = (valueToRemove: string) => {
    onChange(values.filter((value) => value !== valueToRemove));
  };

  // Chip size classes
  const chipSizeClass =
    chipSize === "lg"
      ? "text-base px-3 py-1.5"
      : chipSize === "md"
      ? "text-sm px-2.5 py-1.5"
      : "text-xs px-2 py-1";

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex flex-wrap gap-2 p-2 border rounded-md bg-background"
        )}
      >
        {values.map((value) => (
          <Badge
            key={value}
            variant="secondary"
            className={cn("flex items-center gap-1", chipSizeClass)}
          >
            {value}
            <button
              type="button"
              onClick={() => removeValue(value)}
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
              <span className="sr-only">Remove {value}</span>
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestion(!!e.target.value.trim());
          }}
          onFocus={() => setShowSuggestion(!!inputValue.trim())}
          onBlur={() => setTimeout(() => setShowSuggestion(false), 100)}
          onKeyDown={handleKeyDown}
          placeholder={values.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        />
      </div>
      {showSuggestion && canAdd && (
        <div
          className="absolute left-0 right-0 mt-1 z-10 bg-popover border border-destructive/30 rounded-md shadow text-sm cursor-pointer select-none transition-colors"
          onMouseDown={(e) => e.preventDefault()}
          onClick={addValue}
        >
          <div className="px-4 py-2 text-destructive/90 hover:bg-destructive/10">
            Add "{inputValue.trim()}"
          </div>
        </div>
      )}
    </div>
  );
}
