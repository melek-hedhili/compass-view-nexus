import { useState } from "react";
import PendingFeature from "@/pages/main/dossier/analyse/PendingFeature";

interface Control {
  id: string;
  number: number;
  description: string;
  document: string;
  legalForms: string[];
  controlType: string;
  errorMessage: string;
  rule: string;
  isModifiable: boolean;
}

const Controls = () => {
  const [legalFormOptions] = useState([
    "Tout",
    "SCI",
    "EURL / SARL",
    "SASU / SAS",
    "SA",
  ]);
  const [controlTypes] = useState(["Contrôle de 2 valeurs dans 2 documents"]);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [currentControl, setCurrentControl] = useState<Control | null>(null);
  const [isArchived, setIsArchived] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [controlToDelete, setControlToDelete] = useState<string | null>(null);

  const [controls, setControls] = useState<Control[]>([
    {
      id: "1",
      number: 1,
      description: "Vérification des statuts",
      document: "Statuts",
      legalForms: ["SAS", "SARL", "EURL", "SA", "SCI"],
      controlType: "Contrôle de 2 valeurs dans 2 documents",
      errorMessage: "Les statuts ne sont pas conformes",
      rule: "Vérifier la conformité des statuts",
      isModifiable: true,
    },
    {
      id: "2",
      number: 2,
      description: "Vérification du capital",
      document: "Kbis",
      legalForms: ["SAS", "SARL"],
      controlType: "Contrôle de 2 valeurs dans 2 documents",
      errorMessage: "Le capital ne correspond pas",
      rule: "Vérifier que le capital est conforme",
      isModifiable: false,
    },
  ]);

  const [archivedControls, setArchivedControls] = useState<Control[]>([]);

  const handleEditControl = (control: Control) => {
    setCurrentControl(control);
    setIsEditDrawerOpen(true);
  };

  const handleSaveControl = (control: Control, isNew: boolean) => {
    if (isNew) {
      setControls([...controls, { ...control, id: Date.now().toString() }]);
    } else {
      setControls(controls.map((c) => (c.id === control.id ? control : c)));
    }
    setIsCreateDrawerOpen(false);
    setIsEditDrawerOpen(false);
  };

  const handleArchiveControl = (id: string) => {
    const controlToArchive = controls.find((control) => control.id === id);
    if (controlToArchive) {
      setArchivedControls([...archivedControls, controlToArchive]);
      setControls(controls.filter((control) => control.id !== id));
    }
  };

  const handleRestoreControl = (id: string) => {
    const controlToRestore = archivedControls.find(
      (control) => control.id === id
    );
    if (controlToRestore) {
      setControls([...controls, controlToRestore]);
      setArchivedControls(
        archivedControls.filter((control) => control.id !== id)
      );
    }
  };

  const handleConfirmDelete = () => {
    if (controlToDelete) {
      if (isArchived) {
        setArchivedControls(
          archivedControls.filter((control) => control.id !== controlToDelete)
        );
      } else {
        setControls(
          controls.filter((control) => control.id !== controlToDelete)
        );
      }
    }
    setIsConfirmModalOpen(false);
    setControlToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setControlToDelete(null);
  };

  return (
    <div className="w-full animate-fade-in">
      <PendingFeature />
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0" />
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 border-gray-200"
            />
          </div>
          <ArchiveFilterButton
            archived={isArchived}
            onToggle={() => setIsArchived((prev) => !prev)}
            featureName="Contrôles"
            icon={<Filter className="h-4 w-4" />}
          />
          <Button className="bg-formality-primary hover:bg-formality-primary/90 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Nouveau contrôle</span>
          </Button>
        </div>
      </div>

      <ControlsGrid
        controls={isArchived ? archivedControls : controls}
        viewingArchived={isArchived}
        onEdit={handleEditControl}
        onArchive={handleArchiveControl}
        onRestore={handleRestoreControl}
      />

      <ControlForm
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        title="Ajouter un contrôle"
        control={{
          id: "",
          number: controls.length + 1,
          description: "",
          document: "",
          legalForms: [],
          controlType: controlTypes[0],
          errorMessage: "",
          rule: "",
          isModifiable: true,
        }}
        legalFormOptions={legalFormOptions}
        controlTypes={controlTypes}
        onSave={(control) => handleSaveControl(control, true)}
      />

      <ControlForm
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title="Modifier le contrôle"
        control={currentControl}
        legalFormOptions={legalFormOptions}
        controlTypes={controlTypes}
        onSave={(control) => handleSaveControl(control, false)}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelDelete}
        onPressConfirm={handleConfirmDelete}
        title="Supprimer le contrôle"
        description="Êtes-vous sûr de vouloir supprimer ce contrôle ?"
      /> */}
    </div>
  );
};

export default Controls;
