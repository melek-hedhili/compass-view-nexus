
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmailService } from "@/api-swagger/services/EmailService";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function NewMessageModal({ isOpen, onClose }: NewMessageModalProps) {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!emailData.to || !emailData.subject || !emailData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }
    setIsSending(true);
    try {
      await EmailService.emailControllerSendEmail({
        requestBody: {
          to: emailData.to,
          subject: emailData.subject,
          textBody: emailData.message,
          htmlBody: emailData.message,
        },
      });
      toast({
        title: "Succès",
        description: "Email envoyé avec succès",
      });
      setEmailData({ to: "", subject: "", message: "" });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          "Erreur lors de l'envoi de l'email. Veuillez vérifier la console pour plus de détails.",
        variant: "destructive",
      });
      console.error("Error sending email:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[450px] sm:w-[900px] overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-xl font-semibold">
            Nouveau message
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Rédigez votre message ci-dessous.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                À
              </label>
              <Input
                placeholder="Adresse email du destinataire"
                className="border-gray-200"
                value={emailData.to}
                onChange={(e) =>
                  setEmailData((prev) => ({ ...prev, to: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objet
              </label>
              <Input
                placeholder="Objet du message"
                className="border-gray-200"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              className="w-full min-h-[180px] border border-gray-200 rounded-md p-3 resize-none"
              placeholder="Rédigez votre message ici..."
              value={emailData.message}
              onChange={(e) =>
                setEmailData((prev) => ({ ...prev, message: e.target.value }))
              }
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-700">
              Pièces jointes
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="flex gap-1.5 items-center"
              disabled
            >
              <Paperclip className="h-4 w-4" />
              Ajouter une pièce jointe
            </Button>
            <span className="text-xs text-gray-400 ml-2">
              (Bientôt disponible)
            </span>
          </div>
          
          <div className="flex justify-end pt-6 border-t border-gray-100">
            <Button
              className="bg-formality-primary hover:bg-formality-primary/90 text-white flex items-center gap-1.5"
              size="sm"
              onClick={handleSend}
              disabled={isSending}
            >
              {isSending ? "Envoi..." : "Envoyer"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NewMessageModal;
