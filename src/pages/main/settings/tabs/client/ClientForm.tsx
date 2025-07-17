import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ClientDto, type CreateClientDto } from "@/api-swagger";
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
import { useClientMutations } from "./hooks/useClientMutations";

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientDto | null;
}

export const journalOptions = [
  { label: "Local", value: ClientDto.jounals.LOCAL },
  { label: "National", value: ClientDto.jounals.NATIONAL },
  { label: "BODACC", value: ClientDto.jounals.BODACC },
];

const initialForm: CreateClientDto = {
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
  const [delegation, setDelegation] = useState(false);

  const methods = useForm<CreateClientDto>({
    defaultValues: initialForm,
  });
  const { createClientMutation, updateClientMutation } = useClientMutations({
    onClose,
    methods,
    initialForm,
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

  const onSubmit: SubmitHandler<CreateClientDto> = async (data) => {
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
    if (client?._id) {
      await updateClientMutation.mutateAsync({
        id: client._id,
        data: payload,
      });
    } else {
      await createClientMutation.mutateAsync(payload);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
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
