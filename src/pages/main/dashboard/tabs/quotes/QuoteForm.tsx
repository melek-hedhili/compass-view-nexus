import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, X } from "lucide-react";

interface DataItem {
  id: string;
  name: string;
  legalForms: string[];
  arborescence: string;
  modifiable: boolean;
  responseType: string;
}

interface QuoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingData: DataItem | null;
  dataItems: DataItem[];
  onSave: (formData: any) => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  isOpen,
  onClose,
  editingData,
  dataItems,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    dataNumber: "",
    legalForm: "",
    documents: [{ type: "ComboBox", script: "" }],
    responseType: "multiple",
    listValue: "",
    treeStructure: ["", "", ""],
    dependency: "",
    dependencyValue: "",
    selectedValues: [],
  });

  useEffect(() => {
    if (editingData) {
      setFormData({
        ...formData,
        dataNumber: editingData.name,
        responseType: editingData.responseType,
      });
    } else {
      setFormData({
        ...formData,
        dataNumber: "",
        responseType: "multiple",
      });
    }
  }, [editingData]);

  const addDocument = () => {
    setFormData({
      ...formData,
      documents: [...formData.documents, { type: "ComboBox", script: "" }],
    });
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = [...formData.documents];
    updatedDocuments.splice(index, 1);
    setFormData({
      ...formData,
      documents: updatedDocuments,
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
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
              onClick={handleSave}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
