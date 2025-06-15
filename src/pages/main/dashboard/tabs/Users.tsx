/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/api-swagger/services/UserService";
import { toast } from "sonner";
import type { UserDto } from "@/api-swagger/models/UserDto";
import type { CreateUserDto } from "@/api-swagger/models/CreateUserDto";
import AppLayout from "@/components/layout/AppLayout";
import NavTabs from "@/components/dashboard/NavTabs";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

// Update User interface to match UserDto
interface User extends UserDto {
  id: string;
}

const Users = () => {
  const [newUser, setNewUser] = useState({
    firstName: "",
    role: "ADMIN" as CreateUserDto.role,
    login: "",
    password: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserData, setEditUserData] = useState<Partial<User>>({});
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const roleOptions = ["ADMIN", "JURIST", "OPERATOR"] as const;
  const queryClient = useQueryClient();

  // Fetch users using TanStack Query
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", currentPage, itemsPerPage],
    queryFn: () =>
      UserService.userControllerFindAll({
        page: currentPage.toString(),
        perPage: itemsPerPage.toString(),
        value: searchTerm,
        searchFields: ["username", "email", "role"],
      }),
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserDto) =>
      UserService.userControllerCreate({ requestBody: data }),
    onSuccess: () => {
      toast.success("Utilisateur créé avec succès");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setNewUser({
        firstName: "",
        role: "ADMIN" as CreateUserDto.role,
        login: "",
        password: "",
      });
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de l'utilisateur");
      console.error("Error creating user:", error);
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserDto> }) =>
      UserService.userControllerUpdate({ id, requestBody: data }),
    onSuccess: () => {
      toast.success("Utilisateur mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUserId(null);
      setEditUserData({});
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
      console.error("Error updating user:", error);
    },
  });

  // Delete user mutation
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

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleCreateUser = async () => {
    if (!newUser.firstName || !newUser.login || !newUser.password) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        username: newUser.firstName,
        email: newUser.login,
        password: newUser.password,
        role: newUser.role,
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setUserToDelete(userId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUserMutation.mutateAsync(userToDelete);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
    setIsConfirmModalOpen(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setUserToDelete(null);
  };

  const handleStartEdit = (user: UserDto) => {
    setEditingUserId(user._id);
    setEditUserData({
      username: user.username,
      role: user.role,
      email: user.email,
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditUserData({});
  };

  const handleUpdateUser = async (userId: string) => {
    try {
      await updateUserMutation.mutateAsync({
        id: userId,
        data: {
          username: editUserData.username,
          email: editUserData.email,
          role: editUserData.role,
        },
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Filter users based on search term
  const filteredUsers =
    usersData?.data.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Calculate total pages
  const totalPages = Math.ceil((usersData?.data.length || 0) / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Display loading state
  if (isLoading) {
    return (
      <AppLayout>
        <NavTabs />
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-formality-primary"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Display error state
  if (error) {
    return (
      <AppLayout>
        <NavTabs />
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <p className="text-red-600">
              Une erreur est survenue lors du chargement des utilisateurs.
            </p>
            <Button
              variant="outline"
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["users"] })
              }
            >
              Réessayer
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <NavTabs />

      <div className="space-y-8">
        {/* Formulaire de création */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Ajouter un utilisateur
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Prénom
              </label>
              <Input
                className="border-gray-700"
                value={newUser.firstName}
                onChange={(e) =>
                  setNewUser({ ...newUser, firstName: e.target.value })
                }
                disabled={createUserMutation.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Rôle
              </label>
              <select
                className="w-full border border-gray-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-formality-primary/20 focus:border-formality-primary transition-all"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    role: e.target.value as CreateUserDto.role,
                  })
                }
                disabled={createUserMutation.isPending}
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email
              </label>
              <Input
                className="border-gray-700"
                value={newUser.login}
                onChange={(e) =>
                  setNewUser({ ...newUser, login: e.target.value })
                }
                disabled={createUserMutation.isPending}
              />
            </div>
            <div className="relative flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Mot de passe
              </label>
              <Input
                type="password"
                className="border-gray-700 pr-10"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Mot de passe
              </label>
              <Input
                type="password"
                className="border-gray-700"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                disabled={createUserMutation.isPending}
              />
            </div>
            <div>
              <Button
                className="w-full bg-formality-primary hover:bg-formality-primary/90 text-white"
                onClick={handleCreateUser}
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création...
                  </>
                ) : (
                  "Créer"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-lg font-medium text-gray-700">
              Utilisateurs existants
            </h2>
            <div className="relative mt-2 sm:mt-0 w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                className="pl-10 border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center p-4 rounded-md bg-gray-50"
              >
                {editingUserId === user._id ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Prénom
                      </label>
                      <Input
                        className="border-gray-700 bg-white"
                        value={editUserData.username || ""}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            username: e.target.value,
                          })
                        }
                        disabled={updateUserMutation.isPending}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Rôle
                      </label>
                      <select
                        className="w-full border border-gray-700 rounded-md px-3 py-2 bg-white"
                        value={editUserData.role || ""}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            role: e.target.value as UserDto["role"],
                          })
                        }
                        disabled={updateUserMutation.isPending}
                      >
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Email
                      </label>
                      <Input
                        className="border-gray-700 bg-white"
                        value={editUserData.email || ""}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            email: e.target.value,
                          })
                        }
                        disabled={updateUserMutation.isPending}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Mot de passe
                      </label>
                      <Input
                        type="password"
                        className="border-gray-700 bg-white"
                        value="••••••••••"
                        readOnly
                        disabled={updateUserMutation.isPending}
                      />
                    </div>
                    <div className="flex space-x-2 col-span-2 lg:col-span-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateUser(user._id)}
                        disabled={updateUserMutation.isPending}
                        className="flex-1"
                      >
                        {updateUserMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                            Mise à jour...
                          </>
                        ) : (
                          "Enregistrer"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        disabled={updateUserMutation.isPending}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Prénom
                      </label>
                      <Input
                        className="border-gray-700 bg-white"
                        value={user.username}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Rôle
                      </label>
                      <select
                        className="w-full border border-gray-700 rounded-md px-3 py-2 bg-white"
                        value={user.role}
                        disabled
                      >
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Email
                      </label>
                      <Input
                        className="border-gray-700 bg-white"
                        value={user.email}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Mot de passe
                      </label>
                      <Input
                        type="password"
                        className="border-gray-700 bg-white"
                        value="••••••••••"
                        readOnly
                      />
                    </div>
                    <div className="flex space-x-2 col-span-2 lg:col-span-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(user)}
                        className="text-formality-primary hover:text-formality-primary/80"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={deleteUserMutation.isPending}
                        className="text-red-600 hover:text-red-600/80"
                      >
                        {deleteUserMutation.isPending ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Pagination controls */}
            {filteredUsers.length > 0 ? (
              <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-6">
                <div className="flex items-center">
                  <label className="text-sm text-gray-500 mr-2">Afficher</label>
                  <select
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    {[5, 10, 20, 50].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-500 ml-2">par page</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Page précédente</span>
                  </Button>

                  <div className="flex items-center">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={i}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => paginate(pageNum)}
                          className="h-8 w-8 p-0 mx-1"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Page suivante</span>
                  </Button>
                </div>

                <div className="text-sm text-gray-500">
                  Page {currentPage} sur {totalPages}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucun utilisateur trouvé
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelDelete}
        onPressConfirm={handleConfirmDelete}
        title="Supprimer l'utilisateur"
        description="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
      />
    </AppLayout>
  );
};

export default Users;
