import { Button } from "@/components/ui/button";
import {
  Archive,
  Reply,
  File as FileIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { type EmailDto } from "@/api-swagger/models/EmailDto";
import { type TabKey } from "./mail.types";
import parse from "html-react-parser";
import { formatDate } from "@/utils/utils";
import { AttachementDto } from "@/api-swagger";

function MailDetail({
  mail,
  onReply,
  onArchive,
  onUnarchive,
  isArchiving,
  activeTab,
  selectedMailFiles,
}: {
  mail: EmailDto | null;
  onClose: () => void;
  onReply: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  isArchiving: boolean;
  activeTab: TabKey;
  selectedMailFiles: AttachementDto[];
}) {
  const [attachmentsMinimized, setAttachmentsMinimized] = useState(false);
  if (!mail) return null;

  return (
    <div className="flex flex-col h-full p-6">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-formality-accent mb-3">
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
      <div className="prose max-w-none mb-6 flex-grow overflow-auto">
        <div className="prose max-w-none mb-6 flex-grow overflow-auto">
          {parse(mail.htmlBody || mail.textBody)}
        </div>
      </div>
      {selectedMailFiles.length > 0 ? (
        <div className="py-4 bg-gray-50 border-y border-gray-100 mb-6 px-4 rounded-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">
              Pièces jointes
            </h3>
            <button
              type="button"
              className="p-1 rounded hover:bg-gray-200"
              onClick={() => setAttachmentsMinimized((v) => !v)}
              aria-label={attachmentsMinimized ? "Agrandir" : "Réduire"}
            >
              {attachmentsMinimized ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </button>
          </div>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{
              maxHeight: attachmentsMinimized ? 0 : 400,
              opacity: attachmentsMinimized ? 0 : 1,
              pointerEvents: attachmentsMinimized ? "none" : "auto",
            }}
          >
            <div className="overflow-x-auto">
              <div className="flex gap-4 py-2">
                {selectedMailFiles.map((file) => {
                  const url = file.originalFile?.url;
                  const type = file.originalFile?.mimetype || "";
                  const name = file.originalFile?.fileName || "Fichier";
                  if (!url) return null;

                  return (
                    <div
                      key={file._id}
                      className="min-w-[180px] max-w-[220px] flex-shrink-0 flex flex-col border rounded shadow bg-white p-2 h-56"
                    >
                      <div className="flex-1 flex flex-col items-center justify-center">
                        {type.startsWith("image/") ? (
                          <img
                            src={url}
                            alt={name}
                            className="object-contain rounded mb-2 max-h-24 w-full"
                            style={{ maxHeight: 96 }}
                          />
                        ) : type === "application/pdf" ? (
                          <object
                            data={url}
                            type="application/pdf"
                            className="w-full h-24 mb-2 rounded"
                            aria-label={name}
                          >
                            <div className="text-xs text-gray-400">
                              Aperçu PDF non supporté
                            </div>
                          </object>
                        ) : type.startsWith("text/") ? (
                          <iframe
                            src={url}
                            className="w-full h-24 mb-2 rounded bg-gray-50"
                            title={name}
                          />
                        ) : (
                          <FileIcon className="h-10 w-10 text-gray-400 mb-2" />
                        )}
                        <div className="truncate text-xs text-gray-700 mb-1 w-full text-center">
                          {name}
                        </div>
                      </div>
                      <div className="mt-auto flex justify-center">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-xs underline"
                        >
                          Voir / Télécharger
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-4 bg-gray-50 border-y border-gray-100 mb-6 px-4 rounded-md">
          <h3 className="text-sm font-medium mb-3 text-gray-700">
            Pièces jointes
          </h3>
          <p className="text-sm text-gray-500">Aucune pièce jointe</p>
        </div>
      )}

      <div className="flex justify-between border-t border-gray-100 pt-4">
        <div className="flex gap-2">
          {activeTab !== "sent" && (
            <>
              {activeTab === "archived" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex gap-1.5 items-center"
                  onClick={onUnarchive}
                  disabled={isArchiving}
                >
                  {isArchiving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
                  ) : (
                    <Archive className="h-4 w-4" />
                  )}
                  {isArchiving ? "Désarchivage..." : "Restaurer"}
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
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
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
