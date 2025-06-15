
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/api-swagger/services/UserService";
import type { UserDto } from "@/api-swagger/models/UserDto";
import type { CreateUserDto } from "@/api-swagger/models/CreateUserDto";
import AppLayout from "@/components/layout/AppLayout";
import NavTabs from "@/components/dashboard/NavTabs";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { UserForm } from "./UserForm";
import { UsersList } from "./UsersList";
import { UsersPagination } from "./UsersPagination";
import { useUserMutations } from "./hooks/useUserMutations";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const { createUserMutation, updateUserMutation, deleteUserMutation } = useUserMutations();

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

  const handleCreateUser = async () => {
    if (!newUser.firstName || !newUser.login || !newUser.password) {
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        username: newUser.firstName,
        email: newUser.login,
        password: newUser.password,
        role: newUser.role,
      });
      setNewUser({
        firstName: "",
        role: "ADMIN" as CreateUserDto.role,
        login: "",
        password: "",
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
      setEditingUserId(null);
      setEditUserData({});
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const filteredUsers =
    usersData?.data.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const totalPages = Math.ceil((usersData?.data.length || 0) / itemsPerPage);

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

  if (error) {
    return (
      <AppLayout>
        <NavTabs />
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <p className="text-red-600">
              Une erreur est survenue lors du chargement des utilisateurs.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <NavTabs />

      <div className="space-y-8">
        <UserForm
          newUser={newUser}
          setNewUser={setNewUser}
          onCreateUser={handleCreateUser}
          isCreating={createUserMutation.isPending}
        />

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

          <UsersList
            users={filteredUsers}
            editingUserId={editingUserId}
            editUserData={editUserData}
            setEditUserData={setEditUserData}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            updateLoading={updateUserMutation.isPending}
            deleteLoading={deleteUserMutation.isPending}
          />

          <UsersPagination
            filteredUsers={filteredUsers}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newPerPage) => {
              setItemsPerPage(newPerPage);
              setCurrentPage(1);
            }}
          />
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
