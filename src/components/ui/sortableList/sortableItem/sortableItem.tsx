import {
  createContext,
  type CSSProperties,
  type FC,
  type PropsWithChildren,
  useContext,
  useMemo,
} from "react";

import { GripVertical, Move } from "lucide-react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

//styles
import { itemListClass, cursorClass } from "./sortableItem.styles";
//constants
//reusable components
//components
//types
import type {
  Context,
  DragHandleProps,
  SortableItemProps,
} from "./sortableItem.types";

//helpers
//utils

const SortableItemContext = createContext<Context>({
  attributes: {},
  isDragging: false,
  listeners: undefined,
  ref() {},
});

export const SortableItem: FC<PropsWithChildren<SortableItemProps>> = ({
  children,
  id,
}) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      isDragging,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <li ref={setNodeRef} style={style} className={itemListClass}>
        {children}
      </li>
    </SortableItemContext.Provider>
  );
};

export const DragHandle: FC<DragHandleProps> = ({ alignItems, children }) => {
  const { attributes, listeners, isDragging, ref } =
    useContext(SortableItemContext);
  const renderContent = () => {
    if (children) return children;
    else if (isDragging) return <Move size={24} />;
    return <GripVertical size={24} />;
  };
  return (
    <div
      {...attributes}
      {...listeners}
      ref={ref}
      className={cursorClass(alignItems)}
    >
      {renderContent()}
    </div>
  );
};
