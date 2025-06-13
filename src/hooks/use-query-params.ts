import { useMemo } from "react";

import { useSearchParams } from "react-router-dom";

export const useQueryParams = () => {
  const [searchParams] = useSearchParams();
  return useMemo(() => {
    const params: any = {};
    for (const entry of searchParams.entries()) {
      if (entry.length === 2) {
        params[entry[0]] = entry[1];
      }
    }
    return params;
  }, [searchParams]);
};
