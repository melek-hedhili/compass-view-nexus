import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select/controlled-select";
import { ControlledCheckbox } from "@/components/ui/controlled/controlled-checkbox/controlled-checkbox";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailService } from "@/api-swagger/services/EmailService";
import { toast } from "sonner";
import { type ClientDto } from "@/api-swagger/models/ClientDto";
import { type FileDto } from "@/api-swagger/models/FileDto";

interface LinkToFileFormProps {
  clientsData: ClientDto[];
  filesData: FileDto[];
  selectedEmailId: string | null;
  onClose: () => void;
}

type LinkToFileFormData = {
  clientId: string;
  fileId: string;
  acceder: boolean;
};

const LinkToFileForm: React.FC<LinkToFileFormProps> = ({
  clientsData,
  filesData,
  selectedEmailId,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const form = useForm<LinkToFileFormData>({
    defaultValues: {
      clientId: undefined,
      fileId: undefined,
      acceder: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: LinkToFileFormData) => {
      if (!selectedEmailId || !data.fileId) {
        toast.error("Veuillez sélectionner un email et un dossier");
        return Promise.reject();
      }
      return EmailService.emailControllerLinkToFile({
        requestBody: {
          fileId: data.fileId,
          emailId: selectedEmailId,
        },
      });
    },
    onSuccess: () => {
      toast.success("Association réussie");
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast.error("Erreur lors de l'association");
      console.error("Error linking to file:", error);
    },
  });

  const onSubmit: SubmitHandler<LinkToFileFormData> = (data) => {
    mutation.mutate(data);
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
            name="fileId"
            label="Nom du dossier"
            required
            data={filesData || []}
            getOptionValue={(f) => f._id}
            getOptionLabel={(f) => f.fileName}
            placeholder="Nom du dossier"
            disabled={mutation.isPending}
          />
          <ControlledCheckbox
            name="acceder"
            label="Accéder"
            required={false}
            disabled={mutation.isPending}
          />
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full"
            variant="outline"
            loading={mutation.isPending}
          >
            Associer au dossier
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LinkToFileForm;
