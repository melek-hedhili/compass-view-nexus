import { CreateTreeDto } from "@/api-swagger/models/CreateTreeDto";

export type TreeType = CreateTreeDto.type;

export type SousFamille = {
  id: string;
  name: string;
  isEditing?: boolean;
  parentId: string; // ID of the Famille
  type: CreateTreeDto.type.SUB_TITLE;
  index: number;
};

export type Famille = {
  id: string;
  name: string;
  sousFamilles: SousFamille[];
  isEditing?: boolean;
  parentId: string; // ID of the Rubrique
  type: CreateTreeDto.type.TITLE;
  index: number;
};

export type RubriqueData = {
  id: string;
  rubriqueName: string;
  familles: Famille[];
  isEditingRubrique?: boolean;
  type: CreateTreeDto.type.SECTION;
  index: number;
};

export type DragState = {
  isActive: boolean;
  isDragging: boolean;
  isOver: boolean;
  dropPosition?: "above" | "below";
  dragType?: "famille" | "sousFamille";
};

// Helper function to convert our tree structure to API format
export const convertToApiFormat = (rubrique: RubriqueData): CreateTreeDto[] => {
  const result: CreateTreeDto[] = [];

  // Add rubrique
  result.push({
    fieldName: rubrique.rubriqueName,
    type: CreateTreeDto.type.SECTION,
    index: rubrique.index,
  });

  // Add familles
  rubrique.familles.forEach((famille) => {
    result.push({
      fieldName: famille.name,
      type: CreateTreeDto.type.TITLE,
      index: famille.index,
      parentId: rubrique.id,
    });

    // Add sous-familles
    famille.sousFamilles.forEach((sousFamille) => {
      result.push({
        fieldName: sousFamille.name,
        type: CreateTreeDto.type.SUB_TITLE,
        index: sousFamille.index,
        parentId: famille.id,
      });
    });
  });

  return result;
};
