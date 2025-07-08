import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { type ListDto } from "@/api-swagger";
import { useListMutations } from "./hooks/useListMutations";
import { Form } from "@/components/ui/form";
import { type SubmitHandler, useForm } from "react-hook-form";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { ControlledCreateableAutoComplete } from "@/components/ui/controlled/controlled-createable-auto-complete/controlled-createable-auto-complete";

interface ListFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isNew: boolean;
  list: ListDto | null;
}

export const ListForm: React.FC<ListFormProps> = ({
  isOpen,
  onClose,
  title,
  isNew,
  list,
}) => {
  const { createListMutation, updateListMutation } = useListMutations();

  const methods = useForm<ListDto>({
    defaultValues: {
      fieldName: "",
      values: [],
    },
  });

  const onSubmit: SubmitHandler<ListDto> = (data) => {
    if (isNew) {
      createListMutation.mutate(data);
    } else if (list?._id) {
      updateListMutation.mutate({ id: list._id, data });
    }
    methods.reset();
    onClose();
  };

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      if (isNew) {
        // Reset form for new list
        methods.reset({
          fieldName: "",
          values: [],
        });
      } else if (list) {
        // Populate form with existing list data
        methods.reset({
          fieldName: list.fieldName || "",
          values: list.values || [],
        });
      }
    }
  }, [isOpen, list, methods, isNew]);

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader className="p-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold text-formality-accent">
            {title}
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Remplissez les informations de la liste ci-dessous.
          </SheetDescription>
        </SheetHeader>

        <Form methods={methods} onSubmit={onSubmit} className="p-6">
          <div className="space-y-6">
            <ControlledInput
              required
              name="fieldName"
              label="Nom du champ"
              placeholder="Nom du champ"
            />
            <ControlledCreateableAutoComplete
              name="values"
              required
              label="Valeurs"
              placeholder="Tapez une valeur et appuyez sur Entrée"
            />

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </SheetClose>
              <Button
                type="submit"
                loading={
                  createListMutation.isPending || updateListMutation.isPending
                }
                className="bg-formality-primary hover:bg-formality-primary/90 text-white"
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
