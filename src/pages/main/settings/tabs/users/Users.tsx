import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Search, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/api-swagger/services/UserService";
import type { UserDto } from "@/api-swagger/models/UserDto";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { UserForm } from "./UserForm";
import { useUserMutations } from "./hooks/useUserMutations";
import { DataTable } from "@/components/ui/data-table";
import { useForm } from "react-hook-form";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { useSearchDebounce } from "@/hooks/use-search-debounce";
import { Form } from "@/components/ui/form";
import { UserDetailsSheet } from "./UserDetailsSheet";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const Users = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] =
    useState<UserDto | null>(null);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);

  const methods = useForm<{
    search: string;
  }>({
    defaultValues: {
      search: "",
    },
  });

  const searchValue = useSearchDebounce({
    control: methods.control,
    name: "search",
  });
  useEffect(() => {
    if (paginationParams.page !== 1) {
      setPaginationParams((prev) => ({ ...prev, page: 1 }));
    }
  }, [searchValue]);
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    perPage: 5,
  });

  const handlePageChange = (newPage: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      perPage: newPerPage,
      page: 1,
    }));
  };

  const { deleteUserMutation } = useUserMutations();

  const { data: usersData, isLoading } = useQuery({
    queryKey: [
      "users",
      paginationParams.page,
      paginationParams.perPage,
      searchValue,
    ],
    queryFn: () =>
      UserService.userControllerFindAll({
        page: paginationParams.page.toString(),
        perPage: paginationParams.perPage.toString(),
        searchValue,
        searchFields: ["username", "email", "role"],
      }),
  });

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsNewUser(true);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: UserDto) => {
    setSelectedUser(user);
    setIsNewUser(false);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
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

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
    setIsNewUser(false);
  };

  const handleRowClick = (user: UserDto) => {
    setSelectedUserDetails(user);
    setIsDetailsSheetOpen(true);
  };

  const getFormTitle = () =>
    isNewUser ? "Nouvel utilisateur" : "Modifier l'utilisateur";

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-6">
        <div className="flex items-center mb-4 md:mb-0" />
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Form methods={methods}>
            <ControlledInput
              startAdornment={<Search className="h-4 w-4 text-gray-400" />}
              name="search"
              placeholder="Recherche..."
            />
          </Form>
          <Button
            className="bg-formality-primary hover:bg-formality-primary/90 text-white flex items-center gap-2"
            onClick={handleCreateUser}
          >
            <Plus className="h-4 w-4" />
            <span>Nouvel utilisateur</span>
          </Button>
        </div>
      </div>

      <div className="card-elegant w-full">
        <DataTable
          data={usersData?.data || []}
          columns={[
            {
              header: "Nom",
              key: "username",
            },
            {
              header: "Email",
              key: "email",
            },
            {
              header: "Rôle",
              key: "role",
            },
            {
              header: "Actions",
              render: (value, row) => (
                <TooltipProvider>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditUser(row);
                          }}
                        >
                          <Pencil className="h-4 w-4 text-formality-primary" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Editer</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteUser(row._id);
                          }}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Supprimer</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              ),
            },
          ]}
          count={usersData?.count}
          loading={isLoading}
          page={paginationParams.page}
          perPage={paginationParams.perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onRowClick={handleRowClick}
        />
      </div>

      <UserDetailsSheet
        isOpen={isDetailsSheetOpen}
        onClose={() => {
          setIsDetailsSheetOpen(false);
          setSelectedUserDetails(null);
        }}
        user={selectedUserDetails}
      />

      <UserForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={getFormTitle()}
        isNew={isNewUser}
        user={selectedUser}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelDelete}
        onPressConfirm={handleConfirmDelete}
        title="Supprimer l'utilisateur"
        description="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
      />
    </div>
  );
};

export default Users;
