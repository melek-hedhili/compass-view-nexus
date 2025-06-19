import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  CreateDocumentDto,
  DocumentService,
  UpdateDocumentDto,
} from "@/api-swagger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select/controlled-select";

const legalFormOptions = Object.values(CreateDocumentDto.legalForm);
const benefitOptions = Object.values(CreateDocumentDto.benefit);
const typeOptions = Object.values(CreateDocumentDto.type);

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
    queryKey: ["document", editingId],
    queryFn: () =>
      editingId
        ? DocumentService.documentControllerFindOne({ id: editingId })
        : null,
    enabled: !!editingId,
  });

  // Populate form when selectedDocument changes
  useEffect(() => {
    if (selectedDocument) {
      methods.reset({
        documentName: selectedDocument.documentName || "",
        shortName: selectedDocument.shortName || "",
        legalForm:
          selectedDocument.legalForm || CreateDocumentDto.legalForm.SCI,
        benefit: selectedDocument.benefit || CreateDocumentDto.benefit.CREATION,
        type: selectedDocument.type || CreateDocumentDto.type.INTERNAL,
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
    onError: (error) => {
      toast.error("Erreur lors de la création du document");
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
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour du document");
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
      <SheetContent
        side="right"
        className="w-[450px] sm:w-[900px] p-6 overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold flex justify-between items-center">
            {editingId ? "Modifier le document" : "Nouveau document"}
          </SheetTitle>
        </SheetHeader>
        <Form methods={methods} onSubmit={onSubmit}>
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ControlledInput
                name="shortName"
                label="Raccourci"
                placeholder="Raccourci"
                required
              />
              <ControlledInput
                name="documentName"
                label="Nom du document"
                placeholder="Nom du document"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <ControlledSelect
                name="benefit"
                label="Prestation"
                placeholder="Prestation"
                required
                data={benefitOptions}
                getOptionValue={(option) => option}
                getOptionLabel={(option) => option}
              />
              <ControlledSelect
                name="legalForm"
                label="Forme juridique"
                placeholder="Forme juridique"
                required
                data={legalFormOptions}
                getOptionValue={(option) => option}
                getOptionLabel={(option) => option}
              />
              <ControlledSelect
                name="type"
                label="Utilisation"
                placeholder="Utilisation"
                required
                data={typeOptions}
                getOptionValue={(option) => option}
                getOptionLabel={(option) => option}
              />
            </div>

            <div className="flex justify-end">
              <Button
                className="bg-formality-primary hover:bg-formality-primary/90 text-white"
                type="submit"
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
