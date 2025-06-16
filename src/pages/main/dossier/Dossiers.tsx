import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, FileText, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DossierDetail from "./dossier-detail"

interface Dossier {
  id: string
  clientName: string
  cabinetName: string
  type: string
  status: "En cours" | "Terminé" | "En attente"
  progress: number
  createdAt: string
}

const mockDossiers: Dossier[] = [
  {
    id: "1",
    clientName: "Chocolat & Co",
    cabinetName: "Cabinet MAZARS",
    type: "Création",
    status: "En cours",
    progress: 65,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    clientName: "Pâtisserie du coin",
    cabinetName: "FIDAL",
    type: "Liquidation",
    status: "Terminé",
    progress: 100,
    createdAt: "2023-11-20"
  },
  {
    id: "3",
    clientName: "Boulangerie Paul",
    cabinetName: "Deloitte",
    type: "Cession",
    status: "En attente",
    progress: 20,
    createdAt: "2024-02-01"
  },
  {
    id: "4",
    clientName: "Restaurant Le Gourmet",
    cabinetName: "KPMG",
    type: "Fusion",
    status: "En cours",
    progress: 80,
    createdAt: "2023-12-10"
  },
  {
    id: "5",
    clientName: "Pharmacie Centrale",
    cabinetName: "EY",
    type: "Acquisition",
    status: "Terminé",
    progress: 100,
    createdAt: "2024-01-25"
  },
  {
    id: "6",
    clientName: "Supermarché U",
    cabinetName: "Grant Thornton",
    type: "Transformation",
    status: "En cours",
    progress: 40,
    createdAt: "2024-02-15"
  }
]

const Dossiers = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDossier, setSelectedDossier] = useState<string | null>(null)

  const filteredDossiers = mockDossiers.filter(dossier =>
    dossier.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dossier.cabinetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dossier.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (selectedDossier) {
    return (
      <DossierDetail
        dossierId={selectedDossier}
        onClose={() => setSelectedDossier(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1" />
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un dossier..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-formality-primary hover:bg-formality-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau dossier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDossiers.map(dossier => (
          <Card key={dossier.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{dossier.clientName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-600">Cabinet: {dossier.cabinetName}</p>
              <p className="text-gray-600">Type: {dossier.type}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{dossier.status}</Badge>
                <Button variant="outline" size="sm" onClick={() => setSelectedDossier(dossier.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Dossiers
