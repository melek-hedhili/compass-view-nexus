import { useEffect, useState } from "react";
import AppLayout from "../../../../components/layout/AppLayout";
import { NavTabs } from "../../../../components/dashboard/NavTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import {
  CreateDocumentDto,
  DocumentDto,
  DocumentService,
  UpdateDocumentDto,
} from "@/api-swagger";
import { useQueryParams } from "@/hooks/use-query-params";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

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

type DocumentForm = CreateDocumentDto;

const Documents = () => {
  const { page = "1", perPage = "10" } = useQueryParams();
  const queryClient = useQueryClient();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DocumentForm>(initialForm);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all documents
  const { data: documentsData, isLoading } = useQuery({
    queryKey: ["documents", page, perPage],
    queryFn: () =>
      DocumentService.documentControllerFindAll({
        page,
        perPage,
      }),
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
      setForm({
        documentName: selectedDocument.documentName || "",
        shortName: selectedDocument.shortName || "",
        legalForm:
          selectedDocument.legalForm || CreateDocumentDto.legalForm.SCI,
        benefit: selectedDocument.benefit || CreateDocumentDto.benefit.CREATION,
        type: selectedDocument.type || CreateDocumentDto.type.INTERNAL,
      });
    }
  }, [selectedDocument]);

  // Create document
  const createDocumentMutation = useMutation({
    mutationFn: (data: CreateDocumentDto) =>
      DocumentService.documentControllerCreate({ requestBody: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document créé avec succès");
      setIsSheetOpen(false);
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
      setIsSheetOpen(false);
      setEditingId(null);
      setForm(initialForm);
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour du document");
      console.error("Update error:", error);
    },
  });
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
  const handleDeleteDocument = (docId: string) => {
    deleteDocumentMutation.mutateAsync(docId);
  };
  // Handlers
  const handleOpenDrawer = (docId?: string) => {
    if (docId) {
      setEditingId(docId);
    } else {
      setEditingId(null);
      setForm(initialForm);
    }
    setIsSheetOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsSheetOpen(false);
    setEditingId(null);
    setForm(initialForm);
  };

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
    <AppLayout>
      <NavTabs />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0"></div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex items-center gap-2 bg-formality-primary hover:bg-formality-primary/90 text-white"
              onClick={() => handleOpenDrawer()}
            >
              <Plus className="h-4 w-4" />
              <span>Document</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">Chargement...</div>
        ) : documentsData?.data?.length > 0 ? (
          documentsData?.data?.map((doc) => (
            <DocumentCard
              key={doc._id}
              doc={doc}
              handleOpenDrawer={handleOpenDrawer}
              handleDeleteDocument={handleDeleteDocument}
              deleteLoading={deleteDocumentMutation.isPending}
            />
          ))
        ) : (
          <div className="col-span-full bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
            Aucun document trouvé
          </div>
        )}
      </div>

      {/* Document Form Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
    </AppLayout>
  );
};
type DocumentCardProps = {
  doc: DocumentDto;
  handleOpenDrawer: (id: string) => void;
  handleDeleteDocument: (id: string) => void;
  deleteLoading: boolean;
};
const DocumentCard: React.FC<DocumentCardProps> = ({
  doc,
  handleOpenDrawer,
  handleDeleteDocument,
  deleteLoading,
}) => {
  return (
    <Card className="p-6 border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between min-h-[360px]">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">{doc.documentName}</h2>
          <p className="text-sm text-gray-500">Raccourci: {doc.shortName}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium mb-1">Formes juridiques:</p>
        <div className="flex flex-wrap gap-1 mt-1">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
            {doc.legalForm}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium mb-1">Prestations:</p>
        <div className="flex flex-wrap gap-1 mt-1">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
            {doc.benefit}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium mb-1">Utilisation:</p>
        <div className="flex flex-wrap gap-1 mt-1">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
            {doc.type}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-2 justify-end items-stretch sm:items-center">
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
          onClick={() => handleOpenDrawer(doc._id)}
        >
          Modifier
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
          onClick={() => handleDeleteDocument(doc._id)}
          loading={deleteLoading}
        >
          Supprimer
        </Button>
      </div>
    </Card>
  );
};
export default Documents;
