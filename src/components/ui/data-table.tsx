import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Utility type to flatten nested object properties
type FlattenKeys<T> = {
  [K in keyof T]: T[K] extends object
    ? `${string & K}.${string & keyof T[K]}` | (string & K)
    : string & K;
}[keyof T];

type ColumnKey<T> = FlattenKeys<T>; // Allow both flattened keys and any string

export interface Column<T> {
  key?: ColumnKey<T>; // Make key optional
  header: string;
  render?: (value: any, row?: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortKey?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  className?: string;
  onRowClick?: (row: T) => void;
  count?: number;
  index?: string; // For prefixing query parameters
  showIndex?: boolean; // For showing row numbers
  renderListEmpty?: () => React.ReactNode;
  page?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string, order: "asc" | "desc") => void;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  className,
  onRowClick,
  count,
  index,
  showIndex = false,
  renderListEmpty,
  page = 1,
  perPage = 10,
  onPageChange,
  onPerPageChange,
  sortField,
  sortOrder,
  onSort,
}: DataTableProps<T>) {
  // Calculate pagination values
  const totalItems = count ?? data?.length ?? 0;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, totalItems);

  // Handlers
  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    if (onPerPageChange) {
      onPerPageChange(Number(value));
    }
  };

  const handleRequestSort = (
    property: keyof T | undefined,
    sortKey?: string
  ) => {
    if (!onSort || !property) return;

    const field = sortKey || String(property);
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    onSort(field, newOrder);
  };

  // Helper function to get nested property values
  const getNestedValue = (obj: any, path: string): any =>
    path
      .split(".")
      .reduce(
        (current, key) =>
          current && current[key] !== undefined ? current[key] : undefined,
        obj
      );

  const renderCellValue = (column: Column<T>, row: T): React.ReactNode => {
    if (column.render) {
      const value = getNestedValue(row, column.key || "");
      return column.render(value, row);
    }
    const value = getNestedValue(row, column.key || "");
    return typeof value === "object" ? JSON.stringify(value) : String(value);
  };

  const renderNoData = () => {
    if (data?.length === 0 && !loading) {
      if (renderListEmpty) {
        return renderListEmpty();
      }
      return (
        <TableRow>
          <TableCell
            colSpan={columns.length + (showIndex ? 1 : 0)}
            className="h-24 text-center text-muted-foreground"
          >
            No data available
          </TableCell>
        </TableRow>
      );
    }
    return null;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {showIndex && (
                <TableHead className="w-[50px] text-center">#</TableHead>
              )}
              {columns?.map((column, index) => (
                <TableHead
                  key={index}
                  className={cn(
                    column.className,
                    column.sortable && "cursor-pointer",
                    column.align && `text-${column.align}`
                  )}
                  onClick={() =>
                    column.sortable &&
                    handleRequestSort(column.key, column.sortKey)
                  }
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && (
                      <span className="text-muted-foreground">
                        {sortField === (column.sortKey || column.key) &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <DataTableSkeleton columns={columns} showIndex={showIndex} />
            ) : data?.length > 0 ? (
              data.map((row, index) => (
                <TableRow
                  key={index}
                  className={onRowClick ? "cursor-pointer" : ""}
                  onClick={() => onRowClick?.(row)}
                >
                  {showIndex && (
                    <TableCell className="text-center">
                      {startIndex + index + 1}
                    </TableCell>
                  )}
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={cn(
                        column.className,
                        column.align && `text-${column.align}`
                      )}
                    >
                      {renderCellValue(column, row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              renderNoData()
            )}
          </TableBody>
        </Table>
      </div>

      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              Lignes par page:
            </p>
            <Select
              value={perPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="h-8 w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <span className="whitespace-nowrap">
              {startIndex + 1}-{endIndex} sur {totalItems}
            </span>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  className={cn(
                    page === 1 && "pointer-events-none opacity-50",
                    "cursor-pointer"
                  )}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (page <= 3) {
                  pageNumber = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = page - 2 + i;
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={page === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, page + 1))
                  }
                  className={cn(
                    page === totalPages && "pointer-events-none opacity-50",
                    "cursor-pointer"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

function DataTableSkeleton<T extends Record<string, unknown>>({
  columns,
  showIndex,
}: {
  columns: Column<T>[];
  showIndex?: boolean;
}) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          {showIndex && (
            <TableCell className="w-[50px] text-center">
              <Skeleton className="h-4 w-4 mx-auto" />
            </TableCell>
          )}
          {columns.map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
