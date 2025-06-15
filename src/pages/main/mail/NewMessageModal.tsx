
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmailService } from "@/api-swagger/services/EmailService";

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
    <div className="flex flex-col h-full bg-white">
      <div className="relative p-6 pb-0 border-b border-gray-100 flex items-center">
        <h2 className="text-xl font-bold text-formality-accent pr-8">Nouveau message</h2>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-4 p-1 h-8 w-8 rounded-full hover:bg-gray-100"
          onClick={onClose}
        >
          <X className="h-5 w-5 text-gray-500" />
        </Button>
      </div>
      <div className="flex flex-col gap-6 px-6 py-6">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">À</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
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
          <h3 className="text-sm font-medium mb-2 text-gray-700">Pièces jointes</h3>
          <Button
            variant="outline"
            size="sm"
            className="flex gap-1.5 items-center"
            disabled
          >
            <Paperclip className="h-4 w-4" />
            Ajouter une pièce jointe
          </Button>
          <span className="text-xs text-gray-400 ml-2">(Bientôt disponible)</span>
        </div>
      </div>
      <div className="flex justify-end p-6 border-t border-gray-100 mt-auto">
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
  );
}

export default NewMessageModal;
