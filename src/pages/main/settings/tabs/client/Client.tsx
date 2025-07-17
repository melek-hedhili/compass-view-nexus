import { useEffect, useState } from "react";
import { ClientForm } from "@/pages/main/settings/tabs/client/ClientForm";
import { Button } from "@/components/ui/button";
import { Search, Plus, Pencil, Archive, User } from "lucide-react";
import { type ClientDto, ClientService } from "@/api-swagger";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
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

import { ArchiveFilterButton } from "@/components/ui/ArchiveFilterButton";
import { useClientMutations } from "./hooks/useClientMutations";

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
  const { ArchiveUnArchiveClientMutation } = useClientMutations({});
  // Consolidated pagination state
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    perPage: 10,
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
  const [detailsClientId, setDetailsClientId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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
    setDetailsClientId(client._id);
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
              header: "Client",
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
              render: (value) =>
                value ? value.match(/.{1,2}/g)?.join(" ") : "-",
            },

            {
              key: "creationPrice",
              header: "Tarif",
              sortable: true,
              align: "left",

              render: (value) => (value ? `${value}€` : "-"),
            },
            {
              key: "modificationPrice",
              header: "Tarif Modification",
              sortable: true,
              align: "center",
              alignHeader: "center",
              render: (value) => (value ? `${value}€` : "-"),
            },
            {
              key: "submissionPrice",
              header: "Tarif Soumission",
              sortable: true,
              align: "center",
              alignHeader: "center",
              render: (value) => (value ? `${value}€` : "-"),
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
        clientId={detailsClientId}
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
            ? "Restaurer le client"
            : "Archiver le client"
        }
        description={
          selectedClient?.isArchived
            ? "Êtes-vous sûr de vouloir restaurer ce client ?"
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
            disabled={client.isArchived}
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
          {client.isArchived ? "Restaurer" : "Archiver"}
        </TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
);

export default Client;
