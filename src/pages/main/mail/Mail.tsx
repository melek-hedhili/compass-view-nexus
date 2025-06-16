
import React, { useState, useEffect } from "react";
import { Mail as MailIcon, Search, Plus, Filter, Archive, Send, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MailDetail from "./MailDetail";
import NewMessageModal from "./NewMessageModal";
import { useQuery } from "@tanstack/react-query";
import { EmailService } from "@/api-swagger";

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  isRead: boolean;
  hasAttachments: boolean;
  isImportant: boolean;
}

const Mail = () => {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");

  const { data: emails = [], isLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: () => EmailService.emailControllerFindAll(1, 50),
  });

  // Mock data structure for UI consistency
  const mockEmails: Email[] = [
    {
      id: "1",
      sender: "ilyes@example.com",
      subject: "Hello",
      preview: "This is a test email...",
      date: "2025-01-15",
      isRead: false,
      hasAttachments: false,
      isImportant: true,
    },
    {
      id: "2",
      sender: "client@company.com", 
      subject: "Demande de création de dossier",
      preview: "Bonjour, nous souhaiterions créer un nouveau dossier...",
      date: "2025-01-14",
      isRead: true,
      hasAttachments: true,
      isImportant: false,
    },
    {
      id: "3",
      sender: "hedhili@law.com",
      subject: "Rapport d'analyse",
      preview: "Veuillez trouver ci-joint le rapport d'analyse...",
      date: "2025-01-13",
      isRead: false,
      hasAttachments: true,
      isImportant: false,
    },
  ];

  const filteredEmails = mockEmails.filter(email =>
    email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTabCount = (tab: string) => {
    switch (tab) {
      case "inbox":
        return mockEmails.filter(e => !e.isRead).length;
      case "sent":
        return 5;
      case "archive":
        return 12;
      default:
        return 0;
    }
  };

  if (selectedEmail) {
    return (
      <MailDetail
        emailId={selectedEmail}
        onClose={() => setSelectedEmail(null)}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MailIcon className="h-6 w-6 text-formality-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Boîte mail</h1>
        </div>
        <Button
          onClick={() => setIsNewMessageOpen(true)}
          className="bg-formality-primary hover:bg-formality-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau message
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher dans les emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            Boîte de réception
            {getTabCount("inbox") > 0 && (
              <Badge variant="secondary" className="ml-1">
                {getTabCount("inbox")}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            Envoyés
            <Badge variant="secondary" className="ml-1">
              {getTabCount("sent")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="archive" className="flex items-center gap-2">
            Archivés
            <Badge variant="secondary" className="ml-1">
              {getTabCount("archive")}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="mt-6">
          {/* Email list */}
          <div className="space-y-2">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email.id)}
                className={`p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  !email.isRead ? "bg-blue-50 border-blue-200" : "bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${!email.isRead ? "font-semibold" : ""}`}>
                        {email.sender}
                      </span>
                      {email.isImportant && (
                        <Badge variant="destructive" className="text-xs">
                          Important
                        </Badge>
                      )}
                    </div>
                    <h3 className={`text-sm mb-1 ${!email.isRead ? "font-semibold" : ""}`}>
                      {email.subject}
                    </h3>
                    <p className="text-gray-500 text-sm truncate">{email.preview}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-gray-500">{email.date}</span>
                    {email.hasAttachments && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEmails.length === 0 && (
            <div className="text-center py-12">
              <MailIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun email trouvé
              </h3>
              <p className="text-gray-500">
                Aucun email ne correspond à votre recherche.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          <div className="text-center py-12">
            <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Messages envoyés
            </h3>
            <p className="text-gray-500">
              Vos messages envoyés apparaîtront ici.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="archive" className="mt-6">
          <div className="text-center py-12">
            <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Messages archivés
            </h3>
            <p className="text-gray-500">
              Vos messages archivés apparaîtront ici.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <NewMessageModal
        isOpen={isNewMessageOpen}
        onClose={() => setIsNewMessageOpen(false)}
      />
    </div>
  );
};

export default Mail;
