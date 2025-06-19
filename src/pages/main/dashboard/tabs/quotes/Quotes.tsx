import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Database, Search } from "lucide-react";
import { QuotesGrid } from "./QuotesGrid";
import { QuoteForm } from "./QuoteForm";
import {
  CreateDataDto,
  DataDto,
  DataService,
  TreeService,
  UpdateDataDto,
} from "@/api-swagger";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface DataItem {
  id: string;
  name: string;
  legalForms: string[];
  arborescence: string;
  modifiable: boolean;
  responseType: string;
}

interface FormData {
  dataNumber: string;
  responseType: string;
}

const Quotes = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingData, setEditingData] = useState<DataDto | null>(null);
  const [viewingArchived, setViewingArchived] = useState(false);
  const { data: dataItems } = useQuery({
    queryKey: ["dataItems"],
    queryFn: () => DataService.dataControllerFindAll({}),
  });
  const { data: trees } = useQuery({
    queryKey: ["trees"],
    queryFn: () => TreeService.treeControllerFindAll({}),
  });
  const updateDataItems = useMutation({
    mutationFn: (data: UpdateDataDto) =>
      DataService.dataControllerUpdate({
        id: data._id!,
        requestBody: data,
      }),
    onSuccess: () => {
      toast.success("Donnée mise à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de la donnée");
    },
  });
  const createDataMutation = useMutation({
    mutationFn: (data: CreateDataDto) =>
      DataService.dataControllerCreate({
        requestBody: data,
      }),
    onSuccess: () => {
      toast.success("Donnée créée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création de la donnée");
    },
  });
  const deleteDataMutation = useMutation({
    mutationFn: (id: string) =>
      DataService.dataControllerRemove({
        id: id,
      }),
    onSuccess: () => {
      toast.success("Donnée supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la donnée");
    },
  });

  const handleOpenDrawer = (data: DataDto | null) => {
    if (data) {
      setEditingData(data);
    } else {
      setEditingData(null);
    }
    setIsSheetOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsSheetOpen(false);
    setEditingData(null);
  };

  const handleSaveData = (formData: CreateDataDto) => {
    if (editingData) {
      updateDataItems.mutate({
        ...formData,
        _id: editingData._id!,
      });
    } else {
      createDataMutation.mutate(formData);
    }
    handleCloseDrawer();
  };

  const handleArchiveData = (id: string) => {
    const itemToArchive = dataItems?.data?.find((item) => item._id === id);
    if (itemToArchive) {
      updateDataItems.mutate({
        ...itemToArchive,
        isArchived: true,
      });
    }
  };

  const handleDeleteData = (id: string) => {
    deleteDataMutation.mutate(id);
  };

  const handleRestoreData = (id: string) => {
    const itemToRestore = dataItems?.data?.find((item) => item._id === id);
    if (itemToRestore) {
      updateDataItems.mutate({
        ...itemToRestore,
        isArchived: false,
      });
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-6">
        <div className="flex items-center mb-4 md:mb-0"></div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 border border-gray-200"
            />
          </div>
          <Button
            variant="outline"
            className={`flex items-center gap-2 ${
              viewingArchived ? "bg-gray-100" : ""
            }`}
            onClick={() => setViewingArchived(!viewingArchived)}
          >
            <Database className="h-4 w-4" />
            <span>
              {viewingArchived ? "Liste principale" : "Liste des archives"}
            </span>
          </Button>

          <Button
            className="bg-formality-primary hover:bg-formality-primary/90 text-white flex items-center gap-2"
            onClick={() => handleOpenDrawer(null)}
            disabled={viewingArchived}
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle donnée</span>
          </Button>
        </div>
      </div>

      <QuotesGrid
        dataItems={viewingArchived ? dataItems : dataItems}
        viewingArchived={viewingArchived}
        onEdit={handleOpenDrawer}
        onArchive={handleArchiveData}
        onRestore={handleRestoreData}
      />

      <QuoteForm
        isOpen={isSheetOpen}
        onClose={handleCloseDrawer}
        editingData={editingData}
        dataItems={dataItems}
        trees={trees}
        onSave={handleSaveData}
      />
    </div>
  );
};

export default Quotes;
