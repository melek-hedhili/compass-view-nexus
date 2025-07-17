import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select/controlled-select";
import { ControlledCheckbox } from "@/components/ui/controlled/controlled-checkbox/controlled-checkbox";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileService } from "@/api-swagger/services/FileService";
import { type CreateFileDto } from "@/api-swagger/models/CreateFileDto";
import { toast } from "sonner";
import { type ClientDto } from "@/api-swagger/models/ClientDto";

interface NewDossierFormProps {
  clientsData: ClientDto[];
  provisionsData: string[];
  legalFormsData: string[];
  selectedEmailId: string | null;
  onClose: () => void;
}

type CreateDossierFormData = Pick<
  CreateFileDto,
  "clientId" | "fileName" | "legalForm" | "provision" | "isUrgent"
>;

const NewDossierForm: React.FC<NewDossierFormProps> = ({
  clientsData,
  provisionsData,
  legalFormsData,
  selectedEmailId,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const form = useForm<CreateDossierFormData>({
    defaultValues: {
      clientId: undefined,
      provision: undefined,
      legalForm: undefined,
      fileName: undefined,
      isUrgent: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateDossierFormData) =>
      FileService.fileControllerCreate({
        requestBody: { ...data, emailId: selectedEmailId ?? "" },
      }),
    onSuccess: async () => {
      toast.success("Dossier créé avec succès");
      await queryClient.invalidateQueries({ queryKey: ["fileCount"] });
      await queryClient.invalidateQueries({ queryKey: ["files"] });

      form.reset();
      onClose();
    },
    onError: (error) => {
      toast.error("Erreur lors de la création du dossier");
      console.error("Error creating file:", error);
    },
  });

  const onSubmit: SubmitHandler<CreateDossierFormData> = (data) => {
    mutation.mutateAsync(data);
  };

  return (
    <div className="p-6 space-y-6">
      <Form methods={form} onSubmit={onSubmit}>
        <div className="space-y-4">
          <ControlledSelect
            name="clientId"
            label="Client"
            required
            data={clientsData || []}
            getOptionValue={(c) => c._id}
            getOptionLabel={(c) => c.clientName}
            placeholder="Sélectionnez un client"
            disabled={mutation.isPending}
          />
          <ControlledSelect
            name="provision"
            label="Prestation"
            required
            data={provisionsData || []}
            getOptionValue={(p) => p}
            getOptionLabel={(p) => p}
            placeholder="Prestation"
            disabled={mutation.isPending}
          />
          <ControlledSelect
            name="legalForm"
            label="Forme juridique"
            required
            data={legalFormsData || []}
            getOptionValue={(f) => f}
            getOptionLabel={(f) => f}
            placeholder="Forme juridique"
            disabled={mutation.isPending}
          />
          <ControlledInput
            name="fileName"
            label="Nom du dossier"
            required
            placeholder="Nom du dossier"
            disabled={mutation.isPending}
          />
          <ControlledCheckbox
            name="isUrgent"
            label="Urgent"
            required={false}
            disabled={mutation.isPending}
          />
          <Button
            type="submit"
            disabled={mutation.isPending}
            loading={mutation.isPending}
            className="w-full"
          >
            Créer un dossier
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewDossierForm;
