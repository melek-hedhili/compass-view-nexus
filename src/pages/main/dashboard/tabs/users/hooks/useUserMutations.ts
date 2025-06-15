
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/api-swagger/services/UserService";
import type { UserDto } from "@/api-swagger/models/UserDto";
import type { CreateUserDto } from "@/api-swagger/models/CreateUserDto";
import { toast } from "sonner";

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserDto) =>
      UserService.userControllerCreate({ requestBody: data }),
    onSuccess: () => {
      toast.success("Utilisateur créé avec succès");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de l'utilisateur");
      console.error("Error creating user:", error);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserDto> }) =>
      UserService.userControllerUpdate({ id, requestBody: data }),
    onSuccess: () => {
      toast.success("Utilisateur mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
      console.error("Error updating user:", error);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => UserService.userControllerRemove({ id }),
    onSuccess: () => {
      toast.success("Utilisateur supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression de l'utilisateur");
      console.error("Error deleting user:", error);
    },
  });

  return {
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  };
};
