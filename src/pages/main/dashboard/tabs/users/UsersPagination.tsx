
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { UserDto } from "@/api-swagger/models/UserDto";

interface UsersPaginationProps {
  filteredUsers: UserDto[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export const UsersPagination: React.FC<UsersPaginationProps> = ({
  filteredUsers,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const nextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const paginate = (pageNumber: number) => onPageChange(pageNumber);

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun utilisateur trouvé
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-6">
      <div className="flex items-center">
        <label className="text-sm text-gray-500 mr-2">Afficher</label>
        <select
          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500 ml-2">par page</span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={prevPage}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Page précédente</span>
        </Button>

        <div className="flex items-center">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={i}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => paginate(pageNum)}
                className="h-8 w-8 p-0 mx-1"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Page suivante</span>
        </Button>
      </div>

      <div className="text-sm text-gray-500">
        Page {currentPage} sur {totalPages}
      </div>
    </div>
  );
};
