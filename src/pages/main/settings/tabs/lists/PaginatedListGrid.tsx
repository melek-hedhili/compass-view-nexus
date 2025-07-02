import React, { useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PaginatedListGridProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  onBottomEndReached: () => void;
  threshold?: number; // px
  className?: string;
  isFetchingNextPage?: boolean;
  loading?: boolean;
  renderEmpty?: () => React.ReactNode;
}

// Skeleton card component for loading state
const ListCardSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-14" />
      </div>
    </div>
  </div>
);

// Default empty state component
const DefaultEmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Aucune donnée trouvée
    </h3>
    <p className="text-gray-500">Aucun élément à afficher pour le moment.</p>
  </div>
);

export function PaginatedListGrid<T>({
  data,
  renderItem,
  keyExtractor,
  onBottomEndReached,
  threshold = 50,
  className = "",
  isFetchingNextPage,
  loading = false,
  renderEmpty,
}: PaginatedListGridProps<T>) {
  const triggeredRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = docHeight - (scrollTop + windowHeight);
      if (
        distanceFromBottom <= threshold &&
        !triggeredRef.current &&
        !isFetchingNextPage
      ) {
        console.log("onBottomEndReached");
        triggeredRef.current = true;
        onBottomEndReached();
      } else if (distanceFromBottom > threshold) {
        triggeredRef.current = false;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onBottomEndReached, threshold]);

  // Render skeleton cards when loading
  if (loading) {
    return (
      <div
        className={`h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <ListCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Render empty state when no data
  if (!data || data.length === 0) {
    return <div>{renderEmpty ? renderEmpty() : <DefaultEmptyState />}</div>;
  }

  return (
    <div
      className={`h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {data.map((item, idx) => (
        <React.Fragment key={keyExtractor(item)}>
          {renderItem(item, idx)}
        </React.Fragment>
      ))}
      {isFetchingNextPage && (
        <div className="col-span-full flex justify-center items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-formality-primary" />
        </div>
      )}
    </div>
  );
}
