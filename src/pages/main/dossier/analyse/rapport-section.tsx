
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RapportAnalyseSectionProps {
  dossierId?: string
}

export default function RapportAnalyseSection({ dossierId }: RapportAnalyseSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Colonne de gauche - Informations du rapport */}
      <div className="md:col-span-1 space-y-6">
        <Card className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-medium">Génération du rapport</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm">Dernière génération : 1min</div>
              <Button className="bg-green-600 hover:bg-green-700">Générer le rapport</Button>
            </div>
          </div>
        </Card>

        <Card className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-medium">Documents manquants (2)</h3>
          </div>
          <div className="p-4">
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Liste des bénéficiaires effectifs</li>
              <li>Attestation de domiciliation</li>
            </ul>
          </div>
        </Card>

        <Card className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-medium">Données manquantes (4)</h3>
          </div>
          <div className="p-4">
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Adresse de l'actionnaire N°1 - LBE</li>
              <li>Date de naissance de l'actionnaire N°1 - LBE</li>
              <li>Adresse de l'actionnaire N°2 - LBE</li>
              <li>Date de naissance de l'actionnaire N°2 - LBE</li>
              <li>Profession du conjoint - Client</li>
            </ul>
          </div>
        </Card>

        <Card className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-medium">Contrôles (2)</h3>
          </div>
          <div className="p-4">
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Incohérence des dates des statuts et des bénéficiaires effectifs</li>
              <li>Nom du gérant ne correspond pas au PV de nomination</li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Colonne de droite - Formulaire d'email */}
      <div className="md:col-span-2 space-y-4">
        <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
          <div className="text-sm">Destinataire</div>
          <div className="flex gap-2 items-center">
            <Input defaultValue="helene.turelle@mazars.fr" className="flex-1" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="ComboBox" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contact1">helene.turelle@mazars.fr</SelectItem>
                <SelectItem value="contact2">j.moreau@capiro.fr</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
          <div className="text-sm">CC</div>
          <div className="flex gap-2 items-center">
            <Input className="flex-1" placeholder="Copie à..." />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="ComboBox" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contact1">helene.turelle@mazars.fr</SelectItem>
                <SelectItem value="contact2">j.moreau@capiro.fr</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
          <div className="text-sm">CCI</div>
          <div className="flex gap-2 items-center">
            <Input className="flex-1" placeholder="Copie cachée à..." />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="ComboBox" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contact1">helene.turelle@mazars.fr</SelectItem>
                <SelectItem value="contact2">j.moreau@capiro.fr</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
          <div className="text-sm">Pièces jointes</div>
          <div className="flex items-center gap-2">
            <Input className="flex-1" value="carte_vitale.png, statuts_constitutifs.pdf" readOnly />
            <Button variant="outline">Ajouter</Button>
          </div>
        </div>

        <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
          <div className="text-sm">Titre du mail</div>
          <Input
            defaultValue="X-Formality - Dossier 'Chocolat&Co' - Documents et données manquantes"
            className="flex-1"
          />
        </div>

        <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
          <div className="text-sm">Corps du mail</div>
          <Textarea
            className="min-h-[400px]"
            defaultValue={`Bonjour,

Dans le cadre du projet de création des statuts de la société "Chocolat&Co", voici les documents et informations manquantes :

Liste des documents :
  • Liste des bénéficiaires effectifs
  • Attestation de domiciliation

Liste des informations à récupérer auprès de votre client qui ne se trouve pas dans un document :
  • Profession du conjoint

Nous avons également identifié plusieurs anomalies lors de notre contrôle :
  • Incohérence des dates des statuts et des bénéficiaires effectifs
  • Nom du gérant ne correspond pas au PV de nomination

Pour information, voici la liste des informations manquantes et le document dans lequels elles se trouvent

Information | Source
--- | ---
Profession du conjoint | Auprès du client
Adresse de l'actionnaire N°1 | Liste des bénéficiaires effectifs
Date de naissance de l'actionnaire N°1 | Liste des bénéficiaires effectifs
Adresse de l'actionnaire N°2 | Liste des bénéficiaires effectifs
Date de naissance de l'actionnaire N°2 | Liste des bénéficiaires effectifs

En vous remerciant,
Bonne journée,

Cordialement,

L'équipe juridique X-Formality`}
          />
        </div>

        <div className="flex justify-end">
          <Button className="bg-green-600 hover:bg-green-700">Envoyer</Button>
        </div>
      </div>
    </div>
  )
}
