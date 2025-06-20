import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ListService } from "@/api-swagger/services/ListService";
import { ListDto } from "@/api-swagger";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { ListsGrid } from "./ListsGrid";
import { ListForm } from "./ListForm";
import { ListDetails } from "./ListDetails";
import { usePagination } from "./hooks/usePagination";
import { useListMutations } from "./hooks/useListMutations";

const Lists = () => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ListDto>>({
    fieldName: "",
    values: [],
  });

  const { paginationParams, handleSearch } = usePagination();
  const { deleteListMutation } = useListMutations();

  // Query for fetching all lists
  const { data: listsData, isLoading } = useQuery({
    queryKey: [
      "lists",
      paginationParams.page,
      paginationParams.perPage,
      paginationParams.sortField,
      paginationParams.sortOrder,
    ],
    queryFn: () =>
      ListService.listControllerFindAll({
        page: paginationParams.page.toString(),
        perPage: paginationParams.perPage.toString(),
        ...(paginationParams.sortField && {
          sortField: paginationParams.sortField,
        }),
        ...(paginationParams.sortOrder && {
          sortOrder: paginationParams.sortOrder,
        }),
      }),
  });

  const handleEditList = (list: ListDto) => {
    setSelectedListId(list._id);
    setFormData({
      fieldName: list.fieldName,
      values: list.values,
    });
    setIsEditDrawerOpen(true);
  };

  const handleViewList = (list: ListDto) => {
    setSelectedListId(list._id);
    setIsDetailsDrawerOpen(true);
  };

  const handleCreateList = () => {
    setSelectedListId(null);
    setFormData({ fieldName: "", values: [] });
    setIsCreateDrawerOpen(true);
  };

  const handleDeleteList = (id: string) => {
    setListToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (listToDelete) {
      deleteListMutation.mutateAsync(listToDelete);
    }
    setIsConfirmModalOpen(false);
    setListToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setListToDelete(null);
  };

  const filteredLists =
    listsData?.data?.filter((list) => {
      if (!paginationParams.searchTerm) return true;
      return (
        list.fieldName
          .toLowerCase()
          .includes(paginationParams.searchTerm.toLowerCase()) ||
        list.values
          ?.join(", ")
          .toLowerCase()
          .includes(paginationParams.searchTerm.toLowerCase())
      );
    }) || [];

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0" />
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 border border-gray-200"
              value={paginationParams.searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex items-center gap-2 bg-formality-primary hover:bg-formality-primary/90 text-white"
              onClick={handleCreateList}
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle liste</span>
            </Button>
          </div>
        </div>
      </div>

      <ListsGrid
        lists={filteredLists}
        isLoading={isLoading}
        onView={handleViewList}
        onEdit={handleEditList}
        onDelete={handleDeleteList}
      />

      <ListForm
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        title="Nouvelle liste"
        isNew
        formData={formData}
        setFormData={setFormData}
      />

      <ListForm
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title="Modifier la liste"
        isNew={false}
        formData={formData}
        setFormData={setFormData}
        selectedListId={selectedListId}
      />

      <ListDetails
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        selectedListId={selectedListId}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelDelete}
        onPressConfirm={handleConfirmDelete}
        title="Supprimer la liste"
        description="Êtes-vous sûr de vouloir supprimer cette liste ?"
      />
    </div>
  );
};

export default Lists;
