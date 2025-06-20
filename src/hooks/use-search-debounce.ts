import { useEffect, useState } from "react";

import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";

export const useSearchDebounce = ({
  name,
  milliSeconds = 700,
  control,
}: {
  name: string;
  milliSeconds?: number;
  control: Control<any>;
}) => {
  const value = useWatch({
    name,
    control,
  });

  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, milliSeconds);

    return () => {
      clearTimeout(handler);
    };
  }, [value, milliSeconds]);

  return debouncedValue;
};
