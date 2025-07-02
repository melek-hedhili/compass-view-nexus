import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import type { ClientDto } from "@/api-swagger/models/ClientDto";

interface ClientDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientDto | null;
}

export const ClientDetailsSheet: React.FC<ClientDetailsSheetProps> = ({
  isOpen,
  onClose,
  client,
}) => (
  <Sheet open={isOpen} onOpenChange={onClose}>
    <SheetContent className="w-[450px] sm:w-[900px] p-0 overflow-y-auto">
      <SheetHeader className="p-6 pb-4 border-b border-gray-100">
        <SheetTitle className="text-2xl font-bold text-formality-accent">
          Détails du client
        </SheetTitle>
        <SheetDescription className="text-gray-600">
          Informations détaillées du client
        </SheetDescription>
      </SheetHeader>
      {client && (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Nom du client
              </Label>
              <p className="text-sm font-normal">{client.clientName}</p>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Prénom
              </Label>
              <p className="text-sm font-normal">{client.firstName}</p>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Nom
              </Label>
              <p className="text-sm font-normal">{client.lastName}</p>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Email
              </Label>
              <p className="text-sm font-normal">{client.email}</p>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Téléphone
              </Label>
              <p className="text-sm font-normal">{client.phone}</p>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Journal
              </Label>
              <Badge variant="outline" className="text-sm font-normal">
                {client.jounals}
              </Badge>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Comptes
              </Label>
              <div className="flex flex-wrap gap-2">
                {client.accounts.length > 0
                  ? client.accounts.map((acc, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-sm font-normal"
                      >
                        {acc}
                      </Badge>
                    ))
                  : "-"}
              </div>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Tarif création
              </Label>
              <p className="text-sm font-normal">{client.creationPrice} €</p>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Tarif modification
              </Label>
              <p className="text-sm font-normal">
                {client.modificationPrice} €
              </p>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Tarif dépôt
              </Label>
              <p className="text-sm font-normal">{client.submissionPrice} €</p>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Paiement délégué
              </Label>
              <p className="text-sm font-normal">
                {client.delegatePayment || "-"}
              </p>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Archivé
              </Label>
              <Badge variant="outline" className="text-sm font-normal">
                {client.isArchived ? "Oui" : "Non"}
              </Badge>
            </div>

            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Dernière mise à jour
              </Label>
              <p className="text-sm font-normal text-gray-600">
                {client.updated_at
                  ? new Date(client.updated_at).toLocaleString()
                  : "-"}
              </p>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Date de création
              </Label>
              <p className="text-sm font-normal text-gray-600">
                {client.created_at
                  ? new Date(client.created_at).toLocaleString()
                  : "-"}
              </p>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                ID
              </Label>
              <p className="text-xs text-gray-400">{client._id}</p>
            </div>
          </div>
        </div>
      )}
    </SheetContent>
  </Sheet>
);
