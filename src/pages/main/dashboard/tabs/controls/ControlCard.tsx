
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

interface ControlCardProps {
  control: Control;
  viewingArchived: boolean;
  onEdit: (control: Control) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}

export const ControlCard: React.FC<ControlCardProps> = ({
  control,
  viewingArchived,
  onEdit,
  onArchive,
  onRestore,
}) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-100">
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
            onClick={() => onRestore(control.id)}
          >
            Restaurer
          </Button>
        ) : (
          <Button
            variant="outline"
            className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => onArchive(control.id)}
          >
            Archiver
          </Button>
        )}
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => onEdit(control)}
          disabled={viewingArchived}
        >
          Modifier
        </Button>
      </CardFooter>
    </Card>
  );
};
