
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { CreatableAutoComplete } from "@/components/ui/creatable-autocomplete";
import { ListDto } from "@/api-swagger";
import { useListMutations } from "./hooks/useListMutations";

interface ListFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isNew: boolean;
  formData: Partial<ListDto>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ListDto>>>;
  selectedListId?: string | null;
}

export const ListForm: React.FC<ListFormProps> = ({
  isOpen,
  onClose,
  title,
  isNew,
  formData,
  setFormData,
  selectedListId,
}) => {
  const { createListMutation, updateListMutation } = useListMutations();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isNew) {
      createListMutation.mutate({
        fieldName: formData.fieldName || "",
        values: formData.values || [],
      });
    } else if (selectedListId) {
      updateListMutation.mutate({ id: selectedListId, data: formData });
    }
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[450px] sm:w-[900px] p-0 overflow-y-auto">
        <SheetHeader className="p-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold text-formality-accent">
            {title}
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Remplissez les informations de la liste ci-dessous.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={(e) => e.preventDefault()} className="p-6">
          <div className="space-y-6">
            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                Nom du champ
              </Label>
              <Input
                name="fieldName"
                value={formData.fieldName || ""}
                onChange={handleInputChange}
                className="border border-gray-700"
                placeholder="Nom du champ"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                Valeurs
              </Label>
              <CreatableAutoComplete
                values={formData.values || []}
                onChange={(values) =>
                  setFormData((prev) => ({ ...prev, values }))
                }
                placeholder="Tapez une valeur et appuyez sur Entrée"
                className="border border-gray-700"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </SheetClose>
              <Button
                type="button"
                onClick={handleSave}
                className="bg-formality-primary hover:bg-formality-primary/90 text-white"
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
