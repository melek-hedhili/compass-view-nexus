import {
  ClientService,
  type CreateClientDto,
  type UpdateClientDto,
} from "@/api-swagger";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export const useClientMutations = ({
  onClose,
  methods,
  initialForm,
}: {
  onClose?: () => void;
  methods?: UseFormReturn<CreateClientDto, any, CreateClientDto>;
  initialForm?: CreateClientDto;
}) => {
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
          ? "Client restauré avec succès"
          : "Client archivé avec succès"
      );
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => {
      toast.error("Erreur lors de l'archivage/désarchivage du client");
    },
  });
  // Create client mutation
  const createClientMutation = useMutation({
    mutationFn: (data: CreateClientDto) =>
      ClientService.clientControllerCreate({ requestBody: data }),
    onSuccess: async () => {
      toast.success("Nouveau client enregistré");
      await queryClient.invalidateQueries({
        queryKey: ["clients"],
        exact: false,
      });
      onClose?.();
      methods?.reset(initialForm);
    },
    onError: (error) => {
      const errorMsg = (error as any).body.message;
      if (errorMsg.includes("client is already registered")) {
        toast.error("Le client est déjà enregistré");
      } else {
        toast.error("Erreur lors de l'enregistrement du client");
      }
    },
  });

  // Update client mutation
  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientDto }) =>
      ClientService.clientControllerUpdate({ id, requestBody: data }),
    onSuccess: async () => {
      toast.success("Client modifié");
      await queryClient.invalidateQueries({
        queryKey: ["clients"],
        exact: false,
      });
      onClose?.();
      methods?.reset(initialForm);
    },
    onError: (error) => {
      toast.error("Erreur lors de la modification du client");
      console.error("Error updating client:", error);
    },
  });

  return {
    ArchiveUnArchiveClientMutation,
    createClientMutation,
    updateClientMutation,
  };
};
