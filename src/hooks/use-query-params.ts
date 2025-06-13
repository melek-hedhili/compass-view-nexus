
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type QueryParams = Record<string, string | number>;

export const useQueryParams = (): Record<string, string> => {
  const [searchParams] = useSearchParams();
  return useMemo(() => {
    const params: Record<string, string> = {};
    for (const entry of searchParams.entries()) {
      if (entry.length === 2) {
        params[entry[0]] = entry[1];
      }
    }
    return params;
  }, [searchParams]);
};
