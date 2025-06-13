
import { useState } from "react"
import { Button } from "@/components/ui/button"
import ControleAnalyseSection from "./analyse/controle-section"
import DonneesAnalyseSection from "./analyse/donnees-section"
import RapportAnalyseSection from "./analyse/rapport-section"
 

interface AnalyseSectionProps {
  dossierId?: string
}

export default function AnalyseSection({ dossierId }: AnalyseSectionProps) {
  const [activeAnalyseTab, setActiveAnalyseTab] = useState("controle")

  return (
    <div className="space-y-6">
      {/* Sous-navbar pour l'analyse */}
      <div className="flex border-b">
        <Button
          variant="ghost"
          className={`px-4 py-2 rounded-none ${
            activeAnalyseTab === "controle"
              ? "border-b-2 border-formality-primary text-formality-primary"
              : "text-gray-600"
          }`}
          onClick={() => setActiveAnalyseTab("controle")}
        >
          Contrôle (15%)
        </Button>
        <Button
          variant="ghost"
          className={`px-4 py-2 rounded-none ${
            activeAnalyseTab === "donnees"
              ? "border-b-2 border-formality-primary text-formality-primary"
              : "text-gray-600"
          }`}
          onClick={() => setActiveAnalyseTab("donnees")}
        >
          Données (8%)
        </Button>
        <Button
          variant="ghost"
          className={`px-4 py-2 rounded-none ${
            activeAnalyseTab === "rapport"
              ? "border-b-2 border-formality-primary text-formality-primary"
              : "text-gray-600"
          }`}
          onClick={() => setActiveAnalyseTab("rapport")}
        >
          Rapport
        </Button>
      </div>

      {activeAnalyseTab === "controle" && <ControleAnalyseSection dossierId={dossierId} />}
      {activeAnalyseTab === "donnees" && <DonneesAnalyseSection dossierId={dossierId} />}
      {activeAnalyseTab === "rapport" && <RapportAnalyseSection dossierId={dossierId} />}
    </div>
  )
}
