import React from "react";
import { useQuery } from "react-query";
import { ClientService } from "@/api-swagger/services/ClientService";
import { ClientDto } from "@/api-swagger/models/ClientDto";
import { format } from "date-fns";
import { Table } from "@/components/ui/table";

const Client = () => {
  const { data: clients, isLoading, error } = useQuery(
    "clients",
    ClientService.clientControllerFindAll
  );

  if (isLoading) {
    return <div>Chargement des clients...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des clients.</div>;
  }

  const columns = [
    {
      key: "clientName" as keyof ClientDto,
      header: "Nom du client",
      render: (value: string | number | boolean | string[]) => String(value) || "N/A",
    },
    {
      key: "email" as keyof ClientDto,
      header: "Email",
      render: (value: string | number | boolean | string[]) => String(value) || "N/A",
    },
    {
      key: "phone" as keyof ClientDto,
      header: "Téléphone",
      render: (value: string | number | boolean | string[]) => String(value) || "N/A",
    },
    {
      key: "address" as keyof ClientDto,
      header: "Adresse",
      render: (value: string | number | boolean | string[]) => String(value) || "N/A",
    },
    {
      key: "clientType" as keyof ClientDto,
      header: "Type",
      render: (value: string | number | boolean | string[]) => String(value) || "N/A",
    },
    {
      key: "createdAt" as keyof ClientDto,
      header: "Date de création",
      render: (value: string | number | boolean | string[]) => {
        const dateValue = String(value);
        return dateValue ? format(new Date(dateValue), "dd/MM/yyyy") : "N/A";
      },
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Liste des Clients</h1>
      {clients && clients.length > 0 ? (
        <Table columns={columns} data={clients} />
      ) : (
        <div>Aucun client trouvé.</div>
      )}
    </div>
  );
};

export default Client;
