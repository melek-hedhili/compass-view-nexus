
import { Paperclip } from "lucide-react";
import { ReactNode } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface ExtendedEmailDto {
  _id: string;
  client?: { clientName: string };
  from?: string;
  to?: string;
  subject?: string;
  date?: string;
  status?: "non-lu" | "lu";
  attachments?: number;
  [key: string]: unknown;
}

export function getTableColumns(activeTab: string) {
  return [
    {
      key: "status",
      header: "Statut",
      render: (_: unknown, row: Record<string, unknown>) =>
        (
          <div className="flex justify-center">
            <div
              className={`w-3 h-3 rounded-full mx-auto ${
                row.status === "non-lu" ? "bg-formality-primary" : "bg-gray-300"
              }`}
            ></div>
          </div>
        ) as ReactNode,
      className: "w-16 text-center font-medium",
    },
    {
      key: "clientName",
      header: "Nom du Client",
      render: (_: unknown, row: Record<string, unknown>) =>
        ((row.client as { clientName: string })?.clientName || "N/A") as ReactNode,
      className: "text-left font-medium",
    },
    {
      key: "from",
      header: activeTab === "envoye" ? "Destinataire" : "Expéditeur",
      render: (_: unknown, row: Record<string, unknown>) =>
        (activeTab === "envoye"
          ? (row.to as string)
          : (row.from as string)) as ReactNode,
      className: "text-left font-medium",
    },
    {
      key: "subject",
      header: "Sujet",
      className: "text-left font-medium",
    },
    {
      key: "date",
      header: "Date/H",
      render: (_: unknown, row: Record<string, unknown>) =>
        (
          <div className="text-sm text-gray-500">
            {row.date ? format(new Date(row.date as string), "dd/MM/yyyy HH:mm", {
              locale: fr,
            }) : "-"}
          </div>
        ) as ReactNode,
      className: "text-left font-medium w-32",
    },
    {
      key: "attachments",
      header: "PJ",
      render: (_: unknown, row) =>
        (row.attachments && (row.attachments as number) > 0 ? (
          <div className="flex items-center justify-center gap-1 text-xs font-medium bg-gray-100 rounded-md px-1.5 py-0.5">
            <Paperclip className="h-3 w-3" />
            {row.attachments as number}
          </div>
        ) : null) as ReactNode,
      className: "w-16 text-center font-medium",
    },
  ];
}

export function sortData(
  data: ExtendedEmailDto[] | undefined,
  paginationParams: { sortField: string; sortOrder: "asc" | "desc" }
) {
  if (!data || !paginationParams.sortField) return data;

  return [...data].sort((a, b) => {
    const aValue = a[paginationParams.sortField as keyof ExtendedEmailDto];
    const bValue = b[paginationParams.sortField as keyof ExtendedEmailDto];

    if (aValue === undefined || bValue === undefined) return 0;

    const comparison = String(aValue).localeCompare(String(bValue));
    return paginationParams.sortOrder === "asc" ? comparison : -comparison;
  });
}
