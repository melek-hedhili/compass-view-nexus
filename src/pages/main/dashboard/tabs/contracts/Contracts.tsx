import AppLayout from "../../../../../components/layout/AppLayout";
import { NavTabs } from "../../../../../components/dashboard/NavTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folder, Plus, Search } from "lucide-react";
import ArborescenceTreePreview from "./ArborescenceTreePreview";

const Contracts = () => {
  return (
    <AppLayout>
      <NavTabs />
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Création de l'arborescence
        </h2>
        <ArborescenceTreePreview />
        <div className="text-center text-gray-500 mt-8">
          <span>
            Ceci est un aperçu interactif de la gestion d'arborescence : Rubrique, Famille et Sous-Famille peuvent être visualisées, 
            les Familles/Sous-Familles sont triables. Les actions d'ajout et modification seront fonctionnelles lors du développement ultérieur.
          </span>
        </div>
      </div>
    </AppLayout>
  );
};

export default Contracts;
