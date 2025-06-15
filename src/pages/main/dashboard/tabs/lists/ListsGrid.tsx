
import { ListDto } from "@/api-swagger";
import { ListCard } from "./ListCard";

interface ListsGridProps {
  lists: ListDto[];
  isLoading: boolean;
  onView: (list: ListDto) => void;
  onEdit: (list: ListDto) => void;
  onDelete: (id: string) => void;
}

export const ListsGrid: React.FC<ListsGridProps> = ({
  lists,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="col-span-full text-center py-8">Chargement...</div>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="col-span-full bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
        Aucune liste trouvée
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lists.map((list) => (
        <ListCard
          key={list._id}
          list={list}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
