import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmailService } from "@/api-swagger/services/EmailService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { EmailDto } from "@/api-swagger/models/EmailDto";

// Extend EmailDto with additional properties we need
interface ExtendedEmailDto extends EmailDto {
  _id: string;
  status?: "non-lu" | "lu";
  attachments?: number;
}

// ReplyModal component
function ReplyModal({
  onClose,
  originalEmail,
}: {
  onClose: () => void;
  originalEmail: ExtendedEmailDto;
}) {
  const [emailData, setEmailData] = useState({
    to: originalEmail.from,
    subject: originalEmail.subject?.startsWith("Re: ")
      ? originalEmail.subject
      : `Re: ${originalEmail.subject}`,
    message: `\n\n--- Message original ---\nDe: ${
      originalEmail.from
    }\nDate: ${format(new Date(originalEmail.date), "dd MMMM yyyy HH:mm", {
      locale: fr,
    })}\nObjet: ${originalEmail.subject}\n\n${originalEmail.textBody || ""}`,
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
        description: "Réponse envoyée avec succès",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          "Erreur lors de l'envoi de la réponse. Veuillez vérifier la console pour plus de détails.",
        variant: "destructive",
      });
      console.error("Error sending reply:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-100 relative">
        <h2 className="text-xl font-bold text-formality-accent mb-3 pr-8">
          Répondre
        </h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-[100px_1fr] items-center">
            <label
              htmlFor="reply-to-email"
              className="font-medium text-gray-700"
            >
              À:
            </label>
            <Input
              id="reply-to-email"
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
              htmlFor="reply-subject-email"
              className="font-medium text-gray-700"
            >
              Objet:
            </label>
            <Input
              id="reply-subject-email"
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
            placeholder="Rédigez votre réponse ici..."
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
  );
}

export default ReplyModal;
