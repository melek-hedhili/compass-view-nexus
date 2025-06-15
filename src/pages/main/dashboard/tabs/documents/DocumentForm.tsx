
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateDocumentDto,
  DocumentService,
  UpdateDocumentDto,
} from "@/api-swagger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  const [form, setForm] = useState<CreateDocumentDto>(initialForm);

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
      setForm({
        documentName: selectedDocument.documentName || "",
        shortName: selectedDocument.shortName || "",
        legalForm:
          selectedDocument.legalForm || CreateDocumentDto.legalForm.SCI,
        benefit: selectedDocument.benefit || CreateDocumentDto.benefit.CREATION,
        type: selectedDocument.type || CreateDocumentDto.type.INTERNAL,
      });
    } else {
      setForm(initialForm);
    }
  }, [selectedDocument]);

  // Create document
  const createDocumentMutation = useMutation({
    mutationFn: (data: CreateDocumentDto) =>
      DocumentService.documentControllerCreate({ requestBody: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document créé avec succès");
      onClose();
      setForm(initialForm);
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
      setForm(initialForm);
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour du document");
      console.error("Update error:", error);
    },
  });

  const handleSubmit = () => {
    if (editingId && selectedDocument) {
      updateDocumentMutation.mutate({
        _id: editingId,
        ...form,
      });
    } else {
      createDocumentMutation.mutate(form);
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
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                Nom du document
              </Label>
              <Input
                value={form.documentName}
                onChange={(e) =>
                  setForm({ ...form, documentName: e.target.value })
                }
                className="border-gray-300"
                placeholder="Statuts constitutifs"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                Raccourci
              </Label>
              <Input
                value={form.shortName}
                onChange={(e) =>
                  setForm({ ...form, shortName: e.target.value })
                }
                className="border-gray-300"
                placeholder="Statut"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                Forme juridique
              </Label>
              <Select
                value={form.legalForm || ""}
                onValueChange={(val) =>
                  setForm({
                    ...form,
                    legalForm: val as CreateDocumentDto.legalForm,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Forme juridique" />
                </SelectTrigger>
                <SelectContent>
                  {legalFormOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                Prestation
              </Label>
              <Select
                value={form.benefit || ""}
                onValueChange={(val) =>
                  setForm({
                    ...form,
                    benefit: val as CreateDocumentDto.benefit,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Prestation" />
                </SelectTrigger>
                <SelectContent>
                  {benefitOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                Utilisation
              </Label>
              <Select
                value={form.type || ""}
                onValueChange={(val) =>
                  setForm({ ...form, type: val as CreateDocumentDto.type })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Utilisation" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              className="bg-formality-primary hover:bg-formality-primary/90 text-white"
              onClick={handleSubmit}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
