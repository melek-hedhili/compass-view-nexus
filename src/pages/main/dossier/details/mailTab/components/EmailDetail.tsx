import React, { useState } from "react";
import parse from "html-react-parser";
import { Mail } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import NewDossierForm from "./NewDossierForm";
import LinkToFileForm from "./LinkToFileForm";
import { formatDate } from "@/utils/utils";

interface EmailDetailProps {
  selectedEmail: any | null;
  clientsData: any[];
  filesData: any[];
  provisionsData: string[];
  legalFormsData: string[];
  selectedEmailId: string | null;
  loading: boolean;
}

const EmailDetail: React.FC<EmailDetailProps> = ({
  selectedEmail,
  clientsData,
  filesData,
  provisionsData,
  legalFormsData,
  selectedEmailId,
  loading,
}) => {
  const [openNewDossier, setOpenNewDossier] = useState(false);
  const [openLinkToFile, setOpenLinkToFile] = useState(false);
  if (loading) {
    return (
      <div className="lg:col-span-2 border rounded-lg h-full overflow-y-auto flex flex-col animate-pulse">
        <div className="border-b p-4 bg-gray-50">
          <div className="h-6 w-1/2 bg-gray-300 rounded mb-4" /> {/* subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" /> {/* from */}
              <div className="h-4 w-24 bg-gray-200 rounded" />{" "}
              {/* clientName */}
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2" /> {/* date */}
              <div className="h-5 w-24 bg-gray-200 rounded-full" />{" "}
              {/* status */}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="h-8 w-40 bg-gray-200 rounded mr-2" />{" "}
            {/* Associer btn */}
            <div className="h-8 w-40 bg-gray-200 rounded" />{" "}
            {/* Nouveau dossier btn */}
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="bg-gray-50 p-4 rounded-lg h-full">
            <div className="h-40 w-full bg-gray-200 rounded mb-2" />{" "}
            {/* email body */}
            <div className="h-6 w-1/2 bg-gray-100 rounded mb-1" />
            <div className="h-6 w-1/3 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="lg:col-span-2 border rounded-lg h-full overflow-y-auto flex flex-col">
      {selectedEmail ? (
        <div className="h-full flex flex-col">
          <div className="border-b p-4 bg-gray-50">
            <h2 className="text-lg font-semibold mb-3">
              {selectedEmail.subject}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="text-gray-600">
                  <span className="font-medium">De:</span> {selectedEmail.from}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Client:</span>{" "}
                  {selectedEmail.clientName}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-gray-600">
                  <span className="font-medium">Date:</span>{" "}
                  {formatDate(selectedEmail.date)}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Statut:</span>{" "}
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Non traité
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                onClick={() => setOpenLinkToFile(true)}
              >
                Associer à un dossier
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                onClick={() => setOpenNewDossier(true)}
              >
                Nouveau dossier
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-gray-50 p-4 rounded-lg h-full">
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {parse(selectedEmail.htmlBody || selectedEmail.textBody)}
              </div>
            </div>
          </div>

          {/* Sheet for Associer à un dossier */}
          <Sheet open={openLinkToFile} onOpenChange={setOpenLinkToFile}>
            <SheetContent>
              <SheetHeader className="p-6 pb-4 border-b border-gray-100">
                <SheetTitle className="text-2xl font-bold text-formality-accent">
                  Associer à un dossier
                </SheetTitle>
                <SheetDescription className="text-gray-600">
                  Associez cet email à un dossier existant.
                </SheetDescription>
              </SheetHeader>
              <LinkToFileForm
                onClose={() => setOpenLinkToFile(false)}
                clientsData={clientsData}
                filesData={filesData}
                selectedEmailId={selectedEmailId}
              />
            </SheetContent>
          </Sheet>

          {/* Sheet for Nouveau dossier */}
          <Sheet open={openNewDossier} onOpenChange={setOpenNewDossier}>
            <SheetContent>
              <SheetHeader className="p-6 pb-4 border-b border-gray-100">
                <SheetTitle className="text-2xl font-bold text-formality-accent">
                  Nouveau dossier
                </SheetTitle>
                <SheetDescription>
                  Créez un nouveau dossier à partir de cet email.
                </SheetDescription>
              </SheetHeader>
              <NewDossierForm
                onClose={() => setOpenNewDossier(false)}
                clientsData={clientsData}
                provisionsData={provisionsData}
                legalFormsData={legalFormsData}
                selectedEmailId={selectedEmailId}
              />
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <div className="text-lg mb-2">Sélectionnez un email</div>
            <div className="text-sm">
              Choisissez un email dans la liste pour voir son contenu
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailDetail;
