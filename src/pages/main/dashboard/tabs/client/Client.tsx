import { ReactNode, useState } from "react";
import { ClientForm } from "@/components/dashboard/ClientForm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClientDto, ClientService, CreateClientDto } from "@/api-swagger";
import { DataTable } from "@/components/ui/data-table";

const Client = () => {
  const [selectedClient, setSelectedClient] = useState<ClientDto | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const queryClient = useQueryClient();

  // Consolidated pagination state
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    perPage: 10,
    searchTerm: "",
    sortField: "",
    sortOrder: "asc" as "asc" | "desc",
  });

  const { data: clients, isLoading } = useQuery({
    queryKey: [
      "clients",
      paginationParams.page,
      paginationParams.perPage,
      paginationParams.sortField,
      paginationParams.sortOrder,
    ],
    queryFn: () =>
      ClientService.clientControllerFindAll({
        page: paginationParams.page.toString(),
        perPage: paginationParams.perPage.toString(),
        ...(paginationParams.sortField && {
          sortField: paginationParams.sortField,
        }),
        ...(paginationParams.sortOrder && {
          sortOrder: paginationParams.sortOrder,
        }),
      }),
  });

  const createClientMutation = useMutation({
    mutationFn: (createClientDto: CreateClientDto) =>
      ClientService.clientControllerCreate({
        requestBody: createClientDto,
      }),
    onSuccess: async () => {
      toast.success("Client ajouté avec succès");
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const handleSelectClient = (client: ClientDto) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
  };

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
      page: 1, // Reset to first page when changing items per page
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
      page: 1, // Reset to first page when searching
    }));
  };

  const filteredClients = clients?.data?.filter((client) => {
    if (!paginationParams.searchTerm) return true;
    const term = paginationParams.searchTerm.toLowerCase();
    return (
      client.lastName?.toLowerCase().includes(term) ||
      client.firstName?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term) ||
      (client.phone && client.phone.includes(term))
    );
  });

  const addNewClient = () => {
    setSelectedClient(null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedClient(null);
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-6">
        <div className="flex items-center mb-4 md:mb-0"></div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Recherche..."
              className="pl-10 input-elegant"
              value={paginationParams.searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button
            className="bg-formality-primary flex items-center gap-2"
            onClick={addNewClient}
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau client</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            Clients archivés
          </Button>
        </div>
      </div>

      <div className="card-elegant w-full">
        <DataTable
          data={filteredClients}
          count={clients?.count}
          columns={[
            {
              key: "lastName",
              header: "Nom",
              sortable: true,
              align: "left",
            },
            {
              key: "firstName",
              header: "Prénom",
              sortable: true,
              align: "left",
            },
            {
              key: "email",
              header: "Email",
              sortable: true,
              align: "left",
            },
            {
              key: "phone",
              header: "Téléphone",
              sortable: true,
              align: "left",
            },
            {
              key: "isArchived",
              header: "Archivé",
              sortable: true,
              align: "left",
              render: (value: unknown, row: Record<string, unknown>) =>
                (row.isArchived ? "Oui" : "Non") as ReactNode,
            },
            {
              key: "creationPrice",
              header: "Tarif",
              sortable: true,
              align: "left",
            },
          ]}
          loading={isLoading}
          onRowClick={handleSelectClient}
          page={paginationParams.page}
          perPage={paginationParams.perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          sortField={paginationParams.sortField}
          sortOrder={paginationParams.sortOrder}
          onSort={handleSort}
        />
      </div>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-4xl overflow-y-auto lg:w-[900px]"
        >
          <div className="py-4">
            <ClientForm client={selectedClient} onCancel={handleCloseDrawer} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Client;
