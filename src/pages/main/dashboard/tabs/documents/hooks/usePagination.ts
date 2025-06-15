
import { useState } from "react";

export const usePagination = () => {
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    perPage: 10,
    searchTerm: "",
    sortField: "",
    sortOrder: "asc" as "asc" | "desc",
  });

  const handlePageChange = (newPage: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      perPage: newPerPage,
      page: 1,
    }));
  };

  const handleSort = (field: string, order: "asc" | "desc") => {
    setPaginationParams((prev) => ({
      ...prev,
      sortField: field,
      sortOrder: order,
    }));
  };

  const handleSearch = (value: string) => {
    setPaginationParams((prev) => ({
      ...prev,
      searchTerm: value,
      page: 1,
    }));
  };

  return {
    paginationParams,
    handlePageChange,
    handlePerPageChange,
    handleSort,
    handleSearch,
  };
};
