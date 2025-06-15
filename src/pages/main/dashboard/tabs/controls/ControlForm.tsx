import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

interface Control {
  id: string;
  number: number;
  description: string;
  document: string;
  legalForms: string[];
  controlType: string;
  errorMessage: string;
  rule: string;
  isModifiable: boolean;
}

interface ControlFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  control: Control | null;
  legalFormOptions: string[];
  controlTypes: string[];
  onSave: (control: Control) => void;
}

export const ControlForm: React.FC<ControlFormProps> = ({
  isOpen,
  onClose,
  title,
  control,
  legalFormOptions,
  controlTypes,
  onSave,
}) => {
  const [formData, setFormData] = useState<Control | null>(control);

  useEffect(() => {
    setFormData(control);
  }, [control]);

  if (!formData) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleLegalFormChange = (form: string, checked: boolean) => {
    let updatedForms = [...formData.legalForms];

    if (checked) {
      updatedForms.push(form);
    } else {
      updatedForms = updatedForms.filter((f) => f !== form);
    }

    setFormData({ ...formData, legalForms: updatedForms });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl md:max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Remplissez les informations du contrôle ci-dessous.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                Contrôle N°{formData.number}
              </span>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border border-gray-700"
                placeholder="Description du contrôle"
              />
            </div>

            <Separator
              orientation="vertical"
              className="hidden md:block h-10"
            />

            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-500">
                Document contrôlé
              </Label>
              <Input
                name="document"
                value={formData.document}
                onChange={handleChange}
                className="border border-gray-700 mt-1"
                placeholder="Document"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Label className="block text-sm font-medium text-gray-500 mb-3">
                Forme juridique
              </Label>
              <div className="flex flex-wrap gap-6">
                {legalFormOptions.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      id={`legalForm-${option}`}
                      checked={formData.legalForms.includes(option)}
                      onCheckedChange={(checked) =>
                        handleLegalFormChange(option, checked === true)
                      }
                      className="text-formality-primary focus:ring-formality-primary/20"
                    />
                    <Label
                      htmlFor={`legalForm-${option}`}
                      className="text-sm text-gray-700"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="hidden md:block h-24"
            />

            <div className="flex-1">
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                Type de contrôle
              </Label>
              <select
                name="controlType"
                value={formData.controlType}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-formality-primary/20 focus:border-formality-primary transition-all"
              >
                {controlTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-2">
                OK si
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select className="border border-gray-700 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-formality-primary/20 focus:border-formality-primary transition-all">
                  <option>Document</option>
                </select>
                <select className="border border-gray-700 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-formality-primary/20 focus:border-formality-primary transition-all">
                  <option>Donnée</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-2">
                Comparaison
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select className="border border-gray-700 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-formality-primary/20 transition-all">
                  <option>Document</option>
                </select>
                <select className="border border-gray-700 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-formality-primary/20 focus:border-formality-primary transition-all">
                  <option>Donnée</option>
                </select>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Checkbox
                  id="checkDate"
                  className="text-formality-primary focus:ring-formality-primary/20"
                />
                <Label htmlFor="checkDate" className="text-sm text-gray-700">
                  Date du jour
                </Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-500 mb-1">
              Message d'erreur
            </Label>
            <Textarea
              name="errorMessage"
              value={formData.errorMessage}
              onChange={handleChange}
              className="border border-gray-700 resize-none"
              rows={2}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-500 mb-1">
              Règle
            </Label>
            <Textarea
              name="rule"
              value={formData.rule}
              onChange={handleChange}
              className="border border-gray-700 resize-none"
              rows={2}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isModifiable"
              checked={formData.isModifiable}
              onCheckedChange={(checked) =>
                handleCheckboxChange("isModifiable", checked === true)
              }
              className="text-formality-primary focus:ring-formality-primary/20"
            />
            <Label htmlFor="isModifiable" className="text-sm text-gray-700">
              Modifiable
            </Label>
          </div>

          <SheetFooter className="flex justify-end gap-3 pt-4">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </SheetClose>
            <Button
              type="submit"
              className="bg-formality-primary hover:bg-formality-primary/90 text-white"
            >
              Enregistrer
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
