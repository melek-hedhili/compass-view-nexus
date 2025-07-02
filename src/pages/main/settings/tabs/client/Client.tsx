import { useEffect, useState } from "react";
import { ClientForm } from "@/components/dashboard/ClientForm";
import { Button } from "@/components/ui/button";
import { Search, Plus, Pencil, Archive, User } from "lucide-react";
import { type ClientDto, ClientService } from "@/api-swagger";
import { DataTable } from "@/components/ui/data-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useSearchDebounce } from "@/hooks/use-search-debounce";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { ClientDetailsSheet } from "./ClientDetailsSheet";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { ArchiveFilterButton } from "@/components/ui/ArchiveFilterButton";

const Client = () => {
  const [selectedClient, setSelectedClient] = useState<ClientDto | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const methods = useForm<{
    search: string;
  }>({
    defaultValues: {
      search: "",
    },
  });
  // Consolidated pagination state
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    perPage: 5,
  });
  const searchValue = useSearchDebounce({
    control: methods.control,
    name: "search",
  });
  useEffect(() => {
    if (paginationParams.page !== 1) {
      setPaginationParams((prev) => ({ ...prev, page: 1 }));
    }
  }, [searchValue]);

  // Reset to page 1 when toggling archived filter
  useEffect(() => {
    setPaginationParams((prev) => ({ ...prev, page: 1 }));
  }, [showArchived]);

  const { data: clients, isLoading } = useQuery({
    queryKey: [
      "clients",
      paginationParams.page,
      paginationParams.perPage,
      searchValue,
      showArchived,
    ],
    queryFn: () =>
      ClientService.clientControllerFindAll({
        page: paginationParams.page.toString(),
        perPage: paginationParams.perPage.toString(),
        searchValue,
        searchFields: ["clientName", "lastName", "firstName", "email", "phone"],
        filters: JSON.stringify([
          {
            field: "isArchived",
            values: [showArchived.toString()],
          },
        ]),
      }),
  });

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsClient, setDetailsClient] = useState<ClientDto | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const ArchiveUnArchiveClientMutation = useMutation({
    mutationFn: async ({
      id,
      isArchived,
    }: {
      id: string;
      isArchived: boolean;
    }) =>
      ClientService.clientControllerUpdate({
        id,
        requestBody: { isArchived: !isArchived },
      }),
    onSuccess: (_, variables) => {
      toast.success(
        variables.isArchived
          ? "Client désarchivé avec succès"
          : "Client archivé avec succès"
      );
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => {
      toast.error("Erreur lors de l'archivage/désarchivage du client");
    },
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
      page: 1, // Reset to first page when changing items per page
    }));
  };

  const addNewClient = () => {
    setSelectedClient(null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedClient(null);
  };

  const handleEdit = (client: ClientDto) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
  };

  const handleArchive = (client: ClientDto) => {
    setSelectedClient(client);
    setIsConfirmModalOpen(true);
  };
  const handleRowClick = (client: ClientDto) => {
    setDetailsClient(client);
    setIsDetailsOpen(true);
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-6">
        <div className="flex items-center mb-4 md:mb-0" />
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Form methods={methods}>
            <ControlledInput
              startAdornment={<Search className="h-4 w-4 text-gray-400" />}
              name="search"
              placeholder="Recherche..."
            />
          </Form>
          <ArchiveFilterButton
            archived={showArchived}
            onToggle={() => setShowArchived((prev) => !prev)}
            featureName="Clients"
            icon={<User className="h-4 w-4" />}
          />
          <Button
            className="bg-formality-primary flex items-center gap-2"
            onClick={addNewClient}
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau client</span>
          </Button>
        </div>
      </div>

      <div className="card-elegant w-full">
        <DataTable
          data={clients?.data || []}
          count={clients?.count}
          loading={isLoading}
          columns={[
            {
              key: "lastName",
              header: "Nom",
              sortable: true,
              align: "left",
              render: (value) => <p>{value ? value : "-"}</p>,
            },
            {
              key: "firstName",
              header: "Prénom",
              sortable: true,
              align: "left",
              render: (value) => (value ? value : "-"),
            },
            {
              key: "clientName",
              header: "Cient",
              sortable: true,
              align: "left",
              render: (value) => (value ? value : "-"),
            },
            {
              key: "email",
              header: "Email",
              sortable: true,
              align: "left",
              render: (value) => (value ? value : "-"),
            },
            {
              key: "phone",
              header: "Téléphone",
              sortable: true,
              align: "left",
              render: (value) => (value ? value : "-"),
            },

            {
              key: "creationPrice",
              header: "Tarif",
              sortable: true,
              align: "left",
              render: (value) => (value ? value : "-"),
            },
            {
              header: "Actions",
              render: (_, row) => (
                <ClientActions
                  client={row}
                  onEdit={handleEdit}
                  onArchive={handleArchive}
                />
              ),
            },
          ]}
          onRowClick={handleRowClick}
          page={paginationParams.page}
          perPage={paginationParams.perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      </div>

      <ClientForm
        client={selectedClient}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />

      <ClientDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        client={detailsClient}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onPressConfirm={async () => {
          if (selectedClient) {
            await ArchiveUnArchiveClientMutation.mutateAsync({
              id: selectedClient._id,
              isArchived: selectedClient.isArchived,
            });
            setIsConfirmModalOpen(false);
            setSelectedClient(null);
          }
        }}
        title={
          selectedClient?.isArchived
            ? "Désarchiver le client"
            : "Archiver le client"
        }
        description={
          selectedClient?.isArchived
            ? "Êtes-vous sûr de vouloir désarchiver ce client ?"
            : "Êtes-vous sûr de vouloir archiver ce client ?"
        }
      />
    </div>
  );
};

const ClientActions = ({
  client,
  onEdit,

  onArchive,
}: {
  client: ClientDto;
  onEdit: (client: ClientDto) => void;
  onArchive: (client: ClientDto) => void;
}) => (
  <TooltipProvider>
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(client);
            }}
          >
            <Pencil className="h-4 w-4 text-formality-primary" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Editer</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onArchive(client);
            }}
          >
            <Archive className="h-4 w-4 text-gray-500" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {client.isArchived ? "Désarchiver" : "Archiver"}
        </TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
);

export default Client;
