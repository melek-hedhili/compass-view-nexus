import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DataService } from "@/api-swagger/services/DataService";
import { toast } from "sonner";
import { type CreateDataDto, type UpdateDataDto } from "@/api-swagger";

export const useQuoteMutations = ({
  onClose,
  methods,
}: {
  onClose?: () => void;
  methods?: any; // Use correct type if you want
} = {}) => {
  const queryClient = useQueryClient();

  // Archive/Unarchive mutation
  const archiveDataMutation = useMutation({
    mutationFn: ({ id, type }: { id: string; type: "archive" | "unarchive" }) =>
      DataService.dataControllerUpdate({
        id,
        requestBody: { isArchived: type === "archive" },
      }),
    onSuccess: async (_, { type }) => {
      await queryClient.invalidateQueries({ queryKey: ["data"], exact: false });
      await queryClient.invalidateQueries({ queryKey: ["dataItems"] });
      toast.success(
        type === "archive"
          ? "Donnée archivée avec succès"
          : "Donnée restaurée avec succès"
      );
      onClose?.();
      methods?.reset?.();
    },
    onError: () => {
      toast.error("Erreur lors de l'archivage de la donnée");
    },
  });

  // Create mutation
  const createDataMutation = useMutation({
    mutationFn: (data: CreateDataDto) =>
      DataService.dataControllerCreate({ requestBody: data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dataItems"] });
      await queryClient.invalidateQueries({ queryKey: ["data"] });
      toast.success("Nouvelle donnée enregistrée");
      onClose?.();
      methods?.reset?.();
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement de la donnée");
    },
  });

  // Update mutation
  const updateDataItems = useMutation({
    mutationFn: (data: UpdateDataDto) =>
      DataService.dataControllerUpdate({ id: data._id!, requestBody: data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["data"] });
      await queryClient.invalidateQueries({ queryKey: ["dataItems"] });
      toast.success("Donnée modifiée ");
      onClose?.();
      methods?.reset?.();
    },
    onError: () => {
      toast.error("Erreur lors de la modification de la donnée");
    },
  });

  return {
    archiveDataMutation,
    createDataMutation,
    updateDataItems,
  };
};
