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
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Helper to get nested value
const getNestedValue = (obj: any, path: string): any =>
  path
    .split(".")
    .reduce(
      (current, key) =>
        current && current[key] !== undefined ? current[key] : undefined,
      obj
    );

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

  showIndex?: boolean; // For showing row numbers
  renderListEmpty?: () => React.ReactNode;
  page?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
}

// Skeleton (not changed)
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

// Table rendering section
function DataTableTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading,
  onRowClick,
  showIndex,
  renderListEmpty,
  startIndex,
  renderCellValue,
  renderNoData,
}: {
  data: T[];
  columns: Column<T>[];
  loading: boolean;
  onRowClick?: (row: T) => void;
  showIndex: boolean;
  renderListEmpty?: () => React.ReactNode;
  startIndex: number;
  renderCellValue: (column: Column<T>, row: T) => React.ReactNode;
  renderNoData: () => React.ReactNode;
}) {
  return (
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
            >
              <div className="flex items-center gap-2">{column.header}</div>
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
  );
}

// Pagination and controls section
function DataTablePaginationControls({
  totalItems,
  perPage,
  handleItemsPerPageChange,
  startIndex,
  dataLength,
  page,
  totalPages,
  handlePageChange,
}: {
  totalItems: number;
  perPage: number;
  handleItemsPerPageChange: (value: string) => void;
  startIndex: number;
  dataLength: number;
  page: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}) {
  return (
    <div
      className="
        w-full px-2
        flex flex-wrap items-center gap-y-2 gap-x-4
        justify-center sm:justify-between
      "
    >
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

        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {totalItems === 0 ? 0 : startIndex + 1}-{startIndex + dataLength} sur{" "}
          {totalItems}
        </span>
      </div>

      <div className="flex items-center justify-center w-full sm:w-auto sm:ml-auto">
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

            {(() => {
              const items = [];
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) {
                  items.push(
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => handlePageChange(i)}
                        {...(page === i ? { isActive: true } : ({} as any))}
                        className="cursor-pointer"
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              } else {
                items.push(
                  <PaginationItem key={1}>
                    <PaginationLink
                      onClick={() => handlePageChange(1)}
                      {...(page === 1 ? { isActive: true } : ({} as any))}
                      className="cursor-pointer"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                );
                if (page > 4) {
                  items.push(
                    <PaginationItem key="start-ellipsis">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                for (let i = Math.max(2, page - 2); i < page; i++) {
                  items.push(
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => handlePageChange(i)}
                        {...(page === i ? { isActive: true } : ({} as any))}
                        className="cursor-pointer"
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (page !== 1 && page !== totalPages) {
                  items.push(
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                for (
                  let i = page + 1;
                  i <= Math.min(totalPages - 1, page + 2);
                  i++
                ) {
                  items.push(
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => handlePageChange(i)}
                        {...(page === i ? { isActive: true } : ({} as any))}
                        className="cursor-pointer"
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (page < totalPages - 3) {
                  items.push(
                    <PaginationItem key="end-ellipsis">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                items.push(
                  <PaginationItem key={totalPages}>
                    <PaginationLink
                      onClick={() => handlePageChange(totalPages)}
                      {...(page === totalPages
                        ? { isActive: true }
                        : ({} as any))}
                      className="cursor-pointer"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return items;
            })()}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                className={cn(
                  page === totalPages && "pointer-events-none opacity-50",
                  "cursor-pointer"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  className,
  onRowClick,
  count,

  showIndex = false,
  renderListEmpty,
  page = 1,
  perPage = 10,
  onPageChange,
  onPerPageChange,
}: DataTableProps<T>) {
  // Memoized derived values
  const totalItems = count ?? data?.length ?? 0;
  const totalPages = React.useMemo(
    () => Math.ceil(totalItems / perPage),
    [totalItems, perPage]
  );
  const startIndex = React.useMemo(() => (page - 1) * perPage, [page, perPage]);

  // Handlers
  const handlePageChange = React.useCallback(
    (newPage: number) => {
      onPageChange?.(newPage);
    },
    [onPageChange]
  );

  const handleItemsPerPageChange = React.useCallback(
    (value: string) => {
      onPerPageChange?.(Number(value));
    },
    [onPerPageChange]
  );

  // Render helpers
  const renderCellValue = React.useCallback(
    (column: Column<T>, row: T): React.ReactNode => {
      if (column.render) {
        const value = getNestedValue(row, column.key || "");
        return column.render(value, row);
      }
      const value = getNestedValue(row, column.key || "");
      if (typeof value === "string") {
        return value.length > 20 ? value.slice(0, 20) + "..." : value;
      }
      return typeof value === "object" ? JSON.stringify(value) : String(value);
    },
    []
  );

  const renderNoData = React.useCallback(() => {
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
  }, [data, loading, renderListEmpty, columns.length, showIndex]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border">
        <DataTableTable
          data={data}
          columns={columns}
          loading={loading}
          onRowClick={onRowClick}
          showIndex={showIndex}
          renderListEmpty={renderListEmpty}
          startIndex={startIndex}
          renderCellValue={renderCellValue}
          renderNoData={renderNoData}
        />
      </div>
      {totalItems > 0 && (
        <DataTablePaginationControls
          totalItems={totalItems}
          perPage={perPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
          startIndex={startIndex}
          dataLength={data.length}
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
}
