import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DocumentViewer() {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium">Documents</div>
        <Select defaultValue="liste">
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Document" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="liste">Liste des documents</SelectItem>
            <SelectItem value="statuts">Statuts</SelectItem>
            <SelectItem value="beneficiaires">
              Liste des bénéficiaires
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="border rounded-lg overflow-hidden h-[600px]">
        <div className="p-4 flex justify-center items-center h-full bg-gray-50">
          <div className="text-center text-gray-500">
            <p>Sélectionnez un document pour l'afficher</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
