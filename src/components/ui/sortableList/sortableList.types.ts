import type { ReactNode } from "react";
import type { UniqueIdentifier } from "@dnd-kit/core";

// No more BaseItem constraint
export type GridProps = { type: "GRID"; renderFixedItem?: () => ReactNode };
export type ListProps = { type: "LIST" };

export type SortableListProps<T> = {
  type: "LIST" | "GRID";
  items: T[];
  getId: (item: T) => UniqueIdentifier;
  onChange?(items: T[], activeIndex: number, overIndex: number): void;
  renderItem(item: T, index?: number): ReactNode;
} & (GridProps | ListProps);
