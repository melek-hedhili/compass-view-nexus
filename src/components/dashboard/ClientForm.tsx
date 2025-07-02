import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ClientDto,
  type CreateClientDto,
  type UpdateClientDto,
} from "@/api-swagger";
import { ClientService } from "@/api-swagger/services/ClientService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select/controlled-select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientDto | null;
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
  isOpen,
  onClose,
  client,
}) => {
  const queryClient = useQueryClient();
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
      onClose();
    },
    onError: (error) => {
      const errorMsg = (error as any).body.message;
      if (errorMsg.includes("client is already registered")) {
        toast.error("Le client est déjà enregistré");
      } else {
        toast.error("Erreur lors de la création du client");
      }
    },
  });

  // Update client mutation
  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientDto }) =>
      ClientService.clientControllerUpdate({ id, requestBody: data }),
    onSuccess: () => {
      toast.success("Client mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      onClose();
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour du client");
      console.error("Error updating client:", error);
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[450px] sm:w-[900px] p-0 overflow-y-auto">
        <SheetHeader className="p-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold text-formality-accent">
            {client?._id ? "Modifier le client" : "Nouveau client"}
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            {client?._id
              ? "Modifiez les informations du client ci-dessous."
              : "Remplissez les informations du client ci-dessous."}
          </SheetDescription>
        </SheetHeader>
        <Form methods={methods} onSubmit={onSubmit} className="p-6 space-y-6">
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
              onClick={onClose}
              loading={
                createClientMutation.isPending || updateClientMutation.isPending
              }
            >
              Annuler
            </Button>
            <Button
              type="submit"
              loading={
                createClientMutation.isPending || updateClientMutation.isPending
              }
              className="bg-formality-primary hover:bg-formality-primary/90 text-white"
            >
              Enregistrer
            </Button>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
