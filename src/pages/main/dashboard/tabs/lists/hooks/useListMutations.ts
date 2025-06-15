
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ListService } from "@/api-swagger/services/ListService";
import { ListDto } from "@/api-swagger";
import { toast } from "sonner";

export const useListMutations = () => {
  const queryClient = useQueryClient();

  const updateListMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ListDto> }) =>
      ListService.listControllerUpdate({ id, requestBody: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast.success("Liste mise à jour avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour de la liste");
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
      toast.success("Liste créée avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de la liste");
      console.error("Create error:", error);
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: (id: string) => ListService.listControllerRemove({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast.success("Liste supprimée avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression de la liste");
      console.error("Delete error:", error);
    },
  });

  return {
    updateListMutation,
    createListMutation,
    deleteListMutation,
  };
};
