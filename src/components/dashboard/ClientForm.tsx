import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ClientDto, CreateClientDto, UpdateClientDto } from "@/api-swagger";
import { ClientService } from "@/api-swagger/services/ClientService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmationModal } from "../ui/confirmation-modal";
import { Form } from "@/components/ui/form";
import { useForm, SubmitHandler } from "react-hook-form";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select/controlled-select";

interface ClientFormProps {
  client?: ClientDto | null;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

const journalOptions = [
  { label: "Local", value: ClientDto.jounals.LOCAL },
  { label: "National", value: ClientDto.jounals.NATIONAL },
  { label: "BODACC", value: ClientDto.jounals.BODACC },
];

const initialForm: Partial<CreateClientDto> = {
  clientName: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jounals: undefined,
  creationPrice: undefined,
  modificationPrice: undefined,
  submissionPrice: undefined,
  delegatePayment: undefined,
};

export const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onCancel,
  onDelete,
}) => {
  const queryClient = useQueryClient();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [delegation, setDelegation] = useState(false);

  const methods = useForm<Partial<CreateClientDto>>({
    defaultValues: initialForm,
  });

  // Populate form when client changes
  useEffect(() => {
    if (client) {
      methods.reset({
        clientName: client.clientName || "",
        firstName: client.firstName || "",
        lastName: client.lastName || "",
        email: client.email || "",
        phone: client.phone || "",
        jounals: client.jounals || undefined,
        creationPrice: client.creationPrice || undefined,
        modificationPrice: client.modificationPrice || undefined,
        submissionPrice: client.submissionPrice || undefined,
        delegatePayment: client.delegatePayment || undefined,
      });
      setDelegation(!!client.delegatePayment);
    } else {
      methods.reset(initialForm);
      setDelegation(false);
    }
  }, [client, methods]);

  // Create client mutation
  const createClientMutation = useMutation({
    mutationFn: (data: CreateClientDto) =>
      ClientService.clientControllerCreate({ requestBody: data }),
    onSuccess: () => {
      toast.success("Client créé avec succès");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      onCancel();
    },
    onError: (error) => {
      toast.error("Erreur lors de la création du client");
      console.error("Error creating client:", error);
    },
  });

  // Update client mutation
  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientDto }) =>
      ClientService.clientControllerUpdate({ id, requestBody: data }),
    onSuccess: () => {
      toast.success("Client mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      onCancel();
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour du client");
      console.error("Error updating client:", error);
    },
  });
  //Archive client mutation
  const archiveClientMutation = useMutation({
    mutationFn: ({
      id,
      data,
      action,
    }: {
      id: string;
      data: UpdateClientDto;
      action: "archive" | "unarchive";
    }) =>
      ClientService.clientControllerUpdate({
        id,
        requestBody: {
          ...data,
          isArchived: action === "archive" ? true : false,
        },
      }),
    onSuccess: (_, variables) => {
      toast.success(
        `Client ${
          variables.action === "archive" ? "archivé" : "désarchivé"
        } avec succès`
      );
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      onCancel();
    },
    onError: (error) => {
      toast.error("Erreur lors de l'archivage du client");
      console.error("Error archiving client:", error);
    },
  });
  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: (id: string) => ClientService.clientControllerRemove({ id }),
    onSuccess: () => {
      toast.success("Client supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      if (onDelete && client?._id) {
        onDelete(client._id);
      }
      onCancel();
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression du client");
      console.error("Error deleting client:", error);
    },
  });

  const onSubmit: SubmitHandler<Partial<CreateClientDto>> = async (data) => {
    const payload: CreateClientDto = {
      clientName: data.clientName,
      email: data.email || undefined,
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      phone: data.phone || undefined,
      jounals: data.jounals || undefined,
      creationPrice: data.creationPrice || undefined,
      modificationPrice: data.modificationPrice || undefined,
      submissionPrice: data.submissionPrice || undefined,
      delegatePayment: delegation ? data.delegatePayment : undefined,
    };
    try {
      if (client?._id) {
        await updateClientMutation.mutateAsync({
          id: client._id,
          data: payload,
        });
      } else {
        await createClientMutation.mutateAsync(payload);
      }
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const handleDelete = async () => {
    if (!client?._id) return;
    await deleteClientMutation.mutateAsync(client._id);
  };
  const handleArchive = async () => {
    if (!client?._id) return;
    const updatePayload: UpdateClientDto = {
      clientName: methods.getValues("clientName"),
      email: methods.getValues("email"),
      firstName: methods.getValues("firstName"),
      lastName: methods.getValues("lastName"),
      phone: methods.getValues("phone"),
      jounals: methods.getValues("jounals"),
      creationPrice: methods.getValues("creationPrice"),
      modificationPrice: methods.getValues("modificationPrice"),
      submissionPrice: methods.getValues("submissionPrice"),
      delegatePayment: methods.getValues("delegatePayment"),
    };
    await archiveClientMutation.mutateAsync({
      id: client._id,
      data: updatePayload,
      action: client.isArchived ? "unarchive" : "archive",
    });
  };

  return (
    <Form methods={methods} onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ControlledInput name="clientName" label="Nom du client" required />
        <ControlledInput name="email" label="Email" type="email" required />
        <ControlledInput name="firstName" label="Prénom" />
        <ControlledInput name="lastName" label="Nom" />
        <ControlledInput name="phone" label="Téléphone" />
        <ControlledSelect
          name="jounals"
          label="Journal officiel"
          placeholder="Sélectionner un journal"
          data={journalOptions}
          getOptionValue={(option) => option.value}
          getOptionLabel={(option) => option.label}
          className="w-full"
        />
        <ControlledInput
          name="creationPrice"
          label="Tarif création"
          type="number"
        />
        <ControlledInput
          name="modificationPrice"
          label="Tarif modification"
          type="number"
        />
        <ControlledInput
          name="submissionPrice"
          label="Tarif dépôt"
          type="number"
        />
        <div className="space-y-2 col-span-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="delegation"
              checked={delegation}
              onChange={(e) => setDelegation(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="delegation">Délégation de paiement</label>
          </div>
          {delegation && (
            <ControlledInput
              placeholder="Email pour la délégation"
              name="delegatePayment"
            />
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          loading={
            createClientMutation.isPending || updateClientMutation.isPending
          }
        >
          Annuler
        </Button>
        {client?._id && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => setIsConfirmationModalOpen(true)}
            loading={deleteClientMutation.isPending}
          >
            Supprimer
          </Button>
        )}
        {client?._id && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleArchive}
            loading={archiveClientMutation.isPending}
          >
            {client.isArchived ? "Désarchiver" : "Archiver"}
          </Button>
        )}
        <Button
          type="submit"
          loading={
            createClientMutation.isPending || updateClientMutation.isPending
          }
        >
          Enregistrer
        </Button>
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onPressConfirm={handleDelete}
        title="Supprimer le client"
        description={`Êtes-vous sûr de vouloir supprimer le client ${client?.clientName} ?`}
      />
    </Form>
  );
};
