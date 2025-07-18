import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Plus, X } from "lucide-react";
import { type FieldErrors, type SubmitHandler, useForm } from "react-hook-form";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { ControlledCheckboxGroup } from "@/components/ui/controlled/controlled-checkbox-group/controlled-checkbox-group";
import { ControlledRadioGroup } from "@/components/ui/controlled/controlled-radio-group/controlled-radio-group";
import { Form } from "@/components/ui/form";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select/controlled-select";
import {
  CreateDataDto,
  type DataDto,
  type PaginatedDataDto,
  type TreeDto,
  type UpdateDataDto,
  type ListDto,
  type DocumentDto,
} from "@/api-swagger";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GetSectionsResponseDto } from "@/api-swagger/models/GetSectionsResponseDto";
import type { GetTitlesResponseDto } from "@/api-swagger/models/GetTitlesResponseDto";
import { legalFormOptions } from "../documents/documents.utils";
import { responseTypeOptions } from "./quotes.utils";
import { ControlledMultiSelect } from "@/components/ui/controlled/controlled-multiselect/controlled-multiselect";
import { ControlledTextarea } from "@/components/ui/controlled/controlled-textarea/controlled-textarea";
import { useQuoteMutations } from "./hooks/useQuoteMutations";

interface QuoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingData: DataDto | null;
  dataItems: PaginatedDataDto | undefined;
  trees: TreeDto[] | undefined;
  lists: ListDto[] | undefined;
  documents: DocumentDto[] | undefined;
}

