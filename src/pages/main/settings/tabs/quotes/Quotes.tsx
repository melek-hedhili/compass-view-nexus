import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Database, Search } from "lucide-react";
import { QuoteForm } from "./QuoteForm";
import {
  CreateDataDto,
  type DataDto,
  DataService,
  DocumentService,
  ListService,
  TreeService,
} from "@/api-swagger";
import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useSearchDebounce } from "@/hooks/use-search-debounce";
import { PaginatedListGrid } from "../lists/PaginatedListGrid";
import SettingsNoDataFound from "@/components/layout/SettingsNoDataFound";
import { QuoteCard } from "./QuoteCard";
import { toast } from "sonner";
import { ArchiveFilterButton } from "@/components/ui/ArchiveFilterButton";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { QuotesDetailsSheet } from "./QuotesDetailsSheet";

const Quotes = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingData, setEditingData] = useState<DataDto | null>(null);
  const [viewingArchived, setViewingArchived] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [dataToArchive, setDataToArchive] = useState<DataDto | null>(null);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
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
  const [dataItemsQuery, treesQuery, listsQuery, documentsQuery] = useQueries({
    queries: [
      {
        queryKey: ["dataItems"],
        queryFn: () =>
          DataService.dataControllerFindAll({
            filters: JSON.stringify([
              {
                field: "type",
                values: [
                  CreateDataDto.type.SINGLE_CHOICE,
                  CreateDataDto.type.MULTIPLE_CHOICE,
                ],
              },
            ]),
          }),
      },
      {
        queryKey: ["trees"],
        queryFn: () => TreeService.treeControllerFindAll(),
      },
      {
        queryKey: ["lists"],
        queryFn: () =>
          ListService.listControllerFindAll({
            filters: JSON.stringify([
              {
                field: "isArchived",
                values: ["false"],
              },
            ]),
          }),
      },
      {
        queryKey: ["documents"],
        queryFn: () =>
          DocumentService.documentControllerFindAll({
            filters: JSON.stringify([
              {
                field: "isArchived",
                values: ["false"],
              },
            ]),
          }),
      },
    ],
  });
  const queryClient = useQueryClient();
  const archiveDataMutation = useMutation({
    mutationFn: ({ id, type }: { id: string; type: "archive" | "unarchive" }) =>
      DataService.dataControllerUpdate({
        id,

        requestBody: { isArchived: type === "archive" },
      }),
    onSuccess: async (_, { type }) => {
      await queryClient.invalidateQueries({ queryKey: ["data"], exact: false });
      await queryClient.invalidateQueries({ queryKey: ["dataItems"] });

      toast.success(
        type === "archive"
          ? "Donnée archivée avec succès"
          : "Donnée restaurée avec succès"
      );
      setIsSheetOpen(false);
    },
    onError: () => {
      toast.error("Erreur lors de l'archivage de la donnée");
    },
  });

  const infiniteDataItemsQuery = useInfiniteQuery({
    queryKey: ["data", searchValue, viewingArchived],
    queryFn: ({ pageParam = 1 }) =>
      DataService.dataControllerFindAll({
        page: pageParam.toString(),
        perPage: "12",
        searchValue,
        searchFields: ["_id", "fieldName"],
        filters: JSON.stringify([
          {
            field: "isArchived",
            values: [viewingArchived.toString()],
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

  const handleOpenDrawer = (data: DataDto | null) => {
    if (data) {
      setEditingData(data);
    } else {
      setEditingData(null);
    }
    setIsSheetOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsSheetOpen(false);
    setEditingData(null);
  };

  const handleViewQuote = (data: DataDto) => {
    setSelectedQuoteId(data._id);
    setIsDetailsSheetOpen(true);
  };

  const handleCloseDetailsSheet = () => {
    setIsDetailsSheetOpen(false);
    setSelectedQuoteId(null);
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-6">
        <div className="flex items-center mb-4 md:mb-0" />
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-between">
          <div className="relative">
            <Form methods={methods}>
              <ControlledInput
                placeholder="Recherche..."
                name="search"
                startAdornment={<Search className="h-4 w-4 text-gray-400" />}
              />
            </Form>
          </div>
          <ArchiveFilterButton
            archived={viewingArchived}
            onToggle={() => setViewingArchived((prev) => !prev)}
            featureName="Données"
            icon={<Database className="h-4 w-4" />}
          />
          <Button
            className="bg-formality-primary hover:bg-formality-primary/90 text-white flex items-center gap-2"
            onClick={() => handleOpenDrawer(null)}
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle donnée</span>
          </Button>
        </div>
      </div>

      <PaginatedListGrid
        data={infiniteDataItemsQuery.data ?? []}
        loading={infiniteDataItemsQuery.isLoading}
        isFetchingNextPage={infiniteDataItemsQuery.isFetchingNextPage}
        renderItem={(data) => (
          <QuoteCard
            key={data._id}
            data={data}
            viewingArchived={viewingArchived}
            onView={handleViewQuote}
            onEdit={handleOpenDrawer}
            onArchive={() => {
              setDataToArchive(data);
              setIsConfirmationModalOpen(true);
            }}
            onRestore={() => {
              setDataToArchive(data);
              setIsConfirmationModalOpen(true);
            }}
          />
        )}
        renderEmpty={() => (
          <SettingsNoDataFound
            icon={<Database className="h-12 w-12 text-gray-400" />}
            title={
              viewingArchived
                ? "Aucune donnée archivée trouvée"
                : "Aucune donnée trouvée"
            }
            description={
              viewingArchived
                ? "Il n'y a pas de données archivées"
                : "Ajoutez une donnée pour commencer."
            }
            {...(!viewingArchived && {
              buttonText: "Nouvelle donnée",
              onButtonClick: () => handleOpenDrawer(null),
            })}
          />
        )}
        keyExtractor={(data) => data._id}
        onBottomEndReached={() => {
          if (
            infiniteDataItemsQuery.hasNextPage &&
            !infiniteDataItemsQuery.isFetchingNextPage
          ) {
            infiniteDataItemsQuery.fetchNextPage();
          }
        }}
      />

      <QuoteForm
        isOpen={isSheetOpen}
        onClose={handleCloseDrawer}
        editingData={editingData}
        dataItems={dataItemsQuery.data}
        trees={treesQuery.data}
        lists={listsQuery.data?.data}
        documents={documentsQuery.data?.data}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onPressConfirm={() => {
          archiveDataMutation.mutateAsync({
            id: dataToArchive?._id,
            type: dataToArchive?.isArchived ? "unarchive" : "archive",
          });
        }}
        title={
          dataToArchive?.isArchived
            ? "Désarchiver la donnée"
            : "Archiver la donnée"
        }
        description={
          dataToArchive?.isArchived
            ? "Voulez-vous vraiment désarchiver cette donnée ?"
            : "Voulez-vous vraiment archiver cette donnée ?"
        }
        confirmButtonText={
          dataToArchive?.isArchived ? "Désarchiver" : "Archiver"
        }
        cancelButtonText="Annuler"
      />

      <QuotesDetailsSheet
        isOpen={isDetailsSheetOpen}
        onClose={handleCloseDetailsSheet}
        quoteId={selectedQuoteId}
      />
    </div>
  );
};

export default Quotes;
