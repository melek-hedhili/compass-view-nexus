import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, List as ListIcon } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ListService } from "@/api-swagger/services/ListService";
import { type ListDto } from "@/api-swagger";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { ListForm } from "./ListForm";
import { ListDetails } from "./ListDetails";
import { useListMutations } from "./hooks/useListMutations";
import { PaginatedListGrid } from "./PaginatedListGrid";
import { ListCard } from "./ListCard";
import { useForm } from "react-hook-form";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { useSearchDebounce } from "@/hooks/use-search-debounce";
import { Form } from "@/components/ui/form";
import SettingsNoDataFound from "@/components/layout/SettingsNoDataFound";
import { ArchiveFilterButton } from "@/components/ui/ArchiveFilterButton";

const Lists = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<ListDto | null>(null);
  const [isNewList, setIsNewList] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [listToArchive, setListToArchive] = useState<{
    listId: string;
    type: "archive" | "unarchive";
  } | null>(null);
  const [isArchived, setIsArchived] = useState(false);

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

  const { archiveListMutation } = useListMutations();

  // Infinite query for fetching lists
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["lists", searchValue, isArchived],
      queryFn: ({ pageParam = 1 }) =>
        ListService.listControllerFindAll({
          page: pageParam.toString(),
          perPage: "12",
          searchValue,
          searchFields: ["fieldName", "_id"],
          filters: JSON.stringify([
            {
              field: "isArchived",
              values: [isArchived.toString()],
            },
          ]),
        }),
      getNextPageParam: (lastPage, allPages) => {
        const total = lastPage.count;
        const loaded = allPages.flatMap((p) => p.data).length;
        return loaded < total ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
      select: (data) => data.pages.flatMap((page) => page.data),
    });

  const handleEditList = (list: ListDto) => {
    setSelectedList(list);
    setIsNewList(false);
    setIsFormOpen(true);
  };

  const handleViewList = (list: ListDto) => {
    setSelectedList(list);
    setIsDetailsDrawerOpen(true);
  };

  const handleCreateList = () => {
    setSelectedList(null);
    setIsNewList(true);
    setIsFormOpen(true);
  };

  const handleArchiveList = (id: string, type: "archive" | "unarchive") => {
    setListToArchive({ listId: id, type });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmArchive = () => {
    if (listToArchive) {
      archiveListMutation.mutateAsync({
        id: listToArchive.listId,
        type: listToArchive.type,
      });
    }
    setIsConfirmModalOpen(false);
    setListToArchive(null);
  };

  const handleCancelArchive = () => {
    setIsConfirmModalOpen(false);
    setListToArchive(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedList(null);
    setIsNewList(false);
  };

  const getFormTitle = () =>
    isNewList ? "Nouvelle liste" : "Modifier la liste";

  const renderListCard = (list: ListDto) => (
    <ListCard
      key={list._id}
      list={list}
      onView={handleViewList}
      onEdit={handleEditList}
      onArchive={handleArchiveList}
    />
  );

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
          <div className="flex flex-col sm:flex-row gap-3">
            <ArchiveFilterButton
              archived={isArchived}
              onToggle={() => setIsArchived((prev) => !prev)}
              featureName="Listes"
              icon={<ListIcon className="h-4 w-4" />}
            />
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

      <PaginatedListGrid
        data={data || []}
        renderItem={renderListCard}
        renderEmpty={() => (
          <SettingsNoDataFound
            icon={<ListIcon className="h-12 w-12 text-gray-400" />}
            title={
              isArchived
                ? "Aucune liste archivée trouvée"
                : isArchived
                ? "Aucune liste non archivée trouvée"
                : "Aucune liste trouvée"
            }
            description={
              isArchived
                ? "Ajoutez une liste pour commencer."
                : "Aucune liste ne correspond aux critères de filtrage."
            }
            buttonText="Nouvelle liste"
            onButtonClick={handleCreateList}
          />
        )}
        keyExtractor={(item) => item._id}
        isFetchingNextPage={isFetchingNextPage}
        loading={isLoading}
        onBottomEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
      />

      <ListForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={getFormTitle()}
        isNew={isNewList}
        list={selectedList}
      />

      <ListDetails
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        selectedListId={selectedList?._id || null}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelArchive}
        onPressConfirm={handleConfirmArchive}
        title={
          listToArchive?.type === "archive"
            ? "Archiver la liste"
            : "Désarchiver la liste"
        }
        description={`Êtes-vous sûr de vouloir ${
          listToArchive?.type === "archive" ? "archiver" : "désarchiver"
        } cette liste ?`}
      />
    </div>
  );
};

export default Lists;
