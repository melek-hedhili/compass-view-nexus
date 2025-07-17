import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CreateTreeDto,
  TreeService,
  type UpdateOrderDto,
  type UpdateTreeDto,
} from "@/api-swagger";
import { type TreeDto } from "@/api-swagger/models/TreeDto";

export const useArboresenceMutations = ({
  setEditingItem,
  setEditValue,
}: {
  setEditingItem?: (item: UpdateTreeDto | null) => void;
  setEditValue?: (val: string) => void;
} = {}) => {
  const queryClient = useQueryClient();

  // Delete rubrique/famille/sous-famille
  const deleteRubriqueMutation = useMutation({
    mutationFn: ({
      id,
      type,
    }: {
      id: string;
      type: "rubrique" | "famille" | "sous-famille";
    }) => TreeService.treeControllerRemove({ id }),
    onMutate: async ({ id, type }) => {
      await queryClient.cancelQueries({ queryKey: ["tree"] });
      const previousTree = queryClient.getQueryData(["tree"]);
      queryClient.setQueryData(["tree"], (old: TreeDto[]) => {
        if (!old) return old;
        const removeItemRecursively = (items: any[]): any[] =>
          items.filter((item) => {
            if (item._id === id && item.type === type) return false;
            if (item.titles) {
              item.titles = removeItemRecursively(item.titles);
            }
            if (item.subtitles) {
              item.subtitles = removeItemRecursively(item.subtitles);
            }
            return true;
          });
        return removeItemRecursively(old);
      });
      return { previousTree };
    },
    onError: (err, { type, id }, context) => {
      if (context?.previousTree) {
        queryClient.setQueryData(["tree"], context.previousTree);
      }
      const errorMessage = (err as any).body.response.message as string;
      if (errorMessage.includes("can t delete this tree")) {
        toast.error(
          `Cette ${type} est liée à un document et ne peut être supprimée`
        );
      } else {
        toast.error(`Erreur lors de la suppression de la ${type}`);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tree"] });
    },
  });

  // Sort mutation
  const sortMutation = useMutation({
    mutationFn: (data: UpdateOrderDto) =>
      TreeService.treeControllerUpdateOrder({ requestBody: data }),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["tree"] });
      const previousTree = queryClient.getQueryData(["tree"]);
      queryClient.setQueryData(["tree"], (old: TreeDto[]) => {
        if (!old) return old;
        const updateOrderRecursively = (
          items: any[],
          parentId: string | null
        ): any[] => {
          if (parentId === data.parentId) {
            const indexMap = new Map(
              data.order.map((item) => [item._id, item.index])
            );
            return [...items]
              .sort((a, b) => {
                const indexA = indexMap.get(a._id) ?? a.index;
                const indexB = indexMap.get(b._id) ?? b.index;
                return indexA - indexB;
              })
              .map((item) => ({
                ...item,
                index: indexMap.get(item._id) ?? item.index,
              }));
          }
          return items.map((item) => ({
            ...item,
            titles: item.titles
              ? updateOrderRecursively(item.titles, item._id)
              : item.titles,
            subtitles: item.subtitles
              ? updateOrderRecursively(item.subtitles, item._id)
              : item.subtitles,
          }));
        };
        return updateOrderRecursively(old, null);
      });
      return { previousTree };
    },
    onError: (_, __, context) => {
      if (context?.previousTree) {
        queryClient.setQueryData(["tree"], context.previousTree);
      }
      toast.error("Erreur lors du tri de l'arborescence");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tree"] });
    },
  });

  // Create rubrique (section)
  const createRubriqueMutation = useMutation({
    mutationFn: ({ name, index }: { name: string; index: number }) =>
      TreeService.treeControllerCreate({
        requestBody: {
          fieldName: name,
          type: CreateTreeDto.type.SECTION,
          index,
        },
      }),
    onMutate: async ({ name, index }) => {
      await queryClient.cancelQueries({ queryKey: ["tree"] });
      const previousTree = queryClient.getQueryData(["tree"]);
      const optimisticItem = {
        _id: `temp-${Date.now()}`,
        fieldName: name,
        type: CreateTreeDto.type.SECTION,
        index,
        titles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData(["tree"], (old: TreeDto[]) => {
        if (!old) return [optimisticItem];
        return [...old, optimisticItem].sort((a, b) => a.index - b.index);
      });
      return { previousTree, optimisticItem };
    },
    onError: (_, __, context) => {
      if (context?.previousTree) {
        queryClient.setQueryData(["tree"], context.previousTree);
      }
      toast.error("Erreur lors de la création de la rubrique");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tree"] });
    },
  });

  // Update name mutation
  const updateNameMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTreeDto }) =>
      TreeService.treeControllerUpdate({
        id,
        requestBody: data,
      }),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["tree"] });
      const previousTree = queryClient.getQueryData(["tree"]);
      queryClient.setQueryData(["tree"], (old: TreeDto[]) => {
        if (!old) return old;
        const updateNameRecursively = (items: any[]): any[] =>
          items.map((item) => {
            if (item._id === id) {
              return { ...item, fieldName: data.fieldName };
            }
            return {
              ...item,
              titles: item.titles
                ? updateNameRecursively(item.titles)
                : item.titles,
              subtitles: item.subtitles
                ? updateNameRecursively(item.subtitles)
                : item.subtitles,
            };
          });
        return updateNameRecursively(old);
      });
      return { previousTree };
    },
    onError: (_, __, context) => {
      if (context?.previousTree) {
        queryClient.setQueryData(["tree"], context.previousTree);
      }
      toast.error("Erreur lors de la mise à jour du nom");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tree"] });
    },
    onSuccess: () => {
      setEditingItem?.(null);
      setEditValue?.("");
    },
  });

  // Create title (famille)
  const createTitleMutation = useMutation({
    mutationFn: ({
      sectionId,
      name,
      index,
    }: {
      sectionId: string;
      name: string;
      index: number;
    }) =>
      TreeService.treeControllerCreate({
        requestBody: {
          fieldName: name,
          type: CreateTreeDto.type.TITLE,
          parentId: sectionId,
          index,
        },
      }),
    onMutate: async ({ sectionId, name, index }) => {
      await queryClient.cancelQueries({ queryKey: ["tree"] });
      const previousTree = queryClient.getQueryData(["tree"]);
      const optimisticTitle = {
        _id: `temp-title-${Date.now()}`,
        fieldName: name,
        type: CreateTreeDto.type.TITLE,
        index,
        parent: { _id: sectionId },
        subtitles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData(["tree"], (old: TreeDto[]) => {
        if (!old) return old;
        const addTitleToSection = (items: any[]): any[] =>
          items.map((item) => {
            if (item._id === sectionId) {
              const updatedTitles = [
                ...(item.titles || []),
                optimisticTitle,
              ].sort((a, b) => a.index - b.index);
              return { ...item, titles: updatedTitles };
            }
            return {
              ...item,
              titles: item.titles
                ? addTitleToSection(item.titles)
                : item.titles,
              subtitles: item.subtitles
                ? addTitleToSection(item.subtitles)
                : item.subtitles,
            };
          });
        return addTitleToSection(old);
      });
      return { previousTree, optimisticTitle };
    },
    onError: (_, __, context) => {
      if (context?.previousTree) {
        queryClient.setQueryData(["tree"], context.previousTree);
      }
      toast.error("Erreur lors de la création de la famille");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tree"] });
    },
  });

  // Create subtitle (sous-famille)
  const createSubtitleMutation = useMutation({
    mutationFn: ({
      titleId,
      name,
      index,
    }: {
      titleId: string;
      name: string;
      index: number;
    }) =>
      TreeService.treeControllerCreate({
        requestBody: {
          fieldName: name,
          type: CreateTreeDto.type.SUB_TITLE,
          parentId: titleId,
          index,
        },
      }),
    onMutate: async ({ titleId, name, index }) => {
      await queryClient.cancelQueries({ queryKey: ["tree"] });
      const previousTree = queryClient.getQueryData(["tree"]);
      const optimisticSubtitle = {
        _id: `temp-subtitle-${Date.now()}`,
        fieldName: name,
        type: CreateTreeDto.type.SUB_TITLE,
        index,
        parent: { _id: titleId },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData(["tree"], (old: TreeDto[]) => {
        if (!old) return old;
        const addSubtitleToTitle = (items: any[]): any[] =>
          items.map((item) => {
            if (item._id === titleId) {
              const updatedSubtitles = [
                ...(item.subtitles || []),
                optimisticSubtitle,
              ].sort((a, b) => a.index - b.index);
              return { ...item, subtitles: updatedSubtitles };
            }
            return {
              ...item,
              titles: item.titles
                ? addSubtitleToTitle(item.titles)
                : item.titles,
              subtitles: item.subtitles
                ? addSubtitleToTitle(item.subtitles)
                : item.subtitles,
            };
          });
        return addSubtitleToTitle(old);
      });
      return { previousTree, optimisticSubtitle };
    },
    onError: (_, __, context) => {
      if (context?.previousTree) {
        queryClient.setQueryData(["tree"], context.previousTree);
      }
      toast.error("Erreur lors de la création de la sous-famille");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tree"] });
    },
  });

  return {
    deleteRubriqueMutation,
    sortMutation,
    createRubriqueMutation,
    updateNameMutation,
    createTitleMutation,
    createSubtitleMutation,
  };
};
