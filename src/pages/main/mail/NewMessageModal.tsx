import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { EmailService } from "@/api-swagger/services/EmailService";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type CreateEmailDto } from "@/api-swagger";
import { toast } from "sonner";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { type EmailFormProps } from "./mail.types";
import { ControlledTextarea } from "@/components/ui/controlled/controlled-textarea/controlled-textarea";

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function NewMessageModal({ isOpen, onClose }: NewMessageModalProps) {
  const queryClient = useQueryClient();
  const methods = useForm<EmailFormProps>({
    defaultValues: {
      to: undefined,
      subject: undefined,
      textBody: undefined,
      htmlBody: undefined,
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateEmailDto) =>
      EmailService.emailControllerSendEmail({
        requestBody: data,
      }),
    onSuccess: async () => {
      toast.success("Email envoyé avec succès");
      await queryClient.invalidateQueries({
        queryKey: ["emails", "counts"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["emails", "sent"],
      });
      onClose();
      methods.reset();
    },
    onError: (error) => {
      const errorMessage = (error as any).response?.data?.message;
      toast.error(errorMessage ?? "Erreur lors de l'envoi de l'email");
    },
  });
  const onSubmit: SubmitHandler<EmailFormProps> = async (data) => {
    mutate(data);
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
        <Form methods={methods} onSubmit={onSubmit}>
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  À
                </label>
                <ControlledInput
                  name="to"
                  required
                  placeholder="Adresse email du destinataire"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objet
                </label>
                <ControlledInput
                  name="subject"
                  required
                  placeholder="Objet du message"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <ControlledTextarea
                name="textBody"
                required
                placeholder="Rédigez votre message ici..."
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

export default NewMessageModal;
