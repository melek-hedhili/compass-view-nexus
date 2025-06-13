import type React from "react";
import { useState } from "react";
import AppLayout from "../../../../components/layout/AppLayout";
import { NavTabs } from "../../../../components/dashboard/NavTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQueryParams } from "@/hooks/use-query-params";
import { ListService } from "@/api-swagger/services/ListService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListDto } from "@/api-swagger";
import { CreatableAutoComplete } from "@/components/ui/creatable-autocomplete";

const Lists = () => {
  const queryParams = useQueryParams();
  const page = Number(queryParams.page || 1);
  const perPage = Number(queryParams.perPage || 10);
  
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ListDto>>({
    fieldName: "",
    values: [],
  });

  // Query for fetching all lists
  const { data: listsData, isLoading } = useQuery({
    queryKey: ["lists", page, perPage],
    queryFn: () => ListService.listControllerFindAll({ page, perPage }),
  });

  // Query for fetching a single list
  const { data: selectedList } = useQuery({
    queryKey: ["list", selectedListId],
    queryFn: () => ListService.listControllerFindOne({ id: selectedListId }),
    enabled: !!selectedListId,
  });

  // Mutation for updating a list
  const updateListMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ListDto> }) =>
      ListService.listControllerUpdate({ id, requestBody: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      if (selectedListId) {
        queryClient.invalidateQueries({ queryKey: ["list", selectedListId] });
      }
      toast.success("Liste mise à jour avec succès");
      setIsEditDrawerOpen(false);
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour de la liste");
      console.error("Update error:", error);
    },
  });

  // Mutation for creating a list
  const createListMutation = useMutation({
    mutationFn: (data: Partial<ListDto>) =>
      ListService.listControllerCreate({
        requestBody: {
          fieldName: data.fieldName || "",
          values: data.values || [],
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast.success("Liste créée avec succès");
      setIsCreateDrawerOpen(false);
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de la liste");
      console.error("Create error:", error);
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: (id: string) => ListService.listControllerRemove({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast.success("Liste supprimée avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression de la liste");
      console.error("Delete error:", error);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveList = (isNew: boolean) => {
    if (isNew) {
      createListMutation.mutate(formData);
    } else if (selectedListId) {
      updateListMutation.mutate({ id: selectedListId, data: formData });
    }
  };

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
    deleteListMutation.mutateAsync(id);
  };

  const filteredLists =
    listsData?.data?.filter((list) => {
      if (!searchTerm) return true;
      return (
        list.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.values?.join(", ").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }) || [];

  return (
    <AppLayout>
      <NavTabs />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0"></div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 border border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">Chargement...</div>
        ) : filteredLists.length > 0 ? (
          filteredLists.map((list) => (
            <ListCard
              key={list._id}
              list={list}
              handleViewList={handleViewList}
              handleEditList={handleEditList}
              handleDeleteList={handleDeleteList}
            />
          ))
        ) : (
          <div className="col-span-full bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
            Aucune liste trouvée
          </div>
        )}
      </div>

      {/* Create List Drawer */}
      <ListDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        title="Nouvelle liste"
        onSave={() => handleSaveList(true)}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleCheckboxChange={() => {}}
      />

      {/* Edit List Drawer */}
      <ListDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title="Modifier la liste"
        onSave={() => handleSaveList(false)}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleCheckboxChange={() => {}}
      />

      {/* List Details Drawer */}
      <Sheet open={isDetailsDrawerOpen} onOpenChange={setIsDetailsDrawerOpen}>
        <SheetContent className="sm:max-w-md md:max-w-4xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Détails de la liste</SheetTitle>
            <SheetDescription>
              Informations détaillées de la liste
            </SheetDescription>
          </SheetHeader>

          {selectedList && (
            <div className="space-y-6 py-6">
              <div>
                <Label className="block text-sm font-medium text-gray-500 mb-1">
                  Nom du champ
                </Label>
                <p className="text-lg font-semibold">
                  {selectedList.fieldName}
                </p>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-500 mb-1">
                  Valeurs
                </Label>
                <div className="flex flex-wrap gap-2">
                  {selectedList.values?.map((value, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gray-100 text-gray-700 hover:bg-gray-100"
                    >
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-500 mb-1">
                  ID
                </Label>
                <p className="text-sm text-gray-600">{selectedList._id}</p>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-500 mb-1">
                  Date de création
                </Label>
                <p className="text-sm text-gray-600">
                  {new Date(selectedList.created_at || "").toLocaleString()}
                </p>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-500 mb-1">
                  Dernière mise à jour
                </Label>
                <p className="text-sm text-gray-600">
                  {new Date(selectedList.updated_at || "").toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
};

interface ListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSave: () => void;
  formData: Partial<ListDto>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ListDto>>>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

const ListDrawer: React.FC<ListDrawerProps> = ({
  isOpen,
  onClose,
  title,
  onSave,
  formData,
  setFormData,
  handleInputChange,
  handleCheckboxChange,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md md:max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Remplissez les informations de la liste ci-dessous.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6 py-6">
          <div className="space-y-6">
            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                Nom du champ
              </Label>
              <Input
                name="fieldName"
                value={formData.fieldName || ""}
                onChange={handleInputChange}
                className="border border-gray-700"
                placeholder="Nom du champ"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                Valeurs
              </Label>
              <CreatableAutoComplete
                values={formData.values || []}
                onChange={(values) =>
                  setFormData((prev) => ({ ...prev, values }))
                }
                placeholder="Tapez une valeur et appuyez sur Entrée"
                className="border border-gray-700"
              />
            </div>

            <SheetFooter className="flex justify-end gap-3 pt-4">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </SheetClose>
              <Button
                type="button"
                onClick={onSave}
                className="bg-formality-primary hover:bg-formality-primary/90 text-white"
              >
                Enregistrer
              </Button>
            </SheetFooter>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

type ListCardProps = {
  list: ListDto;
  handleViewList: (list: ListDto) => void;
  handleEditList: (list: ListDto) => void;
  handleDeleteList: (id: string) => void;
};

const ListCard: React.FC<ListCardProps> = ({
  list,
  handleViewList,
  handleEditList,
  handleDeleteList,
}) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-100 flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
          <CardTitle className="text-lg font-semibold">
            {list.fieldName}
          </CardTitle>
          <p className="text-sm text-gray-500 sm:mt-1">Liste N°{list._id}</p>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Contenu</h4>
            <p className="text-sm break-words">{list.fieldName}</p>
          </div>

          {list.values?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Utilisation
              </h4>
              <div className="flex flex-wrap gap-2">
                {list.values.map((item, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-100 max-w-full truncate"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 mt-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-2">
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full">
            <Button
              variant="outline"
              className="text-blue-500 border-blue-500 hover:bg-blue-50 hover:text-blue-600 w-full sm:w-auto flex-1 min-w-0"
              onClick={() => handleViewList(list)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Détails
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto flex-1 min-w-0"
              onClick={() => handleEditList(list)}
            >
              Modifier
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto flex-1 min-w-0"
              onClick={() => handleDeleteList(list._id)}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
export default Lists;