// Zod schema for form validation
const quoteFormSchema = z
  .object({
    fieldName: z.string().min(1, "Le nom de la donnée est requis"),
    type: z.nativeEnum(CreateDataDto.type, {
      required_error: "Le type de réponse est requis",
    }),
    legalForm: z
      .array(z.enum(["SARL", "SAS", "SCI", "EURL"]), {
        required_error: "La forme juridique est requise",
      })
      .optional(),
    documents: z
      .array(
        z.object({
          docs: z.object({
            label: z.string().optional(),
            value: z.string(),
          }),
          scripts: z.string().min(1, "Script requis"),
        })
      )
      .min(1, "Au moins un document est requis"),
    isControlField: z.boolean().optional(),
    isModifiable: z.boolean().optional(),
    isMultiItem: z.boolean().optional(),
    treeId: z.string().min(1, "La rubrique est requise"),
    familleId: z.string().min(1, "La famille est requise"),
    sousFamilleId: z.string().min(1, "La sous-famille est requise"),
    dependsOnId: z.string().optional(),
    listId: z.string().optional(),
    advancedOptions: z.array(z.string()).optional(),
    dependenceValue: z.array(z.string()).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === CreateDataDto.type.MULTIPLE_CHOICE &&
      (!data.listId || data.listId === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["listId"],
        message: "La liste associée est requise",
      });
    }
    // (keep any other custom validation here)
  });

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const QuoteForm: React.FC<QuoteFormProps> = ({
  isOpen,
  onClose,
  editingData,
  dataItems,
  trees,
  lists,
  documents,
}) => {
  const methods = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      fieldName: "",
      type: undefined,
      legalForm: undefined,
      documents: undefined,
      advancedOptions: [],
      treeId: undefined,
      familleId: undefined,
      sousFamilleId: undefined,
      dependsOnId: undefined,
      listId: undefined,
      dependenceValue: undefined,
    },
  });
  console.log("watch", methods.watch());

  const { createDataMutation, updateDataItems } = useQuoteMutations({
    onClose,
    methods,
  });

  const addDocument = () => {
    methods.setValue("documents", [
      ...methods.getValues("documents"),
      { docs: { label: undefined, value: undefined }, scripts: "" },
    ]);
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = [...methods.getValues("documents")];
    updatedDocuments.splice(index, 1);
    methods.setValue("documents", updatedDocuments);
  };
  const onError = (error: FieldErrors<QuoteFormValues>) => {
    console.log("error", error);
    if (error.dependenceValue && error.dependenceValue.message) {
      methods.setError("dependenceValue", {
        type: "manual",
        message: "La valeur de la donnée dépendante est requise",
      });
    } else {
      methods.clearErrors("dependenceValue");
    }
  };
  const onSubmit: SubmitHandler<QuoteFormValues> = (formData) => {
    console.log("formData", formData);

    // Custom validation for dependenceValue
    if (formData.dependsOnId) {
      const dependsOnItem = dataItems?.data?.find(
        (item) => item._id === formData.dependsOnId
      );

      if (dependsOnItem) {
        const hasOptions =
          dependsOnItem.type === CreateDataDto.type.SINGLE_CHOICE ||
          (dependsOnItem.type === CreateDataDto.type.MULTIPLE_CHOICE &&
            lists?.find((list) => list._id === dependsOnItem.list?._id)?.values
              .length > 0);
        console.log("hasOptions", hasOptions);
        console.log("formData.dependenceValue", formData.dependenceValue);
        if (
          hasOptions &&
          (!formData.dependenceValue || formData.dependenceValue.length === 0)
        ) {
          methods.setError("dependenceValue", {
            type: "manual",
            message: "La valeur de la donnée dépendante est requise",
          });
          return;
        }

        // Additional validation: check if the current value is valid for the new dependency type
        if (formData.dependenceValue && formData.dependenceValue.length > 0) {
          if (dependsOnItem.type === CreateDataDto.type.MULTIPLE_CHOICE) {
            // For MULTIPLE_CHOICE, value should be in the list values
            const listValues =
              lists?.find((list) => list._id === dependsOnItem.list?._id)
                ?.values || [];
            if (!listValues.includes(formData.dependenceValue[0])) {
              methods.setError("dependenceValue", {
                type: "manual",
                message:
                  "La valeur sélectionnée n'est pas valide pour cette liste",
              });
              return;
            }
          }
        }
      }
    }

    const advancedOptions = formData.advancedOptions || [];
    const isModifiable = advancedOptions.includes("isModifiable");
    const isControlField = advancedOptions.includes("isControlField");
    const isMultiItem = advancedOptions.includes("isMultiItem");
    // Build the submission object with correct type
    const submission: CreateDataDto | UpdateDataDto = {
      ...formData,
      //send the last id of selected tree, famille and sousFamille
      treeId: formData.sousFamilleId,

      type: formData.type as UpdateDataDto.type,
      legalForm: formData.legalForm,
      documents: formData.documents.map((doc) => ({
        documentId: doc.docs.value,
        script: doc.scripts,
      })),
      isModifiable,
      isControlField,
      isMultiItem,
    };
    if (formData.dependenceValue !== undefined) {
      (submission as CreateDataDto).dependenceValue = formData.dependenceValue;
    }
    if (editingData) {
      updateDataItems.mutateAsync({
        ...(submission as UpdateDataDto),
        _id: editingData._id,
      });
    } else {
      createDataMutation.mutate(submission as CreateDataDto);
    }
  };

  // --- CASCADING SELECTS LOGIC ---
  const rubriqueOptions: GetSectionsResponseDto[] =
    (trees as GetSectionsResponseDto[]) || [];
  const selectedRubrique = rubriqueOptions.find(
    (r) => r._id === methods.watch("treeId")
  );
  const familleOptions: GetTitlesResponseDto[] = selectedRubrique?.titles || [];
  const selectedFamille = familleOptions.find(
    (f) => f._id === methods.watch("familleId")
  );
  const sousFamilleOptions = selectedFamille?.subtitles || [];

  const ReponseType = methods.watch("type");
  const dependsOnId = dataItems?.data?.find(
    (item) => item._id === methods.watch("dependsOnId")
  );

  // Clear dependenceValue when dependsOnId changes
  useEffect(() => {
    const currentDependsOnId = methods.watch("dependsOnId");
    if (currentDependsOnId) {
      const dependsOnItem = dataItems?.data?.find(
        (item) => item._id === currentDependsOnId
      );

      if (dependsOnItem) {
        const currentValue = methods.watch("dependenceValue");

        // Clear value if it's not valid for the new dependency type
        if (dependsOnItem.type === CreateDataDto.type.SINGLE_CHOICE) {
          if (currentValue && !["true", "false"].includes(currentValue[0])) {
            methods.setValue("dependenceValue", []);
          }
        } else if (dependsOnItem.type === CreateDataDto.type.MULTIPLE_CHOICE) {
          const listValues =
            lists?.find((list) => list._id === dependsOnItem.list?._id)
              ?.values || [];
          if (currentValue && !listValues.includes(currentValue[0])) {
            methods.setValue("dependenceValue", []);
          }
        }
      }
    }
  }, [methods.watch("dependsOnId"), dataItems?.data, lists, methods]);

  useEffect(() => {
    if (editingData) {
      methods.reset({
        fieldName: editingData.fieldName,
        isControlField: editingData.isControlField,
        isModifiable: editingData.isModifiable,
        isMultiItem: editingData.isMultiItem,
        type: editingData.type,
        legalForm: editingData.legalForm,
        documents: editingData.documents?.map((doc) => ({
          docs: {
            label: doc.document?.shortName || "",
            value: doc.document?._id || "",
          },
          scripts: doc.script || "",
        })),
        treeId: editingData.tree?._id,
        familleId: undefined,
        sousFamilleId: undefined,
        dependsOnId: editingData.dependsOn?._id,
        dependenceValue: editingData.dependenceValue,
        listId: editingData.list?._id,
        advancedOptions: [
          ...(editingData.isModifiable ? ["isModifiable"] : []),
          ...(editingData.isControlField ? ["isControlField"] : []),
          ...(editingData.isMultiItem ? ["isMultiItem"] : []),
        ],
      });
    } else {
      // Reset form to default values when creating new data
      methods.reset({
        fieldName: "",
        isControlField: false,
        isModifiable: false,
        isMultiItem: false,
        type: undefined,
        legalForm: undefined,
        documents: [
          { docs: { label: undefined, value: undefined }, scripts: "" },
        ],
        advancedOptions: [],
        treeId: undefined,
        familleId: undefined,
        sousFamilleId: undefined,
        dependsOnId: undefined,
        listId: undefined,
        dependenceValue: undefined,
      });
    }
  }, [editingData, methods]);
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader className="p-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold text-formality-accent">
            {editingData ? "Modifier la donnée" : "Nouvelle donnée"}
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Remplissez les informations de la donnée ci-dessous.
          </SheetDescription>
        </SheetHeader>

        <Form methods={methods} onSubmit={onSubmit} onError={onError}>
          <div className="p-6 space-y-8">
            {/* Main Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">
                Informations principales
              </h3>
              <ControlledInput
                name="fieldName"
                label="Nom de la donnée"
                placeholder="Nom de la donnée"
                required
              />
              <ControlledCheckboxGroup
                name="legalForm"
                label="Forme juridique"
                required
                options={legalFormOptions}
                className="flex flex-wrap gap-4"
                direction="row"
                withSelectAllOption
              />
              <ControlledRadioGroup
                name="type"
                required
                label="Type de réponse"
                options={responseTypeOptions}
                className="flex flex-wrap gap-4"
                direction="row"
              />
              {/* Liste associée: only show if type === MULTIPLE_CHOICE */}
              {(ReponseType === CreateDataDto.type.MULTIPLE_CHOICE ||
                ReponseType === CreateDataDto.type.SINGLE_CHOICE) && (
                <ControlledSelect
                  name="listId"
                  label="Liste associée"
                  required
                  placeholder="Sélectionner une liste"
                  data={(lists?.filter((list) => !list.isArchived) || []).map(
                    (list) => ({
                      label: list.fieldName,
                      value: list._id!,
                    })
                  )}
                  getOptionValue={(option) => option.value}
                  getOptionLabel={(option) => option.label}
                />
              )}
            </div>

            {/* Documents & Scripts */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold mb-2">
                Documents & Scripts
              </h3>
              {methods.watch("documents")?.map((doc, index) => (
                <div
                  key={index}
                  className="relative mb-4 p-4 rounded-lg border border-gray-200 bg-gray-50 flex flex-col gap-3"
                >
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="absolute -top-3 -right-3 bg-white shadow-md border border-gray-200 text-gray-400 hover:text-red-500 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-red-200 z-10"
                    aria-label="Supprimer le document"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <ControlledSelect
                    name={`documents.${index}.docs.value`}
                    label={index === 0 ? "Document" : undefined}
                    required
                    placeholder="Sélectionner un document"
                    data={
                      documents?.map((doc) => ({
                        label: doc.shortName,
                        value: doc._id,
                      })) ?? []
                    }
                    getOptionValue={(option) => option.value}
                    getOptionLabel={(option) => option.label}
                    hideError
                  />
                  <ControlledTextarea
                    name={`documents.${index}.scripts`}
                    label={index === 0 ? "Script" : undefined}
                    placeholder="Texte du script"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                type="button"
                size="sm"
                className="mt-2 w-full border-dashed border-2 border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center gap-2 py-3"
                onClick={addDocument}
              >
                <Plus className="h-4 w-4 mr-1" /> Ajouter un document
              </Button>
            </div>

            {/* Advanced Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Options avancées</h3>
              <ControlledCheckboxGroup
                name="advancedOptions"
                singleSelection
                label="Options"
                direction="row"
                options={[
                  { label: "Modifiable", value: "isModifiable" },
                  { label: "Champ de contrôle", value: "isControlField" },
                  { label: "Multi-item", value: "isMultiItem" },
                ]}
                checkboxClassName="text-formality-primary focus:ring-formality-primary/20 h-4 w-4"
                rules={{}}
              />
              <div className="grid grid-cols-3 gap-3">
                <ControlledSelect
                  name="treeId"
                  label="Rubrique"
                  placeholder="Sélectionner une rubrique"
                  data={rubriqueOptions.map((r) => ({
                    label: r.fieldName,
                    value: r._id,
                  }))}
                  getOptionValue={(option) => option.value}
                  getOptionLabel={(option) => option.label}
                />
                <ControlledSelect
                  name="familleId"
                  label="Famille"
                  placeholder="Sélectionner une famille"
                  data={familleOptions.map((f) => ({
                    label: f.fieldName,
                    value: f._id,
                  }))}
                  getOptionValue={(option) => option.value}
                  getOptionLabel={(option) => option.label}
                  disabled={!methods.watch("treeId")}
                />
                <ControlledSelect
                  name="sousFamilleId"
                  label="Sous-famille"
                  placeholder="Sélectionner une sous-famille"
                  data={sousFamilleOptions.map((sf) => ({
                    label: sf.fieldName,
                    value: sf._id,
                  }))}
                  getOptionValue={(option) => option.value}
                  getOptionLabel={(option) => option.label}
                  disabled={!methods.watch("familleId")}
                />
              </div>
              {/* Dépendance section */}
              <div className="grid grid-cols-2 gap-3 items-end">
                <ControlledSelect
                  name="dependsOnId"
                  label="Dépend de la donnée"
                  clear
                  placeholder="Donnée N°X"
                  data={
                    dataItems?.data?.map((item) => ({
                      label: item.fieldName,
                      value: item._id!,
                      type: responseTypeOptions.find(
                        (option) => option.value === item.type
                      )?.label,
                    })) ?? []
                  }
                  disabled={dataItems?.data?.length === 0}
                  getOptionValue={(option) => option.value}
                  getOptionLabel={(option) => option.label}
                  selectItemEndAdornment={(option) => (
                    <span className="text-xs text-gray-500">{option.type}</span>
                  )}
                />
                {dependsOnId &&
                  (dependsOnId.type === CreateDataDto.type.SINGLE_CHOICE ||
                    dependsOnId.type ===
                      CreateDataDto.type.MULTIPLE_CHOICE) && (
                    <ControlledMultiSelect
                      name="dependenceValue"
                      required
                      label="Valeur de la donnée N°X"
                      placeholder="Veuillez sélectionner une valeur"
                      data={
                        lists
                          ?.find((list) => list._id === dependsOnId.list?._id)
                          ?.values.map((value) => ({
                            label: value,
                            value,
                          })) || []
                      }
                      getOptionValue={(option) => option.value}
                      getOptionLabel={(option) => option.label}
                    />
                  )}
              </div>
            </div>
            <div className="pt-10">
              <div className="flex justify-end pt-6 border-t border-gray-100">
                <Button
                  className="bg-formality-primary hover:bg-formality-primary/90 text-white min-w-[140px]"
                  type="submit"
                  disabled={
                    createDataMutation.isPending || updateDataItems.isPending
                  }
                >
                  {editingData ? "Mettre à jour" : "Enregistrer"}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
