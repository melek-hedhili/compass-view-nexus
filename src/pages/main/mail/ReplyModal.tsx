import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { EmailService } from "@/api-swagger/services/EmailService";
import { type EmailDto } from "@/api-swagger/models/EmailDto";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type EmailFormProps } from "./mail.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type CreateEmailDto } from "@/api-swagger";
import { toast } from "sonner";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { RichTextEditor } from "@/components/ui/controlled/controlled-rich-text-editor/rich-text-editor";
import { Form } from "@/components/ui/form";
import parse from "html-react-parser";
import { formatDate } from "@/utils/utils";

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalEmail: EmailDto;
}

// ReplyModal component
function ReplyModal({ isOpen, onClose, originalEmail }: ReplyModalProps) {
  const queryClient = useQueryClient();
  const methods = useForm<EmailFormProps>({
    defaultValues: {
      to: originalEmail.from,
      subject: originalEmail.subject?.startsWith("Re: ")
        ? originalEmail.subject
        : `Re: ${originalEmail.subject}`,
      htmlBody: `<br/><br/>--- Message original ---<br/>De: ${
        originalEmail.from
      }<br/>Date: ${formatDate(originalEmail.date)}<br/>Objet: ${
        originalEmail.subject
      }<br/><br/>$${originalEmail.htmlBody || originalEmail.textBody || ""}`,
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateEmailDto) =>
      EmailService.emailControllerSendEmail({
        requestBody: data,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["emails", "counts"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["emails", "sent"],
      });
      toast.success("Email envoyé avec succès");
      onClose();
      methods.reset();
    },
    onError: (error) => {
      toast.error("Erreur lors de l'envoi de l'email");
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<EmailFormProps> = async (data) => {
    mutate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader className="p-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-xl font-semibold">Répondre</SheetTitle>
          <SheetDescription className="text-gray-600">
            Rédigez votre réponse ci-dessous.
          </SheetDescription>
        </SheetHeader>
        <Form methods={methods} onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-[100px_1fr] items-center">
                <label
                  htmlFor="reply-to-email"
                  className="font-medium text-gray-700"
                >
                  À:
                </label>
                <ControlledInput
                  id="reply-to-email"
                  placeholder="Adresse email du destinataire"
                  className="border-gray-200"
                  name="to"
                  required
                />
              </div>

              <div className="grid grid-cols-[100px_1fr] items-center">
                <label
                  htmlFor="reply-subject-email"
                  className="font-medium text-gray-700"
                >
                  Objet:
                </label>
                <ControlledInput
                  id="reply-subject-email"
                  placeholder="Objet du message"
                  className="border-gray-200"
                  name="subject"
                  required
                />
              </div>
            </div>

            <RichTextEditor
              name="htmlBody"
              rules={{
                required: "Le message est requis",
              }}
              placeholder="Rédigez votre réponse ici..."
            />

            <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
              <h3 className="text-sm font-medium mb-3 text-gray-700">
                Message original
              </h3>
              <div className="prose prose-sm max-w-none">
                {parse(originalEmail.htmlBody || originalEmail.textBody)}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
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

            <div className="flex justify-end pt-6 border-t border-gray-100">
              <Button
                className="bg-formality-primary hover:bg-formality-primary/90 text-white flex items-center gap-1.5"
                size="sm"
                type="submit"
                loading={isPending}
              >
                Envoyer
              </Button>
            </div>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default ReplyModal;
