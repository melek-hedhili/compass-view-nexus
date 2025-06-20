import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip } from "lucide-react";
import { EmailService } from "@/api-swagger/services/EmailService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { EmailDto } from "@/api-swagger/models/EmailDto";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { type SubmitHandler, useForm } from "react-hook-form";
import { EmailFormProps } from "./mail.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateEmailDto } from "@/api-swagger";
import { toast } from "sonner";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { ControlledTextarea } from "@/components/ui/controlled/controlled-textarea/controlled-textarea";
import { Form } from "@/components/ui/form";

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
      textBody: `\n\n--- Message original ---\nDe: ${
        originalEmail.from
      }\nDate: ${format(new Date(originalEmail.date), "dd MMMM yyyy HH:mm", {
        locale: fr,
      })}\nObjet: ${originalEmail.subject}\n\n${originalEmail.textBody || ""}`,
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
      <SheetContent className="w-[450px] sm:w-[900px] overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-xl font-semibold">Répondre</SheetTitle>
          <SheetDescription className="text-gray-600">
            Rédigez votre réponse ci-dessous.
          </SheetDescription>
        </SheetHeader>
        <Form methods={methods} onSubmit={onSubmit}>
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

            <ControlledTextarea
              placeholder="Rédigez votre réponse ici..."
              name="textBody"
              required
            />

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
