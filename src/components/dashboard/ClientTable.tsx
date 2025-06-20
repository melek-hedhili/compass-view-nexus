import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ClientDto } from "@/api-swagger";

interface ClientTableProps {
  clients: ClientDto[];
  onSelectClient: (client: ClientDto) => void;
  selectedClient?: ClientDto | null;
}

export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  onSelectClient,
  selectedClient,
}) => (
  <div className="w-full overflow-auto border rounded-md">
    <Table className="w-full">
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead className="text-left font-medium">Nom du client</TableHead>
          <TableHead className="text-left font-medium">Prénom</TableHead>
          <TableHead className="text-left font-medium">Nom</TableHead>
          <TableHead className="text-left font-medium hidden md:table-cell">
            Email
          </TableHead>
          <TableHead className="text-left font-medium hidden lg:table-cell">
            Téléphone
          </TableHead>
          <TableHead className="text-left font-medium">Tarif</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow
            key={client._id}
            className={cn(
              "cursor-pointer hover:bg-gray-50 transition-colors",
              selectedClient?._id === client._id
                ? "bg-formality-primary/5 hover:bg-formality-primary/10"
                : ""
            )}
            onClick={() => onSelectClient(client)}
          >
            <TableCell className="font-medium">{client.firstName}</TableCell>
            <TableCell className="font-medium">{client.lastName}</TableCell>
            <TableCell>{client.firstName}</TableCell>
            <TableCell className="hidden md:table-cell">
              {client.email}
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              {client.phone}
            </TableCell>
            <TableCell>{client.modificationPrice}</TableCell>
          </TableRow>
        ))}
        {clients.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center text-gray-500">
              Aucun client trouvé
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);
