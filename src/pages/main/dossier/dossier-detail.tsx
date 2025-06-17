
import { useState } from "react"
import { AppTabs, AppTabsList, AppTabsTrigger, AppTabsContent } from "@/components/ui/app-tabs"
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
      <div className="border-b mb-6 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Retour
            </Button>
            <h1 className="text-lg font-medium">Dossiers &gt; Création - Chocolat & Co (Cabinet MAZARS)</h1>
          </div>
        </div>
      </div>

      <AppTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <AppTabsList>
          <AppTabsTrigger value="informations">
            Informations
          </AppTabsTrigger>
          <AppTabsTrigger value="mails">
            Mails
          </AppTabsTrigger>
          <AppTabsTrigger value="documents" badge={`${requiredDocumentsPercent}%`}>
            Documents
          </AppTabsTrigger>
          <AppTabsTrigger value="analyse">
            Analyse
          </AppTabsTrigger>
          <AppTabsTrigger value="rapport">
            Rapport
          </AppTabsTrigger>
          <AppTabsTrigger value="annonce">
            Annonce
          </AppTabsTrigger>
          <AppTabsTrigger value="saisie">
            Saisie
          </AppTabsTrigger>
          <AppTabsTrigger value="controle">
            Contrôle
          </AppTabsTrigger>
        </AppTabsList>

        <AppTabsContent value="informations">
          <InformationsSection dossierId={dossierId} />
        </AppTabsContent>

        <AppTabsContent value="mails">
          <MailsSection dossierId={dossierId} />
        </AppTabsContent>

        <AppTabsContent value="documents">
          <DocumentsSection dossierId={dossierId} />
        </AppTabsContent>

        <AppTabsContent value="analyse">
          <AnalyseSection dossierId={dossierId} />
        </AppTabsContent>

        <AppTabsContent value="rapport">
          <RapportSection dossierId={dossierId} />
        </AppTabsContent>

        <AppTabsContent value="annonce">
          <AnnonceSection dossierId={dossierId} />
        </AppTabsContent>

        <AppTabsContent value="saisie">
          <SaisieSection dossierId={dossierId} />
        </AppTabsContent>

        <AppTabsContent value="controle">
          <ControleSection dossierId={dossierId} />
        </AppTabsContent>
      </AppTabs>
    </div>
  )
}

export default DossierDetail
