import AppLayout from "../../../../components/layout/AppLayout";
import { NavTabs } from "../../../../components/dashboard/NavTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folder, Plus, Search } from "lucide-react";

const Contracts = () => {
  return (
    <AppLayout>
      <NavTabs />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0"></div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 border-gray-200"
            />
          </div>
          <Button className="flex items-center gap-2 bg-formality-primary hover:bg-formality-primary/90 text-white">
            <Plus className="h-4 w-4" />
            <span>Nouvel arbre</span>
          </Button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
        <Folder className="h-16 w-16 mx-auto mb-4 text-formality-primary/70" />
        <h2 className="text-xl font-medium text-gray-700 mb-2">
          Aucune arborescence trouvée
        </h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Cette section est en cours de développement. Vous pourrez bientôt
          créer et gérer des structures arborescentes.
        </p>
        <Button className="bg-formality-primary hover:bg-formality-primary/90 text-white inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Créer votre première arborescence</span>
        </Button>
      </div>
    </AppLayout>
  );
};

export default Contracts;
