import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Database, Search } from "lucide-react";
import { QuotesGrid } from "./QuotesGrid";
import { QuoteForm } from "./QuoteForm";

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
  const [editingData, setEditingData] = useState<DataItem | null>(null);
  const [viewingArchived, setViewingArchived] = useState(false);
  const [dataItems, setDataItems] = useState<DataItem[]>([
    {
      id: "1",
      name: "Dénomination sociale",
      legalForms: ["SAS", "SARL", "EURL", "SA", "SCI"],
      arborescence: "Informations générales > Identité",
      modifiable: true,
      responseType: "text",
    },
    {
      id: "2",
      name: "Capital social",
      legalForms: ["SAS", "SARL", "EURL"],
      arborescence: "Informations générales > Capital",
      modifiable: true,
      responseType: "number",
    },
    {
      id: "3",
      name: "Date de création",
      legalForms: ["SAS", "SARL", "EURL", "SCI"],
      arborescence: "Informations générales > Dates",
      modifiable: false,
      responseType: "date",
    },
    {
      id: "4",
      name: "Type d'activité",
      legalForms: ["SAS", "SARL", "EURL", "SA", "SCI"],
      arborescence: "Activité > Classification",
      modifiable: true,
      responseType: "multiple",
    },
  ]);

  const [archivedItems, setArchivedItems] = useState<DataItem[]>([]);

  const handleOpenDrawer = (data?: DataItem) => {
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

  const handleSaveData = (formData: FormData) => {
    if (editingData) {
      setDataItems(
        dataItems.map((item) =>
          item.id === editingData.id
            ? {
                ...item,
                name: formData.dataNumber,
                responseType: formData.responseType,
              }
            : item
        )
      );
    } else {
      setDataItems([
        ...dataItems,
        {
          id: (dataItems.length + 1).toString(),
          name: formData.dataNumber,
          legalForms: ["SAS", "SARL", "EURL"],
          arborescence: "Informations générales > Identité",
          modifiable: true,
          responseType: formData.responseType,
        },
      ]);
    }
    handleCloseDrawer();
  };

  const handleArchiveData = (id: string) => {
    const itemToArchive = dataItems.find((item) => item.id === id);
    if (itemToArchive) {
      setArchivedItems([...archivedItems, itemToArchive]);
      setDataItems(dataItems.filter((item) => item.id !== id));
    }
  };

  const handleRestoreData = (id: string) => {
    const itemToRestore = archivedItems.find((item) => item.id === id);
    if (itemToRestore) {
      setDataItems([...dataItems, itemToRestore]);
      setArchivedItems(archivedItems.filter((item) => item.id !== id));
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
            onClick={() => handleOpenDrawer()}
            disabled={viewingArchived}
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle donnée</span>
          </Button>
        </div>
      </div>

      <QuotesGrid
        dataItems={viewingArchived ? archivedItems : dataItems}
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
        onSave={handleSaveData}
      />
    </div>
  );
};

export default Quotes;
