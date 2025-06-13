
import { Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DonneesAnalyseSectionProps {
  dossierId?: string
}

export default function DonneesAnalyseSection({ dossierId }: DonneesAnalyseSectionProps) {
  return (
    <div className="flex gap-6">
      <div className="w-1/2">
        {/* Statut du contrôle */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm font-medium">Statut du contrôle</span>
          <Select defaultValue="etude">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="etude">Etude</SelectItem>
              <SelectItem value="en-cours">En cours</SelectItem>
              <SelectItem value="termine">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statut section */}
        <div className="mb-6">
          <h3 className="font-medium mb-4">Statut</h3>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-40 text-sm">Nom de l'entreprise</div>
              <div className="flex-1 flex items-center gap-2">
                <Input defaultValue="Chocolat & Co" className="max-w-xs" />
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
                  <Check className="h-3 w-3" />
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Statut
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-40 text-sm">Forme juridique</div>
              <div className="flex-1 flex items-center gap-2">
                <Select defaultValue="sas">
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="Forme juridique" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sas">SAS</SelectItem>
                    <SelectItem value="sarl">SARL</SelectItem>
                    <SelectItem value="sa">SA</SelectItem>
                    <SelectItem value="sci">SCI</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
                  <Check className="h-3 w-3" />
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Statut
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-40 text-sm">Filiale ou une sous filiale d'une entreprise agricole</div>
              <div className="flex-1 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input type="radio" id="filiale-non" name="filiale" />
                  <label htmlFor="filiale-non">-</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" id="filiale-oui" name="filiale" defaultChecked />
                  <label htmlFor="filiale-oui">Oui</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" id="filiale-non" name="filiale" />
                  <label htmlFor="filiale-non">Non</label>
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                  <Check className="h-3 w-3" />
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Statut
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-40 text-sm">Entreprise agricole</div>
              <div className="flex-1 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input type="radio" id="agricole-non" name="agricole" defaultChecked />
                  <label htmlFor="agricole-non">-</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" id="agricole-oui" name="agricole" />
                  <label htmlFor="agricole-oui">Oui</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" id="agricole-non" name="agricole" />
                  <label htmlFor="agricole-non">Non</label>
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
                  <Check className="h-3 w-3" />
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Statut
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-40 text-sm">Principale activité</div>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  defaultValue="Fabrication et commercialisation de denrées alimentaires périssables"
                  className="max-w-xs"
                />
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
                  <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Statut
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-40 text-sm">Durée</div>
              <div className="flex-1 flex items-center gap-2">
                <Input className="max-w-xs" />
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
                  <Check className="h-3 w-3" />
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Statut
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des bénéficiaires effectifs */}
        <div>
          <h3 className="font-medium mb-4">Liste des bénéficiaires effectifs</h3>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-40 text-sm">Nombre d'associés</div>
              <div className="flex-1 flex items-center gap-2">
                <Input defaultValue="2" className="max-w-[60px]" />
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                  <Check className="h-3 w-3" />
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  LBE
                </a>
              </div>
            </div>

            <div className="ml-4">
              <h4 className="font-medium mb-2">Associé N°1</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-36 text-sm">Prénom</div>
                  <div className="flex-1 flex items-center gap-2">
                    <Input className="max-w-xs" />
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
                      <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                    </div>
                    <a href="#" className="text-blue-600 hover:underline text-sm">
                      LBE
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-36 text-sm">Nom</div>
                  <div className="flex-1 flex items-center gap-2">
                    <Input className="max-w-xs" />
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
                      <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                    </div>
                    <a href="#" className="text-blue-600 hover:underline text-sm">
                      LBE
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="ml-4">
              <h4 className="font-medium mb-2">Associé N°2</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-36 text-sm">Prénom</div>
                  <div className="flex-1 flex items-center gap-2">
                    <Input className="max-w-xs" />
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
                      <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                    </div>
                    <a href="#" className="text-blue-600 hover:underline text-sm">
                      LBE
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-36 text-sm">Nom</div>
                  <div className="flex-1 flex items-center gap-2">
                    <Input className="max-w-xs" />
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
                      <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                    </div>
                    <a href="#" className="text-blue-600 hover:underline text-sm">
                      LBE
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer */}
      <div className="w-1/2">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-medium">Documents</div>
          <Select defaultValue="liste">
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Document" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="liste">Liste des documents</SelectItem>
              <SelectItem value="statuts">Statuts</SelectItem>
              <SelectItem value="beneficiaires">Liste des bénéficiaires</SelectItem>
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
    </div>
  )
}
