 
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import InformationsSection from "./informations-section"
import DocumentsSection from "./documents-section"
import AnalyseSection from "./analyse-section"
import RapportSection from "./rapport-section"
import AnnonceSection from "./annonce-section"
import SaisieSection from "./saisie-section"
import ControleSection from "./controle-section"
import MailsSection from "./mails-sections"

interface DossierDetailProps {
  dossierId: string
  onClose: () => void
}

const DossierDetail = ({ dossierId, onClose }: DossierDetailProps) => {
  const [activeTab, setActiveTab] = useState("informations")

  // Calculer le pourcentage de documents requis pour l'affichage dans l'onglet
  const requiredDocumentsPercent = 25 // Valeur statique pour l'exemple, à remplacer par un calcul réel

  return (
    <div className="w-full">
      <div className="border-b mb-4">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Retour
            </Button>
            <h1 className="text-lg font-medium">Dossiers &gt; Création - Chocolat & Co (Cabinet MAZARS)</h1>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b mb-6">
          <TabsList className="flex flex-wrap gap-1 h-auto bg-transparent p-0 w-full justify-start bg-white">
            <TabsTrigger
              value="informations"
              className="flex items-center gap-1.5 px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:text-formality-primary data-[state=active]:bg-transparent bg-white text-gray-600 font-medium"
            >
              Informations
            </TabsTrigger>
            <TabsTrigger
              value="mails"
              className="flex items-center gap-1.5 px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:text-formality-primary data-[state=active]:bg-transparent bg-white text-gray-600 font-medium"
            >
              Mails
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="flex items-center gap-1.5 px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:text-formality-primary data-[state=active]:bg-transparent bg-white text-gray-600 font-medium"
            >
              Documents
              <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">
                {requiredDocumentsPercent}%
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="analyse"
              className="flex items-center gap-1.5 px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:text-formality-primary data-[state=active]:bg-transparent bg-white text-gray-600 font-medium"
            >
              Analyse
            </TabsTrigger>
            <TabsTrigger
              value="rapport"
              className="flex items-center gap-1.5 px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:text-formality-primary data-[state=active]:bg-transparent bg-white text-gray-600 font-medium"
            >
              Rapport
            </TabsTrigger>
            <TabsTrigger
              value="annonce"
              className="flex items-center gap-1.5 px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:text-formality-primary data-[state=active]:bg-transparent bg-white text-gray-600 font-medium"
            >
              Annonce
            </TabsTrigger>
            <TabsTrigger
              value="saisie"
              className="flex items-center gap-1.5 px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:text-formality-primary data-[state=active]:bg-transparent bg-white text-gray-600 font-medium"
            >
              Saisie
            </TabsTrigger>
            <TabsTrigger
              value="controle"
              className="flex items-center gap-1.5 px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:text-formality-primary data-[state=active]:bg-transparent bg-white text-gray-600 font-medium"
            >
              Contrôle
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="informations">
          <InformationsSection dossierId={dossierId} />
        </TabsContent>

        <TabsContent value="mails">
          <MailsSection dossierId={dossierId} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsSection dossierId={dossierId} />
        </TabsContent>

        <TabsContent value="analyse">
          <AnalyseSection dossierId={dossierId} />
        </TabsContent>

        <TabsContent value="rapport">
          <RapportSection dossierId={dossierId} />
        </TabsContent>

        <TabsContent value="annonce">
          <AnnonceSection dossierId={dossierId} />
        </TabsContent>

        <TabsContent value="saisie">
          <SaisieSection dossierId={dossierId} />
        </TabsContent>

        <TabsContent value="controle">
          <ControleSection dossierId={dossierId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DossierDetail
