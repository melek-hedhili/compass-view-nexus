import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { QueryParams } from "./use-query-params";

export const useQueryUpdate = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return useCallback(
    (params: Partial<QueryParams>) => {
      if (!params) return;

      const newSearchParams = new URLSearchParams(searchParams);
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value.toString());
        }
      });

      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );
};
