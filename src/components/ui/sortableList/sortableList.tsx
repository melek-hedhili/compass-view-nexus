import React, { useMemo, useState } from "react";

// Remove MUI import
// import { Grid } from '@mui/material';

import {
  type Active,
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { DragHandle, SortableItem } from "./sortableItem/sortableItem";
// import { List } from './sortableList.styles';
import { listClass } from "./sortableList.styles";
import type { SortableListProps } from "./sortableList.types";
import { SortableOverlay } from "./SortableOverLay/SortableOverlay";

const SortableList = <T,>(props: SortableListProps<T>) => {
  const { type, items, onChange, renderItem, getId } = props;

  if (!Array.isArray(items)) {
    throw new Error("SortableList: 'items' prop must be an array.");
  }
  if (typeof getId !== "function") {
    throw new Error("SortableList: 'getId' prop must be a function.");
  }

  // Helper to get a safe id for each item
  const getSafeId = (item: T, index: number) => {
    const id = getId(item);
    return id ?? `sortable-fallback-id-${index}`;
  };

  const [active, setActive] = useState<Active | null>(null);
  const activeItem = useMemo(
    () => items.find((item, idx) => getSafeId(item, idx) === active?.id),
    [active, items, getId]
  );

  const pointerSensor = useSensor(PointerSensor);
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);

  const listSensors = useSensors(pointerSensor, keyboardSensor);
  const gridSensors = useSensors(mouseSensor, touchSensor);

  const sensors = type === "GRID" ? gridSensors : listSensors;

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over?.id) {
      const activeIndex = items.findIndex(
        (item, idx) => getSafeId(item, idx) === active.id
      );
      const overIndex = items.findIndex(
        (item, idx) => getSafeId(item, idx) === over.id
      );

      onChange?.(
        arrayMove(items, activeIndex, overIndex),
        activeIndex,
        overIndex
      );
    }
    setActive(null);
  };

  if (type === "GRID") {
    const { renderFixedItem } = props;
    const gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <div className={`grid gap-2 ${gridCols}`}>
          <SortableContext
            items={items.map(getSafeId)}
            strategy={rectSortingStrategy}
          >
            {renderFixedItem && <div>{renderFixedItem()}</div>}
            {items.map((item, index) => (
              <div key={getSafeId(item, index)}>{renderItem(item, index)}</div>
            ))}
          </SortableContext>
        </div>
      </DndContext>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={onDragEnd}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items.map(getSafeId)}>
        <ul className={listClass}>
          {items.map((item, i) => (
            <React.Fragment key={getSafeId(item, i)}>
              {renderItem(item, i)}
            </React.Fragment>
          ))}
        </ul>
      </SortableContext>
      <SortableOverlay>
        {activeItem ? renderItem(activeItem) : null}
      </SortableOverlay>
    </DndContext>
  );
};

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;

export { SortableList };
