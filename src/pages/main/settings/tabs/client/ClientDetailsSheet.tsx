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
import { useQuery } from "@tanstack/react-query";
import { ClientService } from "@/api-swagger/services/ClientService";
import type { ClientDto } from "@/api-swagger/models/ClientDto";
import { User, Mail, CreditCard, Calendar, CheckCircle2 } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { journalOptions } from "@/components/dashboard/ClientForm";

interface ClientDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string | null;
}

export const ClientDetailsSheet: React.FC<ClientDetailsSheetProps> = ({
  isOpen,
  onClose,
  clientId,
}) => {
  const { data: client, isLoading } = useQuery<ClientDto>({
    queryKey: ["client", clientId, isOpen],

    queryFn: () => ClientService.clientControllerFindOne({ id: clientId }),
    enabled: !!clientId && isOpen,
  });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader className="p-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold text-formality-accent">
            Détails du client
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Informations détaillées du client
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <LoadingSpinner />
          </div>
        ) : client ? (
          <div className="p-6 space-y-8">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-100 mb-2 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-green-700" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {client.clientName || "-"}
                </h3>

                <div className="flex gap-2 mt-1">
                  <Badge
                    variant="default"
                    className={
                      client.isArchived
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {client.isArchived ? "Archivé" : "Actif"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Each card is a direct child of the grid for alignment */}
              {/* Contact Section */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-5 w-5 text-formality-primary" />
                  <span className="font-semibold text-gray-800 text-base">
                    Contact
                  </span>
                </div>
                <div className="mb-2">
                  <Label className="text-xs text-gray-500">Email</Label>
                  <div className="text-sm font-medium text-gray-900 mt-1">
                    {client.email || <span className="text-gray-400">-</span>}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Téléphone</Label>
                  <div className="text-sm font-medium text-gray-900 mt-1">
                    {client.phone || <span className="text-gray-400">-</span>}
                  </div>
                </div>
              </div>
              {/* Identité Section */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-formality-primary" />
                  <span className="font-semibold text-gray-800 text-base">
                    Identité
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <div>
                    <Label className="text-xs text-gray-500">Prénom</Label>
                    <span className="ml-2 font-medium text-gray-900">
                      {client.firstName || (
                        <span className="text-gray-400">-</span>
                      )}
                    </span>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Nom</Label>
                    <span className="ml-2 font-medium text-gray-900">
                      {client.lastName || (
                        <span className="text-gray-400">-</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              {/* Tarifs Section */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-5 w-5 text-formality-primary" />
                  <span className="font-semibold text-gray-800 text-base">
                    Tarifs
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Création</span>
                    <span className="font-medium text-gray-900">
                      {client.creationPrice !== undefined &&
                      client.creationPrice !== null ? (
                        client.creationPrice + " €"
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Modification</span>
                    <span className="font-medium text-gray-900">
                      {client.modificationPrice !== undefined &&
                      client.modificationPrice !== null ? (
                        client.modificationPrice + " €"
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dépôt</span>
                    <span className="font-medium text-gray-900">
                      {client.submissionPrice !== undefined &&
                      client.submissionPrice !== null ? (
                        client.submissionPrice + " €"
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              {/* Journal Section */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-formality-primary" />
                  <span className="font-semibold text-gray-800 text-base">
                    Journal
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {journalOptions.find((j) => j.value === client?.jounals)
                    ?.label || <span className="text-gray-400">-</span>}
                </div>
              </div>
              {/* Comptes Section */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-formality-primary" />
                  <span className="font-semibold text-gray-800 text-base">
                    Comptes
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-sm font-medium text-gray-900">
                  {client.accounts && client.accounts.length > 0 ? (
                    client.accounts.map((acc, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-sm font-normal"
                      >
                        {acc || <span className="text-gray-400">-</span>}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400">Aucun compte</span>
                  )}
                </div>
              </div>
              {/* Paiement délégué Section */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-formality-primary" />
                  <span className="font-semibold text-gray-800 text-base">
                    Paiement délégué
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {client.delegatePayment || (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </div>
            </div>

            {/* Dates Row */}
            <div className="flex flex-col md:flex-row md:justify-center gap-6">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2 w-full md:w-80">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-formality-primary" />
                  <span className="font-semibold text-gray-800 text-base">
                    Créé le
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {client.created_at ? (
                    new Date(client.created_at).toLocaleString()
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2 w-full md:w-80">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-formality-primary" />
                  <span className="font-semibold text-gray-800 text-base">
                    Dernière mise à jour
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {client.updated_at ? (
                    new Date(client.updated_at).toLocaleString()
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
