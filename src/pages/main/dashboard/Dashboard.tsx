import { useEffect, useState } from "react";
import AppLayout from "../../../components/layout/AppLayout";
import NavTabs from "../../../components/dashboard/NavTabs";
import { ClientForm } from "../../../components/dashboard/ClientForm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ClientDto,
  ClientService,
  CreateClientDto,
  UpdateClientDto,
} from "@/api-swagger";
import { DataTable } from "@/components/ui/data-table";
import { useQueryParams } from "@/hooks/use-query-params";
import { useSocket } from "@/hooks/use-socket";

const Dashboard = () => {
  const [selectedClient, setSelectedClient] = useState<ClientDto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      console.log("connected to socket");
    });
    socket.on("disconnect", () => {
      console.log("disconnected from socket");
    });
    socket.on("newEmail", (event: string) => {
      console.log("newEmail event ----- ", event);
      toast.success("Nouveau mail reçu");
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    });
  }, [socket, queryClient]);
  console.log("socket ----- ", socket);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { page = "1", perPage = "10", sortField, sortOrder } = useQueryParams();

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients", page, perPage, sortField, sortOrder],
    queryFn: () =>
      ClientService.clientControllerFindAll({
        page,
        perPage,
        ...(sortField && { sortField }),
        ...(sortOrder && { sortOrder }),
      }),
  });

  console.log("Query params:", { page, perPage, sortField, sortOrder });
  console.log("API response:", clients);
  console.log("selected client ----- ", selectedClient);
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
  const updateClientMutation = useMutation({
    mutationFn: ({
      id,
      updateClientDto,
    }: {
      id: string;
      updateClientDto: UpdateClientDto;
    }) =>
      ClientService.clientControllerUpdate({
        id,
        requestBody: updateClientDto,
      }),
  });
  const handleSelectClient = (client: ClientDto) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
  };

  const handleSaveClient = async (clientData: ClientDto) => {
    // Here you would typically make an API call to save the client
    // For now, we'll just update the local state

    if (selectedClient) {
      // Update existing client
      updateClientMutation.mutateAsync({
        id: selectedClient._id,
        updateClientDto: selectedClient,
      });
      toast.success("Client mis à jour avec succès");
    } else {
      // Add new client
      createClientMutation.mutateAsync(clientData);
    }

    setSelectedClient(null);
    setIsDrawerOpen(false);
  };

  const filteredClients = clients?.data?.filter((client) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
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
    <AppLayout>
      <NavTabs />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-6">
        <div className="flex items-center mb-4 md:mb-0"></div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Recherche..."
              className="pl-10 input-elegant"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
              key: "creationPrice",
              header: "Tarif",
              sortable: true,
              align: "right",
            },
          ]}
          loading={isLoading}
          onRowClick={handleSelectClient}
        />
      </div>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-4xl overflow-y-auto lg:w-[900px]"
        >
          <div className="py-4">
            <ClientForm
              onSave={handleSaveClient}
              client={selectedClient}
              onCancel={handleCloseDrawer}
            />
          </div>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
};

export default Dashboard;
