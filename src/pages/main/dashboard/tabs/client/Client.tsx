
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ClientService } from "@/api-swagger/services/ClientService";
import { ClientDto } from "@/api-swagger/models/ClientDto";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Client = () => {
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: ClientService.clientControllerFindAll,
  });

  if (isLoading) {
    return <div>Chargement des clients...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des clients.</div>;
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Date invalide";
      }
      return format(date, "dd/MM/yyyy");
    } catch (error) {
      return "N/A";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Liste des Clients</h1>
      {clients && clients.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableCaption>Liste des clients</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du client</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date de création</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client: ClientDto) => (
                <TableRow key={client.id}>
                  <TableCell>{client.clientName || "N/A"}</TableCell>
                  <TableCell>{client.email || "N/A"}</TableCell>
                  <TableCell>{client.phone || "N/A"}</TableCell>
                  <TableCell>{client.address || "N/A"}</TableCell>
                  <TableCell>{client.clientType || "N/A"}</TableCell>
                  <TableCell>{client.createdAt ? formatDate(client.createdAt) : "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div>Aucun client trouvé.</div>
      )}
    </div>
  );
};

export default Client;
