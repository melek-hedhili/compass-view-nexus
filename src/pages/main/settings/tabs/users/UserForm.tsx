import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  type UserDto,
  type CreateUserDto,
  type UpdateUserDto,
} from "@/api-swagger";
import { useUserMutations } from "./hooks/useUserMutations";
import { Form } from "@/components/ui/form";
import { type SubmitHandler, useForm } from "react-hook-form";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select/controlled-select";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isNew: boolean;
  user: UserDto | null;
}

const roleOptions = [
  { label: "Administrateur", value: "ADMIN" },
  { label: "Juriste", value: "JURIST" },
  { label: "Opérateur", value: "OPERATOR" },
];

export const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  title,
  isNew,
  user,
}) => {
  const { createUserMutation, updateUserMutation } = useUserMutations(() => {
    methods.reset();
    onClose();
  });

  const methods = useForm<CreateUserDto>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "ADMIN" as CreateUserDto.role,
    },
  });

  const onSubmit: SubmitHandler<CreateUserDto> = (data) => {
    if (isNew) {
      createUserMutation.mutate(data);
    } else if (user?._id) {
      const updateData: UpdateUserDto = {
        username: data.username,
        email: data.email,
        role: data.role,
      };
      updateUserMutation.mutate({ id: user._id, data: updateData });
    }
  };

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      if (isNew) {
        // Reset form for new user - ensure it's completely empty
        methods.reset({
          username: "",
          email: "",
          password: "",
          role: "ADMIN" as CreateUserDto.role,
        });
      } else if (user) {
        // Populate form with existing user data
        methods.reset({
          username: user.username || "",
          email: user.email || "",
          password: "",
          role: user.role || ("ADMIN" as CreateUserDto.role),
        });
      }
    }
  }, [isOpen, isNew, user, methods]);

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader className="p-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold text-formality-accent">
            {title}
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Remplissez les informations de l'utilisateur ci-dessous.
          </SheetDescription>
        </SheetHeader>

        <Form methods={methods} onSubmit={onSubmit} className="p-6">
          <div className="space-y-6">
            <ControlledInput
              required
              name="username"
              label="Prénom"
              placeholder="Prénom de l'utilisateur"
            />

            <ControlledSelect
              name="role"
              label="Rôle"
              required
              placeholder="Sélectionnez un rôle"
              data={roleOptions}
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label}
            />

            <ControlledInput
              required
              name="email"
              label="Email"
              type="email"
              placeholder="email@exemple.com"
              rules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Adresse email invalide",
                },
              }}
            />

            {isNew && (
              <ControlledInput
                required
                name="password"
                label="Mot de passe"
                type="password"
                placeholder="Mot de passe"
                minLength={6}
                rules={{
                  minLength: {
                    value: 6,
                    message:
                      "Le mot de passe doit contenir au moins 6 caractères",
                  },
                }}
              />
            )}

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button
                type="submit"
                loading={
                  createUserMutation.isPending || updateUserMutation.isPending
                }
                className="bg-formality-primary hover:bg-formality-primary/90 text-white"
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
