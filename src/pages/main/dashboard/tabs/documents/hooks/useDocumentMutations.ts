
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentService } from "@/api-swagger";
import { toast } from "sonner";

export const useDocumentMutations = () => {
  const queryClient = useQueryClient();

  const deleteDocumentMutation = useMutation({
    mutationFn: (docId: string) =>
      DocumentService.documentControllerRemove({ id: docId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document supprimé avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression du document");
      console.error("Delete error:", error);
    },
  });

  return {
    deleteDocumentMutation,
  };
};
