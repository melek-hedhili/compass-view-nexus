import { type CreateDocumentDto, type UpdateDocumentDto } from "@/api-swagger";
import { DocumentService } from "@/api-swagger/services/DocumentService";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface UseDocumentMutationsProps {
  onClose?: () => void;
  methods?: UseFormReturn<CreateDocumentDto, any, CreateDocumentDto>;
  initialForm?: CreateDocumentDto;
}

export const useDocumentMutations = ({
  onClose,
  methods,
  initialForm,
}: UseDocumentMutationsProps) => {
  const queryClient = useQueryClient();
  const handleArchivingMutation = useMutation({
    mutationFn: ({
      docId,
      type,
    }: {
      docId: string;
      type: "archive" | "unarchive";
    }) =>
      DocumentService.documentControllerUpdate({
        id: docId,
        requestBody: { isArchived: type === "archive" },
      }),
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success(
        type === "archive"
          ? "Document archivé avec succès"
          : "Document restauré avec succès"
      );
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression du document");
      console.error("Delete error:", error);
    },
  });

  // Create document
  const createDocumentMutation = useMutation({
    mutationFn: (data: CreateDocumentDto) =>
      DocumentService.documentControllerCreate({ requestBody: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Nouveau document enregistré");
      onClose?.();
      methods?.reset(initialForm);
    },
    onError: (error: any) => {
      const errorMsg = error.body.response.message;
      if (errorMsg.includes("document name already exists")) {
        toast.error("Le document est déjà enregistré");
      } else {
        toast.error("Erreur lors de l'enregistrement du document");
      }
      console.error("Create error:", error);
    },
  });

  // Update document
  const updateDocumentMutation = useMutation({
    mutationFn: (data: UpdateDocumentDto) =>
      DocumentService.documentControllerUpdate({
        id: data._id,
        requestBody: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document modifié avec succès");
      onClose?.();
      methods?.reset(initialForm);
    },
    onError: (error: any) => {
      const errorMsg = error.body.response.message;
      if (errorMsg.includes("document name already exists")) {
        toast.error("Le document est déjà enregistré");
      } else {
        toast.error("Erreur lors de la modification du document");
      }
      console.error("Update error:", error);
    },
  });

  return {
    handleArchivingMutation,
    createDocumentMutation,
    updateDocumentMutation,
  };
};
