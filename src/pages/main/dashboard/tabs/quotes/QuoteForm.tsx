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
  SheetDescription,
} from "@/components/ui/sheet";
import { Plus, X } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { ControlledCheckboxGroup } from "@/components/ui/controlled/controlled-checkbox-group/controlled-checkbox-group";
import { ControlledRadioGroup } from "@/components/ui/controlled/controlled-radio-group/controlled-radio-group";
import { Form } from "@/components/ui/form";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select/controlled-select";
import { useMutation } from "@tanstack/react-query";
import {
  CreateDataDto,
  DataDto,
  DataService,
  PaginatedDataDto,
  PaginatedTreeDto,
  TreeDto,
} from "@/api-swagger";
import { toast } from "sonner";

interface QuoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingData: DataDto | null;
  dataItems: PaginatedDataDto | undefined;
  onSave: (formData: any) => void;
  trees: PaginatedTreeDto | undefined;
}
type QuoteFormValues = CreateDataDto;

export const QuoteForm: React.FC<QuoteFormProps> = ({
  isOpen,
  onClose,
  editingData,
  dataItems,
  onSave,
  trees,
}) => {
  const methods = useForm<QuoteFormValues>({
    defaultValues: {
      fieldName: undefined,
      type: undefined,
      legalForm: undefined,
      documents: [{ documentId: "", script: "" }],
      isControlField: undefined,
      isModifiable: undefined,
      isMultiItem: undefined,
      treeId: undefined,
      dependsOnId: undefined,
      listId: undefined,
    },
  });

  useEffect(() => {
    if (editingData) {
      methods.reset({
        ...editingData,
      });
    }
  }, [editingData]);

  const addDocument = () => {
    console.log("addDocument");
    methods.setValue("documents", [
      ...methods.getValues("documents"),
      { documentId: "", script: "" },
    ]);
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = [...methods.getValues("documents")];
    updatedDocuments.splice(index, 1);
    methods.setValue("documents", updatedDocuments);
  };

  const handleSave = () => {
    onSave(methods.getValues());
  };
  const onSubmit: SubmitHandler<QuoteFormValues> = (data) => {
    console.log(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[450px] sm:w-[900px] p-0 overflow-y-auto">
        <SheetHeader className="p-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold text-formality-accent">
            {editingData ? "Modifier la donnée" : "Nouvelle donnée"}
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Remplissez les informations de la donnée ci-dessous.
          </SheetDescription>
        </SheetHeader>

        <Form methods={methods} onSubmit={onSubmit}>
          <div className="p-6 space-y-6">
            <ControlledInput
              name="fieldName"
              label="Donnée N°"
              placeholder="Donnée N°"
              required
            />
            <ControlledCheckboxGroup
              name="legalForm"
              label="Forme juridique"
              direction="row"
              checkboxClassName="text-formality-primary focus:ring-formality-primary/20 h-4 w-4"
              options={[
                { label: "SCI", value: "SCI" },
                { label: "EURL / SARL", value: "EURL / SARL" },
                { label: "SASU / SAS", value: "SASU / SAS" },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Chat GPT
              </label>
              {methods.watch("documents").map((doc, index) => (
                <div key={index} className="mb-4">
                  {/* Labels row */}
                  <div className="grid grid-cols-12 gap-3 mb-1">
                    <div className="col-span-5 text-sm text-gray-600">
                      Document
                    </div>
                    <div className="col-span-6 text-sm text-gray-600">
                      Script
                    </div>
                    <div className="col-span-1" />
                  </div>

                  {/* Inputs row */}
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-5">
                      <ControlledSelect
                        name="documents.documentId"
                        label="Document"
                        placeholder="Document"
                        data={
                          dataItems?.data?.map((item) => ({
                            label: item.fieldName,
                            value: item._id!,
                          })) ?? []
                        }
                        getOptionValue={(option) => option?.value}
                        getOptionLabel={(option) => option.label}
                      />
                    </div>
                    <div className="col-span-6">
                      <ControlledInput
                        name="documents.script"
                        label="Script"
                        placeholder="Script"
                      />
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
                type="button"
                size="sm"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200"
                onClick={addDocument}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <ControlledRadioGroup
                name="type"
                label="Réponse"
                options={[
                  { label: "Texte libre", value: "STRING" },
                  { label: "Date", value: "DATE" },
                  { label: "Nombre", value: "NUMBER" },
                  { label: "Choix unique", value: "BOOLEAN" },
                  { label: "Choix multiple", value: "MULTIPLE_CHOICE" },
                ]}
                className="flex flex-wrap gap-4 mb-3"
                direction="row"
                required
              />
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-2">
                  <ControlledSelect
                    name="listId"
                    placeholder="Liste"
                    data={[
                      { label: "Liste1", value: "list1" },
                      { label: "Liste2", value: "list2" },
                    ]}
                    getOptionValue={(option) => option.value}
                    getOptionLabel={(option) => option.label}
                  />
                </div>
                <div className="col-span-10">
                  <ControlledInput
                    name="listValue"
                    placeholder="Valeur N°1, Valeur N°2, Valeur N°3"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-3">
                Arborescence
              </label>
              <div className="grid grid-cols-3 gap-3">
                <ControlledSelect
                  name="treeStructure.rubrique"
                  label="Rubrique"
                  placeholder="Rubrique"
                  data={
                    trees?.data
                      ?.filter((item) => item.type === TreeDto.type.SECTION)
                      .map((item) => ({
                        label: item.fieldName,
                        value: item._id!,
                      })) ?? []
                  }
                  getOptionValue={(option) => option.value}
                  getOptionLabel={(option) => option.label}
                />
                <ControlledSelect
                  name="treeStructure.famille"
                  label="Famille"
                  placeholder="Famille"
                  data={
                    trees?.data
                      ?.filter((item) => item.type === TreeDto.type.TITLE)
                      .map((item) => ({
                        label: item.fieldName,
                        value: item._id!,
                      })) ?? []
                  }
                  getOptionValue={(option) => option.value}
                  getOptionLabel={(option) => option.label}
                />

                <ControlledSelect
                  name="treeStructure.sousFamille"
                  label="Sous-famille"
                  placeholder="Sous-famille"
                  data={
                    trees?.data
                      ?.filter((item) => item.type === TreeDto.type.SUB_TITLE)
                      .map((item) => ({
                        label: item.fieldName,
                        value: item._id!,
                      })) ?? []
                  }
                  getOptionValue={(option) => option.value}
                  getOptionLabel={(option) => option.label}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-3">
                Dépendance
              </label>
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4">
                  <ControlledSelect
                    name="dependsOnId"
                    label="Donnée N°X"
                    placeholder="Donnée N°X"
                    data={
                      dataItems?.data?.map((item) => ({
                        label: item.fieldName,
                        value: item._id!,
                      })) ?? []
                    }
                    getOptionValue={(option) => option.value}
                    getOptionLabel={(option) => option.label}
                  />
                </div>
                <div className="col-span-8">
                  <ControlledSelect
                    name="dependsOnValueId"
                    label="Valeur de la donnée N°X"
                    placeholder="Valeur de la donnée N°X"
                    data={
                      dataItems?.data?.map((item) => ({
                        label: item.fieldName,
                        value: item._id!,
                      })) ?? []
                    }
                    getOptionValue={(option) => option.value}
                    getOptionLabel={(option) => option.label}
                  />
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

            <div className="flex justify-end pt-6 border-t border-gray-100">
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
