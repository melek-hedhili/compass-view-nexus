import type { AlignItems } from "./sortableItem.types";

export const itemListClass = "list-none";

export function cursorClass(alignItems?: AlignItems, cursor?: string) {
  return [
    "flex",
    "justify-center",
    `items-${alignItems || "center"}`,
    "h-8", // 32px, close to 30px
    "w-8",
    cursor ? `cursor-${cursor}` : "cursor-grab",
  ].join(" ");
}
