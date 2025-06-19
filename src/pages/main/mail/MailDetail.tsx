import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Archive, Reply, X } from "lucide-react";
import { EmailDto } from "@/api-swagger/models/EmailDto";

function MailDetail({
  mail,
  onReply,
  onArchive,
  onUnarchive,
  isArchiving,
  activeTab,
}: {
  mail: EmailDto | null | undefined;
  onClose: () => void;
  onReply: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  isArchiving: boolean;
  activeTab: string;
}) {
  if (!mail) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Date invalide";
      }
      return format(date, "dd MMMM yyyy HH:mm", {
        locale: fr,
      });
    } catch (error) {
      return "Date invalide";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-100 relative">
        <h2 className="text-xl font-bold text-formality-accent mb-3 pr-8">
          {mail.subject}
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-700">De:</span> {mail.from}
          </div>
          <div>
            <span className="font-medium text-gray-700">À:</span> {mail.to}
          </div>
          <div>
            <span className="font-medium text-gray-700">Date:</span>{" "}
            {formatDate(mail.date)}
          </div>
          {mail.client && (
            <div>
              <span className="font-medium text-gray-700">Client:</span>{" "}
              {mail.client.clientName}
            </div>
          )}
        </div>
      </div>
      <div className="px-6 py-8 prose max-w-none mb-2 flex-grow overflow-auto">
        {mail.htmlBody ? (
          <div dangerouslySetInnerHTML={{ __html: mail.htmlBody }} />
        ) : (
          <p>{mail.textBody}</p>
        )}
      </div>
      <div className="px-4 py-4 bg-gray-50 border-y border-gray-100">
        <h3 className="text-sm font-medium mb-3 text-gray-700">
          Pièces jointes
        </h3>
        <p className="text-sm text-gray-500">Aucune pièce jointe</p>
      </div>
      <div className="flex justify-between p-6 border-t border-gray-100">
        <div className="flex gap-2">
          {activeTab !== "envoye" && (
            <>
              {activeTab === "archives" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex gap-1.5 items-center"
                  onClick={onUnarchive}
                  disabled={isArchiving}
                >
                  {isArchiving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    <Archive className="h-4 w-4" />
                  )}
                  {isArchiving ? "Désarchivage..." : "Désarchiver"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex gap-1.5 items-center"
                  onClick={onArchive}
                  disabled={isArchiving}
                >
                  {isArchiving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    <Archive className="h-4 w-4" />
                  )}
                  {isArchiving ? "Archivage..." : "Archiver"}
                </Button>
              )}
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-formality-primary hover:bg-formality-primary/90 text-white flex items-center gap-1.5"
            size="sm"
            onClick={onReply}
          >
            <Reply className="h-4 w-4" />
            Répondre
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MailDetail;
