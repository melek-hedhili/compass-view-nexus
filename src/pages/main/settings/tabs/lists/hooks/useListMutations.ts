import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ListService } from "@/api-swagger/services/ListService";
import { type ListDto } from "@/api-swagger";
import { toast } from "sonner";

export const useListMutations = () => {
  const queryClient = useQueryClient();

  const updateListMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ListDto> }) =>
      ListService.listControllerUpdate({ id, requestBody: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast.success("Liste modifiée avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la modification de la liste");
      console.error("Update error:", error);
    },
  });

  const createListMutation = useMutation({
    mutationFn: (data: Partial<ListDto>) =>
      ListService.listControllerCreate({
        requestBody: {
          fieldName: data.fieldName || "",
          values: data.values || [],
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast.success("Nouvelle liste enregistrée");
    },
    onError: (error) => {
      toast.error("Erreur lors de l'enregistrement de la liste");
      console.error("Create error:", error);
    },
  });

  const archiveListMutation = useMutation({
    mutationFn: ({ id, type }: { id: string; type: "archive" | "unarchive" }) =>
      ListService.listControllerUpdate({
        id,
        requestBody: { isArchived: type === "archive" },
      }),
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast.success(
        type === "archive"
          ? "Liste archivée avec succès"
          : "Liste restaurée avec succès"
      );
    },
    onError: (error) => {
      toast.error("Erreur lors de l'archivage de la liste");
      console.error("Archive error:", error);
    },
  });

  return {
    updateListMutation,
    createListMutation,
    archiveListMutation,
  };
};
