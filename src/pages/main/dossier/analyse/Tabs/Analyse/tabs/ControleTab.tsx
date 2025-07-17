import PendingFeature from "../../../PendingFeature";

interface ControleAnalyseSectionProps {
  dossierId?: string;
}

export default function ControleAnalyseSection({
  dossierId,
}: ControleAnalyseSectionProps) {
  return (
    <PendingFeature />
    // <>
    //   {/* Lecture IA Section */}
    //   <Card className="border rounded-lg overflow-hidden">
    //     <div className="p-4 border-b bg-gray-50">
    //       <div className="flex justify-between items-center">
    //         <h3 className="font-medium">Lecture IA</h3>
    //         <div className="flex items-center gap-2">
    //           <span className="text-sm text-gray-500">
    //             2 documents à analyser
    //           </span>
    //           <Button size="sm" className="bg-green-600 hover:bg-green-700">
    //             Lancer IA
    //           </Button>
    //         </div>
    //       </div>
    //     </div>
    //   </Card>

    //   <div className="flex gap-6">
    //     <div className="w-1/2">
    //       {/* Statut du contrôle */}
    //       <div className="mb-4 flex items-center gap-2">
    //         <span className="text-sm font-medium">Statut du contrôle</span>
    //         <Select defaultValue="etude">
    //           <SelectTrigger className="w-[180px]">
    //             <SelectValue placeholder="Statut" />
    //           </SelectTrigger>
    //           <SelectContent>
    //             <SelectItem value="etude">Etude</SelectItem>
    //             <SelectItem value="en-cours">En cours</SelectItem>
    //             <SelectItem value="termine">Terminé</SelectItem>
    //           </SelectContent>
    //         </Select>
    //       </div>

    //       {/* STATUTS JURIDIQUES */}
    //       <Card className="border rounded-lg overflow-hidden mb-6">
    //         <div className="p-3 bg-gray-100 border-b">
    //           <h3 className="font-medium uppercase">Statuts juridiques</h3>
    //         </div>

    //         <div className="bg-gray-50 p-4 border-b">
    //           <div className="flex justify-between items-center mb-2">
    //             <div className="flex items-center gap-2">
    //               <h4 className="font-medium">
    //                 Conférence des dates des statuts
    //               </h4>
    //               <ChevronDown className="h-4 w-4" />
    //             </div>
    //             <div className="flex items-center gap-2">
    //               <Button variant="outline" size="sm" className="h-7 px-3">
    //                 NON
    //               </Button>
    //               <Button
    //                 variant="outline"
    //                 size="sm"
    //                 className="h-7 px-3 bg-orange-100"
    //               >
    //                 -
    //               </Button>
    //               <Button
    //                 variant="outline"
    //                 size="sm"
    //                 className="h-7 px-3 bg-green-100"
    //               >
    //                 OUI
    //               </Button>
    //             </div>
    //           </div>
    //           <p className="text-xs text-gray-600 mb-3">
    //             La date présente dans les statuts doit être conforme à celle
    //             présente dans la liste des bénéficiaires effectifs.
    //           </p>

    //           <div className="grid grid-cols-2 gap-2 bg-white p-2 border rounded">
    //             <div>
    //               <div className="text-xs text-gray-500">
    //                 Statut constitutif
    //               </div>
    //               <div className="text-sm">15/12/2024</div>
    //             </div>
    //             <div>
    //               <div className="text-xs text-gray-500">
    //                 Liste des bénéficiaires
    //               </div>
    //               <div className="text-sm">15/12/2024</div>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="bg-gray-50 p-4 border-b">
    //           <div className="flex justify-between items-center mb-2">
    //             <div className="flex items-center gap-2">
    //               <h4 className="font-medium">Présence des signatures</h4>
    //               <ChevronDown className="h-4 w-4" />
    //             </div>
    //             <div className="flex items-center gap-2">
    //               <Button variant="outline" size="sm" className="h-7 px-3">
    //                 NON
    //               </Button>
    //               <Button
    //                 variant="outline"
    //                 size="sm"
    //                 className="h-7 px-3 bg-orange-100"
    //               >
    //                 -
    //               </Button>
    //               <Button
    //                 variant="outline"
    //                 size="sm"
    //                 className="h-7 px-3 bg-green-100"
    //               >
    //                 OUI
    //               </Button>
    //             </div>
    //           </div>
    //           <p className="text-xs text-gray-600">
    //             Les signatures doivent être présentes sur les documents
    //             suivants:
    //             <br />
    //             <a href="#" className="text-blue-600 hover:underline">
    //               Statuts
    //             </a>
    //             <br />
    //             <a href="#" className="text-blue-600 hover:underline">
    //               Liste des bénéficiaires effectifs
    //             </a>
    //           </p>
    //         </div>
    //       </Card>

    //       {/* LISTE DES BENEFICIAIRES EFFECTIFS */}
    //       <Card className="border rounded-lg overflow-hidden">
    //         <div className="p-3 bg-gray-100 border-b">
    //           <h3 className="font-medium uppercase">
    //             Liste des bénéficiaires effectifs
    //           </h3>
    //         </div>

    //         <div className="bg-gray-50 p-4 border-b">
    //           <div className="flex justify-between items-center mb-2">
    //             <div className="flex items-center gap-2">
    //               <h4 className="font-medium">
    //                 Présence de la clause de succession
    //               </h4>
    //               <ChevronDown className="h-4 w-4" />
    //             </div>
    //             <div className="flex items-center gap-2">
    //               <Button variant="outline" size="sm" className="h-7 px-3">
    //                 NON
    //               </Button>
    //               <Button
    //                 variant="outline"
    //                 size="sm"
    //                 className="h-7 px-3 bg-orange-100"
    //               >
    //                 -
    //               </Button>
    //               <Button
    //                 variant="outline"
    //                 size="sm"
    //                 className="h-7 px-3 bg-green-100"
    //               >
    //                 OUI
    //               </Button>
    //             </div>
    //           </div>
    //           <p className="text-xs text-gray-600 mb-2">
    //             La clause doit comporter les règles de succession
    //             <br />
    //             <a href="#" className="text-blue-600 hover:underline">
    //               Modèle
    //             </a>
    //           </p>

    //           <div className="bg-white p-3 border rounded text-xs text-gray-700">
    //             <p>
    //               "Tous tous les actes et documents émanant de la Société, la
    //               dénomination sociale doit être précédée ou suivie
    //               immédiatement des mots "société à responsabilité limitée" ou
    //               des initiales "SARL" et de l'énonciation du montant du capital
    //               social.
    //             </p>
    //             <p className="mt-2">
    //               En outre, la Société doit indiquer en tête de ses factures,
    //               notes de commandes, tarifs et documents publicitaires, ainsi
    //               que sur toutes correspondances et récépissés concernant son
    //               activité et signés par elle ou en son nom, le siège du
    //               tribunal au greffe duquel elle est immatriculée au Registre du
    //               commerce et des sociétés, et le numéro d'immatriculation
    //               qu'elle a reçu."
    //             </p>
    //           </div>
    //         </div>

    //         <div className="bg-gray-50 p-4">
    //           <div className="flex justify-between items-center mb-2">
    //             <div className="flex items-center gap-2">
    //               <h4 className="font-medium">Présence des signatures</h4>
    //               <ChevronDown className="h-4 w-4" />
    //             </div>
    //             <div className="flex items-center gap-2">
    //               <Button variant="outline" size="sm" className="h-7 px-3">
    //                 NON
    //               </Button>
    //               <Button
    //                 variant="outline"
    //                 size="sm"
    //                 className="h-7 px-3 bg-orange-100"
    //               >
    //                 -
    //               </Button>
    //               <Button
    //                 variant="outline"
    //                 size="sm"
    //                 className="h-7 px-3 bg-green-100"
    //               >
    //                 OUI
    //               </Button>
    //             </div>
    //           </div>
    //           <p className="text-xs text-gray-600">
    //             Les signatures doivent être présentes sur les documents
    //             suivants:
    //             <br />
    //             <a href="#" className="text-blue-600 hover:underline">
    //               Statuts
    //             </a>
    //             <br />
    //             <a href="#" className="text-blue-600 hover:underline">
    //               Liste des bénéficiaires effectifs
    //             </a>
    //           </p>
    //         </div>
    //       </Card>
    //     </div>

    //     {/* Document Viewer */}
    //     <div className="w-1/2">
    //       <Card className="border rounded-lg overflow-hidden h-full">
    //         <div className="p-4 border-b flex justify-between items-center bg-gray-50">
    //           <div className="flex gap-2">
    //             <Select defaultValue="liste">
    //               <SelectTrigger className="w-[220px]">
    //                 <SelectValue placeholder="Document" />
    //               </SelectTrigger>
    //               <SelectContent>
    //                 <SelectItem value="liste">Liste des documents</SelectItem>
    //                 <SelectItem value="statuts">Statuts</SelectItem>
    //                 <SelectItem value="beneficiaires">
    //                   Liste des bénéficiaires
    //                 </SelectItem>
    //               </SelectContent>
    //             </Select>
    //           </div>
    //         </div>
    //         <div className="p-4 flex justify-center items-center h-[600px] bg-gray-50">
    //           <div className="text-center text-gray-500">
    //             <p>Sélectionnez un document pour l'afficher</p>
    //           </div>
    //         </div>
    //       </Card>
    //     </div>
    //   </div>
    // </>
  );
}
