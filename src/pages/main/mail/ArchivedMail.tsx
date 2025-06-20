import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { EmailService } from "@/api-swagger/services/EmailService";
import { EmailDto } from "@/api-swagger/models/EmailDto";
import { DataTable, Column } from "@/components/ui/data-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ReactNode } from "react";
import { searchFields } from "./mail.utils";
import { FindOptionsQuery } from "@/api-swagger";
import { Search } from "lucide-react";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useSearchDebounce } from "@/hooks/use-search-debounce";

const ArchivedMail = ({
  onRowClick,
}: {
  onRowClick: (email: EmailDto) => void;
}) => {
  const [pagination, setPagination] = useState<FindOptionsQuery>({
    page: "1",
    perPage: "10",
    searchValue: "",
    searchFields,
  });

  const methods = useForm<{ search: string }>({
    defaultValues: {
      search: undefined,
    },
  });

  const search = useSearchDebounce({
    name: "search",
    control: methods.control,
  });

  // Update pagination when searchValue changes
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      searchValue: search ?? "",
      page: "1", // Reset to first page when searching
    }));
  }, [search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["emails", "archived", pagination],
    queryFn: () => EmailService.emailControllerFindAllArchived(pagination),
  });

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: String(newPage),
    }));
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPagination((prev) => ({
      ...prev,
      perPage: String(newPerPage),
      page: "1",
    }));
  };

  const handleSort = (field: string, order: "asc" | "desc") => {
    setPagination((prev) => ({
      ...prev,
      sortField: field,
      sortOrder: order,
    }));
  };

  const columns: Column<EmailDto>[] = [
    {
      key: "client.clientName",
      header: "Nom du Client",
      render: (value) => value || "N/A",
      className: "text-left font-medium",
    },
    {
      key: "from",
      header: "Expéditeur",

      className: "text-left font-medium",
    },
    {
      key: "subject",
      header: "Sujet",
      className: "text-left font-medium",
    },
    {
      key: "date",
      header: "Date/H",
      render: (value) => (
        <div className="text-sm text-gray-500">
          {format(new Date(value), "dd/MM/yyyy HH:mm", {
            locale: fr,
          })}
        </div>
      ),
      className: "text-left font-medium w-32",
    },
  ];

  if (error) {
    return (
      <div className="h-24 text-center text-red-500 flex items-center justify-center">
        Erreur lors du chargement des emails archivés
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}

      <div className="w-full">
        <Form methods={methods}>
          <ControlledInput
            placeholder="Recherche..."
            name="search"
            startAdornment={<Search className="h-4 w-4 text-gray-400" />}
          />
        </Form>
      </div>

      {/* Data Table */}
      <div className="card-elegant w-full">
        <DataTable
          data={data?.data || []}
          count={data?.count}
          columns={columns}
          loading={isLoading}
          page={+pagination.page}
          perPage={+pagination.perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSort={handleSort}
          onRowClick={onRowClick}
          renderListEmpty={() => (
            <div className="h-24 text-center text-gray-500 flex items-center justify-center">
              Aucun mail archivé trouvé
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ArchivedMail;
