import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Paperclip, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmailService } from "@/api-swagger/services/EmailService";

// NewMessageModal component
function NewMessageModal({ onClose }: { onClose: () => void }) {
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
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[600px] lg:w-[900px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 p-1 h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={onClose}
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>
            <h2 className="text-xl font-bold text-formality-accent mb-3 pr-8">
              Nouveau message
            </h2>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-[100px_1fr] items-center">
                <label htmlFor="to-email" className="font-medium text-gray-700">
                  À:
                </label>
                <Input
                  id="to-email"
                  placeholder="Adresse email du destinataire"
                  className="border-gray-200"
                  value={emailData.to}
                  onChange={(e) =>
                    setEmailData((prev) => ({ ...prev, to: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center">
                <label
                  htmlFor="subject-email"
                  className="font-medium text-gray-700"
                >
                  Objet:
                </label>
                <Input
                  id="subject-email"
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
          </div>

          <div className="px-6 py-4 flex-grow overflow-auto">
            <div className="border border-gray-200 rounded-md min-h-[300px] p-4">
              <textarea
                className="w-full h-full min-h-[300px] resize-none focus:outline-none"
                placeholder="Rédigez votre message ici..."
                value={emailData.message}
                onChange={(e) =>
                  setEmailData((prev) => ({ ...prev, message: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="px-4 py-4 bg-gray-50 border-t border-gray-100">
            <h3 className="text-sm font-medium mb-3 text-gray-700">
              Pièces jointes
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1.5 items-center"
              >
                <Paperclip className="h-4 w-4" />
                Ajouter une pièce jointe
              </Button>
            </div>
          </div>

          <div className="flex justify-end p-6 border-t border-gray-100">
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
      </CardContent>
    </div>
  );
}

export default NewMessageModal;
