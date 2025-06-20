/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { TabKey } from "./mail.types";
import { EmailDto } from "@/api-swagger/models/EmailDto";
import NewMessageModal from "./NewMessageModal";
import InboxMail from "./InboxMail";
import ArchivedMail from "./ArchivedMail";
import SentMail from "./SentMail";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EmailService } from "@/api-swagger";
import { useToast } from "@/hooks/use-toast";
import ReplyModal from "./ReplyModal";
import MailDetail from "./MailDetail";
import { Sheet, SheetContent } from "@/components/ui/sheet";

// Extend EmailDto with additional properties we need

const Mail = () => {
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [selectedMail, setSelectedMail] = useState<EmailDto | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const tabKey = (location.pathname.split("/").pop() ?? "inbox") as TabKey;
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState<EmailDto | null>(null);

  const handleCloseNewMessageModal = () => {
    setIsNewMessageOpen(false);
  };
  const { data: counts } = useQuery({
    queryKey: ["emails", "counts"],
    queryFn: () => EmailService.emailControllerGetEmailCount(),
  });
  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: (id: string) => EmailService.emailControllerArchive({ id }),
    onSuccess: async () => {
      console.log("invalidating");
      // Invalidate all queries that start with ["emails", "inbox"] or ["emails", "archived"]
      await queryClient.invalidateQueries({
        queryKey: ["emails", "inbox"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["emails", "archived"],
      });
      // Also invalidate the counts query
      await queryClient.invalidateQueries({
        queryKey: ["emails", "counts"],
      });

      setSelectedMail(null);
      toast({
        title: "Archivé",
        description: "Le mail a été archivé avec succès.",
      });
      //close drawer
      setIsDrawerOpen(false);
    },
    onError: (error) => {
      console.error("Error archiving email:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'archivage du mail. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  // Handle archiving an email
  const handleArchive = async () => {
    if (selectedMail) {
      await archiveMutation.mutateAsync(selectedMail._id);
    }
  };

  // Handle unarchiving an email
  const handleUnarchive = async () => {
    if (selectedMail) {
      await archiveMutation.mutateAsync(selectedMail._id);
    }
  };

  // Handle opening reply modal
  const handleReply = () => {
    if (selectedMail) {
      setReplyToEmail(selectedMail);
      setIsReplyOpen(true);
    }
  };

  const handleRowClick = (email: EmailDto) => {
    setSelectedMail(email);
    setIsDrawerOpen(true);
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex-1" />
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button
            className="bg-formality-primary hover:bg-formality-primary/90 text-white flex items-center gap-2"
            onClick={() => setIsNewMessageOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau message</span>
          </Button>
        </div>
      </div>

      {/* Segmented Tabs with counts */}
      <Tabs
        value={tabKey}
        onValueChange={(v) => navigate(`/dashboard/mail/${v}`)}
        className="mb-4"
      >
        <TabsList className="flex gap-2 rounded-lg bg-gray-100 p-1 w-full md:w-auto">
          <TabsTrigger
            value="inbox"
            className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-formality-primary rounded-lg font-semibold transition-colors"
          >
            Boîte de réception
            <Badge variant="secondary" className="ml-2 px-2">
              {counts?.receivedCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="archived"
            className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-formality-primary rounded-lg font-semibold transition-colors"
          >
            Archivé
            <Badge variant="secondary" className="ml-2 px-2">
              {counts?.archivedCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="sent"
            className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-formality-primary rounded-lg font-semibold transition-colors"
          >
            Envoyé
            <Badge variant="secondary" className="ml-2 px-2">
              {counts?.sentCount}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="focus-visible:outline-none mt-4">
          <InboxMail onRowClick={handleRowClick} />
        </TabsContent>
        <TabsContent
          value="archived"
          className="focus-visible:outline-none mt-4"
        >
          <ArchivedMail onRowClick={handleRowClick} />
        </TabsContent>
        <TabsContent value="sent" className="focus-visible:outline-none mt-4">
          <SentMail onRowClick={handleRowClick} />
        </TabsContent>
      </Tabs>

      {/* New Message Modal */}
      <NewMessageModal
        isOpen={isNewMessageOpen}
        onClose={handleCloseNewMessageModal}
      />

      {replyToEmail && (
        <ReplyModal
          isOpen={isReplyOpen}
          onClose={() => {
            setIsReplyOpen(false);
            setReplyToEmail(null);
          }}
          originalEmail={replyToEmail}
        />
      )}
      {/* Mail Detail Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-4xl lg:w-[900px] h-full max-h-screen p-0"
          style={{ overflow: "auto" }}
        >
          {/* Make whole drawer scrollable, not just form: remove internal py/padding that creates fixed height */}
          <div className="h-full">
            <MailDetail
              mail={selectedMail}
              onClose={() => setSelectedMail(null)}
              onReply={handleReply}
              onArchive={handleArchive}
              onUnarchive={handleUnarchive}
              isArchiving={archiveMutation.isPending}
              activeTab={tabKey}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Mail;
