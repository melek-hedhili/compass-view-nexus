import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ClientDto, CreateClientDto, UpdateClientDto } from "@/api-swagger";
import { ClientService } from "@/api-swagger/services/ClientService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmationModal } from "../ui/confirmation-modal";

interface ClientFormProps {
  client?: ClientDto | null;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onCancel,
  onDelete,
}) => {
  const queryClient = useQueryClient();
  const [delegation, setDelegation] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ClientDto>>({
    clientName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jounals: ClientDto.jounals.LOCAL,
    accounts: [],
    creationPrice: 0,
    modificationPrice: 0,
    submissionPrice: 0,
    delegatePayment: "",
    isArchived: false,
  });

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
      //close drawer
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

  useEffect(() => {
    if (client) {
      setFormData(client);
      setDelegation(!!client.delegatePayment);
    }
  }, [client]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName) {
      toast.error("Veuillez remplir le nom du client");
      return;
    }

    const payload: CreateClientDto = {
      clientName: formData.clientName || "",
      email: formData.email || "",
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      phone: formData.phone || "",
      jounals: formData.jounals || ClientDto.jounals.LOCAL,

      creationPrice: formData.creationPrice || 0,
      modificationPrice: formData.modificationPrice || 0,
      submissionPrice: formData.submissionPrice || 0,
      delegatePayment: delegation ? formData.delegatePayment || "" : "",
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

    // Create payload without isArchived since it's not in UpdateClientDto
    const updatePayload: UpdateClientDto = {
      clientName: formData.clientName,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      jounals: formData.jounals,
      creationPrice: formData.creationPrice,
      modificationPrice: formData.modificationPrice,
      submissionPrice: formData.submissionPrice,
      delegatePayment: formData.delegatePayment,
    };

    await archiveClientMutation.mutateAsync({
      id: client._id,
      data: updatePayload,
      action: client.isArchived ? "unarchive" : "archive",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="clientName">Nom du client *</Label>
          <Input
            id="clientName"
            name="clientName"
            value={formData.clientName || ""}
            onChange={handleChange}
            className="input-elegant mt-1 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            className="input-elegant mt-1 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            className="input-elegant mt-1 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="input-elegant mt-1 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="input-elegant mt-1 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jounals">Journal officiel</Label>
          <Select
            value={formData.jounals || ClientDto.jounals.LOCAL}
            onValueChange={(value: ClientDto.jounals) =>
              setFormData((prev) => ({ ...prev, jounals: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un journal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ClientDto.jounals.LOCAL}>Local</SelectItem>
              <SelectItem value={ClientDto.jounals.NATIONAL}>
                National
              </SelectItem>
              <SelectItem value={ClientDto.jounals.BODACC}>BODACC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="creationPrice">Tarif création</Label>
          <Input
            id="creationPrice"
            name="creationPrice"
            type="number"
            value={formData.creationPrice || 0}
            onChange={handleChange}
            className="input-elegant mt-1 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="modificationPrice">Tarif modification</Label>
          <Input
            id="modificationPrice"
            name="modificationPrice"
            type="number"
            value={formData.modificationPrice || 0}
            onChange={handleChange}
            className="input-elegant mt-1 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="submissionPrice">Tarif dépôt</Label>
          <Input
            id="submissionPrice"
            name="submissionPrice"
            type="number"
            value={formData.submissionPrice || 0}
            onChange={handleChange}
            className="input-elegant mt-1 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="delegation"
              checked={delegation}
              onChange={(e) => setDelegation(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="delegation">Délégation de paiement</Label>
          </div>
          {delegation && (
            <Input
              placeholder="Email pour la délégation"
              name="delegatePayment"
              value={formData.delegatePayment || ""}
              onChange={handleChange}
              className="input-elegant mt-1 border-gray-700"
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
        title={"Supprimer le client"}
        description={`Êtes-vous sûr de vouloir supprimer le client ${client?.clientName} ?`}
      />
    </form>
  );
};
