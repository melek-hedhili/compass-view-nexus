import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  type CreateDocumentDto,
  DocumentService,
  type UpdateDocumentDto,
} from "@/api-swagger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { type SubmitHandler, useForm } from "react-hook-form";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import {
  benefitOptions,
  legalFormOptions,
  typeOptions,
} from "./documents.utils";
import { ControlledCheckboxGroup } from "@/components/ui/controlled/controlled-checkbox-group/controlled-checkbox-group";
import { ControlledMultiSelect } from "@/components/ui/controlled/controlled-multiselect/controlled-multiselect";

const initialForm: CreateDocumentDto = {
  documentName: "",
  shortName: "",
  benefit: null,
  legalForm: null,
  type: null,
};

interface DocumentFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingId: string | null;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  isOpen,
  onClose,
  editingId,
}) => {
  const queryClient = useQueryClient();

  const methods = useForm<CreateDocumentDto>({
    defaultValues: initialForm,
  });

  // Fetch single document for editing
  const { data: selectedDocument } = useQuery({
    queryKey: ["document", editingId, isOpen],
    queryFn: () => DocumentService.documentControllerFindOne({ id: editingId }),
    enabled: !!editingId && isOpen,
  });

  // Populate form when selectedDocument changes
  useEffect(() => {
    if (selectedDocument) {
      methods.reset({
        documentName: selectedDocument.documentName || "",
        shortName: selectedDocument.shortName || "",
        legalForm: selectedDocument.legalForm,
        benefit: selectedDocument.benefit,
        type: selectedDocument.type,
      });
    } else {
      methods.reset(initialForm);
    }
  }, [selectedDocument, methods]);

  // Create document
  const createDocumentMutation = useMutation({
    mutationFn: (data: CreateDocumentDto) =>
      DocumentService.documentControllerCreate({ requestBody: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document créé avec succès");
      onClose();
      methods.reset(initialForm);
    },
    onError: (error: any) => {
      const errorMsg = error.body.response.message;
      if (errorMsg.includes("document name already exists")) {
        toast.error("Le document est déjà enregistré");
      } else {
        toast.error("Erreur lors de la création du document");
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
      toast.success("Document mis à jour avec succès");
      onClose();
      methods.reset(initialForm);
    },
    onError: (error: any) => {
      const errorMsg = error.body.response.message;
      if (errorMsg.includes("document name already exists")) {
        toast.error("Le document est déjà enregistré");
      } else {
        toast.error("Erreur lors de la mise à jour du document");
      }
      console.error("Update error:", error);
    },
  });

  const onSubmit: SubmitHandler<CreateDocumentDto> = (data) => {
    if (editingId) {
      updateDocumentMutation.mutate({
        _id: editingId,
        ...data,
      });
    } else {
      createDocumentMutation.mutate(data);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader className="p-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold text-formality-accent">
            {editingId ? "Modifier le document" : "Nouveau document"}
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Remplissez les informations du document ci-dessous.
          </SheetDescription>
        </SheetHeader>

        <Form methods={methods} onSubmit={onSubmit}>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ControlledInput
                name="shortName"
                label="Raccourci"
                placeholder="Tapez le raccourci"
                required
              />
              <ControlledInput
                name="documentName"
                label="Nom du document"
                placeholder="Entrez le nom du document"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ControlledMultiSelect
                name="legalForm"
                label="Forme juridique"
                required
                data={legalFormOptions}
                getOptionValue={(option) => option.value}
                getOptionLabel={(option) => option.label}
              />
              <ControlledMultiSelect
                name="type"
                label="Utilisation"
                data={typeOptions}
                getOptionValue={(option) => option.value}
                getOptionLabel={(option) => option.label}
              />
            </div>
            <ControlledCheckboxGroup
              name="benefit"
              label="Prestation"
              required
              options={benefitOptions}
              direction="row"
            />

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button
                type="submit"
                loading={
                  createDocumentMutation.isPending ||
                  updateDocumentMutation.isPending
                }
                className="bg-formality-primary hover:bg-formality-primary/90 text-white"
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
