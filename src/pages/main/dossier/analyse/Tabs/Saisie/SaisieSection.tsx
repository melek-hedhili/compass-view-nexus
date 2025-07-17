import { useState } from "react";
import PendingFeature from "../../PendingFeature";

interface SaisieSectionProps {
  dossierId?: string;
}

export default function SaisieSection({ dossierId }: SaisieSectionProps) {
  const [selectedDocument, setSelectedDocument] = useState("liste");
  const [nombreAssocies, setNombreAssocies] = useState("2");

  return (
    <PendingFeature />
    // <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //   {/* Colonne de gauche - Formulaire */}
    //   <div className="space-y-8">
    //     {/* Informations générales */}
    //     <div>
    //       <h2 className="text-lg font-medium mb-4">Informations générales</h2>
    //       <div className="space-y-4">
    //         <div className="flex items-center">
    //           <div className="w-48 text-sm">Nom de l'entreprise</div>
    //           <div className="flex-1 flex items-center gap-2">
    //             <div className="relative flex-1 max-w-xs">
    //               <Input defaultValue="Chocolat & Co" />
    //               <Button
    //                 variant="ghost"
    //                 size="icon"
    //                 className="absolute right-0 top-0 h-full w-8 flex items-center justify-center text-gray-400"
    //               >
    //                 <Copy className="h-4 w-4" />
    //               </Button>
    //             </div>
    //             <a href="#" className="text-blue-600 hover:underline text-sm">
    //               Statut
    //             </a>
    //           </div>
    //         </div>

    //         <div className="flex items-center">
    //           <div className="w-48 text-sm">Forme juridique</div>
    //           <div className="flex-1 flex items-center gap-2">
    //             <div className="relative flex-1 max-w-xs">
    //               <Select defaultValue="sas">
    //                 <SelectTrigger>
    //                   <SelectValue placeholder="Forme juridique" />
    //                 </SelectTrigger>
    //                 <SelectContent>
    //                   <SelectItem value="sas">SAS</SelectItem>
    //                   <SelectItem value="sarl">SARL</SelectItem>
    //                   <SelectItem value="sa">SA</SelectItem>
    //                   <SelectItem value="sci">SCI</SelectItem>
    //                 </SelectContent>
    //               </Select>
    //             </div>
    //             <a href="#" className="text-blue-600 hover:underline text-sm">
    //               Statut
    //             </a>
    //           </div>
    //         </div>

    //         <div className="flex items-center">
    //           <div className="w-48 text-sm">
    //             Filiale ou une sous filiale d'une entreprise agricole
    //           </div>
    //           <div className="flex-1 flex items-center gap-2">
    //             <RadioGroup defaultValue="oui" className="flex gap-4">
    //               <div className="flex items-center space-x-2">
    //                 <RadioGroupItem value="oui" id="filiale-oui" />
    //                 <Label htmlFor="filiale-oui">Oui</Label>
    //               </div>
    //               <div className="flex items-center space-x-2">
    //                 <RadioGroupItem value="non" id="filiale-non" />
    //                 <Label htmlFor="filiale-non">Non</Label>
    //               </div>
    //             </RadioGroup>
    //             <a href="#" className="text-blue-600 hover:underline text-sm">
    //               Statut
    //             </a>
    //           </div>
    //         </div>

    //         <div className="flex items-center">
    //           <div className="w-48 text-sm">Entreprise agricole</div>
    //           <div className="flex-1 flex items-center gap-2">
    //             <RadioGroup defaultValue="non" className="flex gap-4">
    //               <div className="flex items-center space-x-2">
    //                 <RadioGroupItem value="oui" id="agricole-oui" />
    //                 <Label htmlFor="agricole-oui">Oui</Label>
    //               </div>
    //               <div className="flex items-center space-x-2">
    //                 <RadioGroupItem value="non" id="agricole-non" />
    //                 <Label htmlFor="agricole-non">Non</Label>
    //               </div>
    //             </RadioGroup>
    //             <a href="#" className="text-blue-600 hover:underline text-sm">
    //               Statut
    //             </a>
    //           </div>
    //         </div>

    //         <div className="flex items-center">
    //           <div className="w-48 text-sm">Principale activité</div>
    //           <div className="flex-1 flex items-center gap-2">
    //             <div className="relative flex-1 max-w-xs">
    //               <Input defaultValue="Fabrication et commercialisation de denrées alimentaires périssables" />
    //               <Button
    //                 variant="ghost"
    //                 size="icon"
    //                 className="absolute right-0 top-0 h-full w-8 flex items-center justify-center text-gray-400"
    //               >
    //                 <Edit className="h-4 w-4" />
    //               </Button>
    //             </div>
    //             <a href="#" className="text-blue-600 hover:underline text-sm">
    //               Statut
    //             </a>
    //           </div>
    //         </div>

    //         <div className="flex items-center">
    //           <div className="w-48 text-sm">Durée (en années)</div>
    //           <div className="flex-1 flex items-center gap-2">
    //             <div className="relative flex-1 max-w-xs">
    //               <Input defaultValue="99" className="max-w-[80px]" />
    //               <Button
    //                 variant="ghost"
    //                 size="icon"
    //                 className="absolute right-0 top-0 h-full w-8 flex items-center justify-center text-gray-400"
    //               >
    //                 <Copy className="h-4 w-4" />
    //               </Button>
    //             </div>
    //             <a href="#" className="text-blue-600 hover:underline text-sm">
    //               Statut
    //             </a>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Associés */}
    //     <div>
    //       <h2 className="text-lg font-medium mb-4">Associés</h2>
    //       <div className="space-y-4">
    //         <div className="flex items-center">
    //           <div className="w-48 text-sm">Nombre d'associés</div>
    //           <div className="flex-1 flex items-center gap-2">
    //             <Input
    //               value={nombreAssocies}
    //               onChange={(e) => setNombreAssocies(e.target.value)}
    //               className="max-w-[80px]"
    //             />
    //             <a href="#" className="text-blue-600 hover:underline text-sm">
    //               LBE
    //             </a>
    //           </div>
    //         </div>

    //         {/* Associé N°1 */}
    //         <div className="ml-4 mt-4">
    //           <h3 className="font-medium mb-3">Associé N°1</h3>
    //           <div className="space-y-3">
    //             <div className="flex items-center">
    //               <div className="w-44 text-sm">Prénom</div>
    //               <div className="flex-1 flex items-center gap-2">
    //                 <div className="relative flex-1 max-w-xs">
    //                   <Input defaultValue="Jacques" />
    //                   <Button
    //                     variant="ghost"
    //                     size="icon"
    //                     className="absolute right-0 top-0 h-full w-8 flex items-center justify-center text-gray-400"
    //                   >
    //                     <Edit className="h-4 w-4" />
    //                   </Button>
    //                 </div>
    //                 <a
    //                   href="#"
    //                   className="text-blue-600 hover:underline text-sm"
    //                 >
    //                   LBE
    //                 </a>
    //               </div>
    //             </div>
    //             <div className="flex items-center">
    //               <div className="w-44 text-sm">Nom</div>
    //               <div className="flex-1 flex items-center gap-2">
    //                 <div className="relative flex-1 max-w-xs">
    //                   <Input defaultValue="ADIT" />
    //                   <Button
    //                     variant="ghost"
    //                     size="icon"
    //                     className="absolute right-0 top-0 h-full w-8 flex items-center justify-center text-gray-400"
    //                   >
    //                     <Edit className="h-4 w-4" />
    //                   </Button>
    //                 </div>
    //                 <a
    //                   href="#"
    //                   className="text-blue-600 hover:underline text-sm"
    //                 >
    //                   LBE
    //                 </a>
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Associé N°2 */}
    //         <div className="ml-4 mt-4">
    //           <h3 className="font-medium mb-3">Associé N°2</h3>
    //           <div className="space-y-3">
    //             <div className="flex items-center">
    //               <div className="w-44 text-sm">Prénom</div>
    //               <div className="flex-1 flex items-center gap-2">
    //                 <div className="relative flex-1 max-w-xs">
    //                   <Input defaultValue="Jean" />
    //                   <Button
    //                     variant="ghost"
    //                     size="icon"
    //                     className="absolute right-0 top-0 h-full w-8 flex items-center justify-center text-gray-400"
    //                   >
    //                     <Edit className="h-4 w-4" />
    //                   </Button>
    //                 </div>
    //                 <a
    //                   href="#"
    //                   className="text-blue-600 hover:underline text-sm"
    //                 >
    //                   LBE
    //                 </a>
    //               </div>
    //             </div>
    //             <div className="flex items-center">
    //               <div className="w-44 text-sm">Nom</div>
    //               <div className="flex-1 flex items-center gap-2">
    //                 <div className="relative flex-1 max-w-xs">
    //                   <Input defaultValue="AIMARRE" />
    //                   <Button
    //                     variant="ghost"
    //                     size="icon"
    //                     className="absolute right-0 top-0 h-full w-8 flex items-center justify-center text-gray-400"
    //                   >
    //                     <Edit className="h-4 w-4" />
    //                   </Button>
    //                 </div>
    //                 <a
    //                   href="#"
    //                   className="text-blue-600 hover:underline text-sm"
    //                 >
    //                   LBE
    //                 </a>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Documents */}
    //     <div>
    //       <h2 className="text-lg font-medium mb-4">Documents</h2>
    //       <div className="flex items-center gap-3">
    //         <Button variant="outline" className="flex items-center gap-2">
    //           Télécharger la liasse de document
    //           <Download className="h-4 w-4" />
    //         </Button>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Colonne de droite - Visualisation des documents */}
    //   <div>
    //     <div className="mb-4">
    //       <div className="flex items-center justify-between">
    //         <h2 className="text-lg font-medium">Documents</h2>
    //         <Select
    //           value={selectedDocument}
    //           onValueChange={setSelectedDocument}
    //         >
    //           <SelectTrigger className="w-[220px]">
    //             <SelectValue placeholder="Type de document" />
    //           </SelectTrigger>
    //           <SelectContent>
    //             <SelectItem value="liste">Liste des documents</SelectItem>
    //             <SelectItem value="statuts">Statuts</SelectItem>
    //             <SelectItem value="kbis">Extrait K-bis</SelectItem>
    //             <SelectItem value="identite">Pièce d'identité</SelectItem>
    //           </SelectContent>
    //         </Select>
    //       </div>
    //     </div>

    //     <Card className="border rounded-lg overflow-hidden h-[600px]">
    //       <div className="p-4 flex justify-center items-center h-full bg-gray-50">
    //         {selectedDocument === "liste" ? (
    //           <div className="text-center text-gray-500">
    //             <p>Sélectionnez un document spécifique pour l'afficher</p>
    //           </div>
    //         ) : (
    //           <div className="text-center text-gray-500">
    //             <p>Aperçu du document: {selectedDocument}</p>
    //           </div>
    //         )}
    //       </div>
    //     </Card>
    //   </div>
    // </div>
  );
}
