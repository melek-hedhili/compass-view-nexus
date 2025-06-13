import { useState } from "react";
import AppLayout from "../../../../components/layout/AppLayout";
import { NavTabs } from "../../../../components/dashboard/NavTabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Database, X, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface DataItem {
  id: string;
  name: string;
  legalForms: string[];
  arborescence: string;
  modifiable: boolean;
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

  const [formData, setFormData] = useState({
    dataNumber: "",
    legalForm: "",
    documents: [{ type: "ComboBox", script: "" }],
    responseType: "multiple", // Default to multiple choice as shown in the image
    listValue: "",
    treeStructure: ["", "", ""],
    dependency: "",
    dependencyValue: "",
    selectedValues: [],
  });

  const addDocument = () => {
    setFormData({
      ...formData,
      documents: [...formData.documents, { type: "ComboBox", script: "" }],
    });
  };

  const handleOpenDrawer = (data?: DataItem) => {
    if (data) {
      setEditingData(data);
      setFormData({
        ...formData,
        dataNumber: data.name,
        responseType: data.responseType,
        // Set other form values from data if needed
      });
    } else {
      setEditingData(null);
      setFormData({
        ...formData,
        dataNumber: "",
        responseType: "multiple",
        // Reset other form values
      });
    }
    setIsSheetOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsSheetOpen(false);
    setEditingData(null);
  };

  const handleSaveData = () => {
    if (editingData) {
      // Update existing data
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
      // Add new data
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

  const handleDeleteData = (id: string) => {
    if (viewingArchived) {
      setArchivedItems(archivedItems.filter((item) => item.id !== id));
    } else {
      setDataItems(dataItems.filter((item) => item.id !== id));
    }
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = [...formData.documents];
    updatedDocuments.splice(index, 1);
    setFormData({
      ...formData,
      documents: updatedDocuments,
    });
  };

  const getLegalFormLabels = (legalForms: string[]) => {
    if (legalForms.length === 5) return "Toutes les formes";
    return legalForms.join(", ");
  };

  const getResponseTypeLabel = (type: string) => {
    switch (type) {
      case "text":
        return "Texte libre";
      case "date":
        return "Date";
      case "number":
        return "Nombre";
      case "unique":
        return "Choix unique";
      case "multiple":
        return "Choix multiple";
      default:
        return type;
    }
  };

  return (
    <AppLayout>
      <NavTabs />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(viewingArchived ? archivedItems : dataItems).map((data) => (
          <Card
            key={data.id}
            className="border border-gray-100 hover:shadow-md transition-shadow rounded-lg overflow-hidden"
          >
            <CardContent className="p-6 relative pb-20">
              {" "}
              {/* Added pb-20 for button space and relative positioning */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{data.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {data.arborescence}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium mb-1">Formes juridiques:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {getLegalFormLabels(data.legalForms)}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium mb-1">Type de réponse:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {getResponseTypeLabel(data.responseType)}
                  </span>
                </div>
              </div>
              {data.modifiable && (
                <div className="mt-2">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    Modifiable
                  </span>
                </div>
              )}
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center py-2 border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <code className="text-gray-500">&lt;&gt;</code>
                    <span>Scripts ChatGPT</span>
                  </div>
                  <span className="text-lg">▼</span>
                </Button>
              </div>
              {/* Fixed buttons container */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                {viewingArchived ? (
                  <Button
                    variant="outline"
                    className="text-green-500 border-green-500 hover:bg-green-50 hover:text-green-600"
                    onClick={() => handleRestoreData(data.id)}
                  >
                    Restaurer
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleArchiveData(data.id)}
                  >
                    Archiver
                  </Button>
                )}
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => handleOpenDrawer(data)}
                  disabled={viewingArchived}
                >
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Form Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-[800px] sm:w-[900px] p-6 overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold flex justify-between items-center">
              {editingData ? "Modifier la donnée" : "Nouvelle donnée"}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                {editingData
                  ? `Donnée N°${editingData.id}`
                  : `Donnée N°${dataItems.length + 1}`}
              </label>
              <Input
                value={formData.dataNumber}
                onChange={(e) =>
                  setFormData({ ...formData, dataNumber: e.target.value })
                }
                className="border-gray-300 max-w-full"
                placeholder="Texte"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Forme juridique
              </label>
              <div className="flex flex-wrap gap-2">
                {["SCI", "EURL / SARL", "SASU / SAS"].map((option) => (
                  <div
                    key={option}
                    className="rounded-full px-3 py-1 text-sm border bg-white border-gray-200"
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        id={`legalForm-${option}`}
                        className="text-formality-primary focus:ring-formality-primary/20 h-4 w-4"
                      />
                      <span className="text-gray-800">{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Chat GPT
              </label>
              {formData.documents.map((doc, index) => (
                <div key={index} className="mb-4">
                  {/* Labels row */}
                  <div className="grid grid-cols-12 gap-3 mb-1">
                    <div className="col-span-5 text-sm text-gray-600">
                      Document
                    </div>
                    <div className="col-span-6 text-sm text-gray-600">
                      Script
                    </div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Inputs row */}
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-5">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="ComboBox" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="combobox">ComboBox</SelectItem>
                          <SelectItem value="option1">Option 1</SelectItem>
                          <SelectItem value="option2">Option 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-6">
                      <Input />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => removeDocument(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200"
                onClick={addDocument}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-3">
                Réponse
              </label>
              <RadioGroup
                value={formData.responseType}
                onValueChange={(value) =>
                  setFormData({ ...formData, responseType: value })
                }
                className="flex flex-wrap gap-4 mb-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text">Texte libre</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="date" id="date" />
                  <Label htmlFor="date">Date</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="number" id="number" />
                  <Label htmlFor="number">Nombre</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unique" id="unique" />
                  <Label htmlFor="unique">Choix unique</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multiple" id="multiple" />
                  <Label htmlFor="multiple">Choix multiple</Label>
                </div>
              </RadioGroup>
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Liste" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="list">Liste</SelectItem>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-10">
                  <Input placeholder="Valeur N°1, Valeur N°2, Valeur N°3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-3">
                Arborescence
              </label>
              <div className="grid grid-cols-3 gap-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="ComboBox" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="combobox">ComboBox</SelectItem>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="ComboBox" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="combobox">ComboBox</SelectItem>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="ComboBox" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="combobox">ComboBox</SelectItem>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-3">
                Dépendance
              </label>
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Donnée N°X" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="data1">Donnée N°X</SelectItem>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-8">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Valeur de la donnée N°X" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="value1">Valeur N°1</SelectItem>
                      <SelectItem value="value2">Valeur N°2</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="value1" />
                      <Label htmlFor="value1">Valeur N°1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="value2" />
                      <Label htmlFor="value2">Valeur N°2</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                className="bg-formality-primary hover:bg-formality-primary/90 text-white"
                onClick={handleSaveData}
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

export default Quotes;
