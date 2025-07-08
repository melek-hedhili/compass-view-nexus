import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Check, Circle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export default function InformationsSection() {
  const [isUrgent, setIsUrgent] = useState(false);

  // Documents requis avec leur statut
  const requiredDocuments = [
    { id: "statut", name: "Statut", status: "pending" },
    { id: "papier-identite", name: "Papier d'identité", status: "pending" },
    {
      id: "attestation-domiciliation",
      name: "Attestation de domiciliation",
      status: "pending",
    },
    { id: "nomination-gerant", name: "Nomination gérant", status: "pending" },
    { id: "carte-vitale", name: "Carte vitale", status: "completed" },
    { id: "annonce-legale", name: "Annonce légale", status: "pending" },
    {
      id: "justificatif-domicile",
      name: "Justificatif de domicile",
      status: "pending",
    },
    { id: "depot-capital", name: "Dépôt de capital", status: "pending" },
  ];

  // État d'avancement
  const progressItems = [
    { id: "ocr", name: "OCR", status: "in-progress" },
    { id: "ia", name: "IA", status: "pending" },
    { id: "certificat-depot", name: "Certificat de dépôt", status: "pending" },
    { id: "kbis", name: "KBIS", status: "pending" },
  ];

  // État du dossier
  const fileStatus = [
    { category: "Documents", total: 8, pending: 1, validated: 1 },
    { category: "Données", total: 45, pending: 0, validated: 0 },
    { category: "Contrôle", total: 12, pending: 0, validated: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="w-1/2 pr-4">
          {/* État du dossier */}
          <Card className="border rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-100 p-3 font-medium">État du dossier</div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium">Information</TableHead>
                  <TableHead className="font-medium text-center">
                    Manquant
                  </TableHead>
                  <TableHead className="font-medium text-center">
                    À normaliser
                  </TableHead>
                  <TableHead className="font-medium text-center">
                    Validé
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fileStatus.map((item) => (
                  <TableRow key={item.category} className="bg-white">
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-center">
                      {item.total - item.pending - item.validated}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.pending}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.validated}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Informations générales */}
          <Card className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-3 font-medium">
              Informations générales
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-[150px_1fr] items-center">
                <div className="text-sm">Nom du client</div>
                <Select defaultValue="chocolat">
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chocolat">Chocolat & Co</SelectItem>
                    <SelectItem value="autre">Autre client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-[150px_1fr] items-center">
                <div className="text-sm">Prestation</div>
                <Select defaultValue="constitution">
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="constitution">Constitution</SelectItem>
                    <SelectItem value="juridique">Juridique</SelectItem>
                    <SelectItem value="comptable">Comptable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-[150px_1fr] items-center">
                <div className="text-sm">Forme juridique</div>
                <Select defaultValue="sarl">
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarl">SARL</SelectItem>
                    <SelectItem value="sas">SAS</SelectItem>
                    <SelectItem value="sci">SCI</SelectItem>
                    <SelectItem value="eurl">EURL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-[150px_1fr] items-center">
                <div className="text-sm">Nom du dossier</div>
                <Input defaultValue="Création" className="border-gray-300" />
              </div>

              <div className="grid grid-cols-[150px_1fr] items-center">
                <div className="text-sm">Journal</div>
                <Select defaultValue="journal-officiel">
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="journal-officiel">
                      Journal Officiel
                    </SelectItem>
                    <SelectItem value="autre-journal">Autre journal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-[150px_1fr] items-center">
                <div className="text-sm">Tarif</div>
                <Input defaultValue="350€" className="border-gray-300" />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Checkbox
                  id="urgent"
                  checked={isUrgent}
                  onCheckedChange={(checked) => setIsUrgent(!!checked)}
                />
                <label htmlFor="urgent" className="text-sm cursor-pointer">
                  Urgent
                </label>
              </div>
            </div>
          </Card>
        </div>

        <div className="w-1/2 pl-4">
          {/* État d'avancement */}
          <Card className="border rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-100 p-3 font-medium">État d'avancement</div>
            <Table>
              <TableBody>
                {progressItems.map((item) => (
                  <TableRow key={item.id} className="bg-white">
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">
                      {item.status === "completed" ? (
                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                          <Check className="h-4 w-4" />
                        </div>
                      ) : item.status === "in-progress" ? (
                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-400 text-white">
                          <span className="text-xs">!</span>
                        </div>
                      ) : (
                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white">
                          <Circle className="h-4 w-4 text-gray-200" />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Documents nécessaires pour le dossier */}
          <Card className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-3 font-medium">
              Documents nécessaires pour le dossier
            </div>
            <Table>
              <TableBody>
                {requiredDocuments.map((doc) => (
                  <TableRow key={doc.id} className="bg-white">
                    <TableCell>{doc.name}</TableCell>
                    <TableCell className="text-right">
                      {doc.status === "completed" ? (
                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                          <Check className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white">
                          <Circle className="h-4 w-4 text-gray-200" />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button variant="outline" className="px-6">
          Mettre à jour
        </Button>
      </div>
    </div>
  );
}
