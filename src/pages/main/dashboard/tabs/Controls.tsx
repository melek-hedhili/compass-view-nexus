import React, { useState } from "react";
import AppLayout from "../../../../components/layout/AppLayout";
import { NavTabs } from "../../../../components/dashboard/NavTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Database } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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
  const [viewingArchived, setViewingArchived] = useState(false);

  // Sample controls data
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

  const handleCreateControl = () => {
    setIsCreateDrawerOpen(true);
  };

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

  const handleDeleteControl = (id: string) => {
    if (viewingArchived) {
      setArchivedControls(
        archivedControls.filter((control) => control.id !== id)
      );
    } else {
      setControls(controls.filter((control) => control.id !== id));
    }
  };

  return (
    <AppLayout>
      <NavTabs />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0"></div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 border border-gray-200"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className={`flex items-center gap-2 ${
                viewingArchived ? "bg-gray-100" : ""
              }`}
              onClick={() => setViewingArchived(!viewingArchived)}
            >
              <Database className="h-4 w-4" />
              <span>
                {viewingArchived ? "Liste principale" : "Liste des archives"}
              </span>
            </Button>
            <Button
              className="flex items-center gap-2 bg-formality-primary hover:bg-formality-primary/90 text-white"
              onClick={handleCreateControl}
              disabled={viewingArchived}
            >
              <Plus className="h-4 w-4" />
              <span>Contrôle</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(viewingArchived ? archivedControls : controls).map((control) => (
          <Card
            key={control.id}
            className="bg-white shadow-sm border border-gray-100"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">
                  {control.document}
                </CardTitle>
              </div>
              <p className="text-sm text-gray-500">
                Contrôle N°{control.number}: {control.description}
              </p>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Formes juridiques:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {control.legalForms.map((form) => (
                      <Badge
                        key={form}
                        variant="outline"
                        className="bg-gray-100 text-gray-700 hover:bg-gray-100"
                      >
                        {form}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Type de contrôle:
                  </h4>
                  <p className="text-sm">{control.controlType}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`modifiable-${control.id}`}
                    checked={control.isModifiable}
                    className="text-formality-primary focus:ring-formality-primary/20"
                  />
                  <label
                    htmlFor={`modifiable-${control.id}`}
                    className="text-sm text-gray-700"
                  >
                    Modifiable
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              {viewingArchived ? (
                <Button
                  variant="outline"
                  className="text-green-500 border-green-500 hover:bg-green-50 hover:text-green-600"
                  onClick={() => handleRestoreControl(control.id)}
                >
                  Restaurer
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => handleArchiveControl(control.id)}
                >
                  Archiver
                </Button>
              )}
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => handleEditControl(control)}
                disabled={viewingArchived}
              >
                Modifier
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Create Control Drawer */}
      <ControlDrawer
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

      {/* Edit Control Drawer */}
      <ControlDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title="Modifier le contrôle"
        control={currentControl}
        legalFormOptions={legalFormOptions}
        controlTypes={controlTypes}
        onSave={(control) => handleSaveControl(control, false)}
      />
    </AppLayout>
  );
};

interface ControlDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  control: Control | null;
  legalFormOptions: string[];
  controlTypes: string[];
  onSave: (control: Control) => void;
}

const ControlDrawer: React.FC<ControlDrawerProps> = ({
  isOpen,
  onClose,
  title,
  control,
  legalFormOptions,
  controlTypes,
  onSave,
}) => {
  const [formData, setFormData] = useState<Control | null>(control);

  React.useEffect(() => {
    setFormData(control);
  }, [control]);

  if (!formData) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleLegalFormChange = (form: string, checked: boolean) => {
    let updatedForms = [...formData.legalForms];

    if (checked) {
      updatedForms.push(form);
    } else {
      updatedForms = updatedForms.filter((f) => f !== form);
    }

    setFormData({ ...formData, legalForms: updatedForms });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl md:max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Remplissez les informations du contrôle ci-dessous.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                Contrôle N°{formData.number}
              </span>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border border-gray-700"
                placeholder="Description du contrôle"
              />
            </div>

            <Separator
              orientation="vertical"
              className="hidden md:block h-10"
            />

            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-500">
                Document contrôlé
              </Label>
              <Input
                name="document"
                value={formData.document}
                onChange={handleChange}
                className="border border-gray-700 mt-1"
                placeholder="Document"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Label className="block text-sm font-medium text-gray-500 mb-3">
                Forme juridique
              </Label>
              <div className="flex flex-wrap gap-6">
                {legalFormOptions.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      id={`legalForm-${option}`}
                      checked={formData.legalForms.includes(option)}
                      onCheckedChange={(checked) =>
                        handleLegalFormChange(option, checked === true)
                      }
                      className="text-formality-primary focus:ring-formality-primary/20"
                    />
                    <Label
                      htmlFor={`legalForm-${option}`}
                      className="text-sm text-gray-700"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="hidden md:block h-24"
            />

            <div className="flex-1">
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                Type de contrôle
              </Label>
              <select
                name="controlType"
                value={formData.controlType}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-formality-primary/20 focus:border-formality-primary transition-all"
              >
                {controlTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-2">
                OK si
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select className="border border-gray-700 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-formality-primary/20 focus:border-formality-primary transition-all">
                  <option>Document</option>
                </select>
                <select className="border border-gray-700 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-formality-primary/20 focus:border-formality-primary transition-all">
                  <option>Donnée</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-2">
                Comparaison
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select className="border border-gray-700 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-formality-primary/20 transition-all">
                  <option>Document</option>
                </select>
                <select className="border border-gray-700 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-formality-primary/20 focus:border-formality-primary transition-all">
                  <option>Donnée</option>
                </select>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Checkbox
                  id="checkDate"
                  className="text-formality-primary focus:ring-formality-primary/20"
                />
                <Label htmlFor="checkDate" className="text-sm text-gray-700">
                  Date du jour
                </Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-500 mb-1">
              Message d'erreur
            </Label>
            <Textarea
              name="errorMessage"
              value={formData.errorMessage}
              onChange={handleChange}
              className="border border-gray-700 resize-none"
              rows={2}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-500 mb-1">
              Règle
            </Label>
            <Textarea
              name="rule"
              value={formData.rule}
              onChange={handleChange}
              className="border border-gray-700 resize-none"
              rows={2}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isModifiable"
              checked={formData.isModifiable}
              onCheckedChange={(checked) =>
                handleCheckboxChange("isModifiable", checked === true)
              }
              className="text-formality-primary focus:ring-formality-primary/20"
            />
            <Label htmlFor="isModifiable" className="text-sm text-gray-700">
              Modifiable
            </Label>
          </div>

          <SheetFooter className="flex justify-end gap-3 pt-4">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </SheetClose>
            <Button
              type="submit"
              className="bg-formality-primary hover:bg-formality-primary/90 text-white"
            >
              Enregistrer
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default Controls;
