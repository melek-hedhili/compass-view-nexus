import { type ListDto } from "@/api-swagger";
import { ListCard } from "./ListCard";
import SettingsNoDataFound from "@/components/layout/SettingsNoDataFound";
import { List } from "lucide-react";

interface ListsGridProps {
  lists: ListDto[];
  onView: (list: ListDto) => void;
  onEdit: (list: ListDto) => void;
  onArchive: (id: string, type: "archive" | "unarchive") => void;
}

export const ListsGrid: React.FC<ListsGridProps> = ({
  lists,
  onView,
  onEdit,
  onArchive,
}) => {
  if (lists.length === 0) {
    return (
      <SettingsNoDataFound
        icon={<List className="h-12 w-12 text-gray-400" />}
        title="Aucune liste trouvée"
        description="Ajoutez une liste pour commencer."
        buttonText="Nouvelle liste"
        onButtonClick={() => onEdit && onEdit(null)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {lists.map((list) => (
        <ListCard
          key={list._id}
          list={list}
          onView={onView}
          onEdit={onEdit}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
};
