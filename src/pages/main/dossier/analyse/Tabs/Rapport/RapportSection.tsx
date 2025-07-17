import { useState } from "react";
import PendingFeature from "../../PendingFeature";

interface RapportSectionProps {
  dossierId?: string;
}

export default function RapportSection({ dossierId }: RapportSectionProps) {
  const [showSignatureDetails, setShowSignatureDetails] = useState(true);

  return (
    <PendingFeature />
    // <div className="flex gap-6">
    //   <div className="w-1/2">
    //     <div className="space-y-6">
    //       {/* Associé N°1 */}
    //       <div>
    //         <h3 className="font-medium mb-3">Associé N°1</h3>
    //         <div className="space-y-3">
    //           <div className="flex items-center">
    //             <div className="w-36 text-sm">Date de naissance</div>
    //             <div className="flex-1 flex items-center gap-2">
    //               <Input className="max-w-xs border-gray-300" />
    //               <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
    //                 <span className="text-xs">!</span>
    //               </div>
    //               <a href="#" className="text-blue-600 hover:underline text-sm">
    //                 LBE
    //               </a>
    //             </div>
    //           </div>
    //           <div className="flex items-center">
    //             <div className="w-36 text-sm">Adresse</div>
    //             <div className="flex-1 flex items-center gap-2">
    //               <Input className="max-w-xs border-gray-300" />
    //               <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
    //                 <span className="text-xs">!</span>
    //               </div>
    //               <a href="#" className="text-blue-600 hover:underline text-sm">
    //                 LBE
    //               </a>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Associé N°2 */}
    //       <div>
    //         <h3 className="font-medium mb-3">Associé N°2</h3>
    //         <div className="space-y-3">
    //           <div className="flex items-center">
    //             <div className="w-36 text-sm">Date de naissance</div>
    //             <div className="flex-1 flex items-center gap-2">
    //               <Input className="max-w-xs border-gray-300" />
    //               <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
    //                 <span className="text-xs">!</span>
    //               </div>
    //               <a href="#" className="text-blue-600 hover:underline text-sm">
    //                 LBE
    //               </a>
    //             </div>
    //           </div>
    //           <div className="flex items-center">
    //             <div className="w-36 text-sm">Adresse</div>
    //             <div className="flex-1 flex items-center gap-2">
    //               <Input className="max-w-xs border-gray-300" />
    //               <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
    //                 <span className="text-xs">!</span>
    //               </div>
    //               <a href="#" className="text-blue-600 hover:underline text-sm">
    //                 LBE
    //               </a>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Conjoint */}
    //       <div>
    //         <h3 className="font-medium mb-3">Conjoint</h3>
    //         <div className="space-y-3">
    //           <div className="flex items-center">
    //             <div className="w-36 text-sm">Profession</div>
    //             <div className="flex-1 flex items-center gap-2">
    //               <Input className="max-w-xs border-gray-300" />
    //               <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
    //                 <span className="text-xs">!</span>
    //               </div>
    //               <a href="#" className="text-blue-600 hover:underline text-sm">
    //                 Client
    //               </a>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Présence des signatures */}
    //       <div className="border-t pt-4">
    //         <div className="flex items-center justify-between mb-2">
    //           <div className="flex items-center gap-2">
    //             <h3 className="font-medium">Présence des signatures</h3>
    //             <button
    //               onClick={() => setShowSignatureDetails(!showSignatureDetails)}
    //               className="focus:outline-none"
    //             >
    //               <ChevronDown
    //                 className={`h-4 w-4 transition-transform ${
    //                   showSignatureDetails ? "transform rotate-180" : ""
    //                 }`}
    //               />
    //             </button>
    //           </div>
    //           <div className="flex items-center gap-2">
    //             <Button
    //               variant="outline"
    //               size="sm"
    //               className="h-7 px-3 border-gray-300"
    //             >
    //               NON
    //             </Button>
    //             <Button
    //               variant="outline"
    //               size="sm"
    //               className="h-7 px-3 bg-orange-100 border-orange-300"
    //             >
    //               -
    //             </Button>
    //             <Button
    //               variant="outline"
    //               size="sm"
    //               className="h-7 px-3 bg-green-100 border-green-300"
    //             >
    //               OUI
    //             </Button>
    //           </div>
    //         </div>

    //         {showSignatureDetails && (
    //           <div className="bg-gray-100 p-3 rounded text-sm">
    //             <p className="text-gray-700">
    //               Les signatures doivent être présentes sur les documents
    //               suivants:
    //             </p>
    //             <a href="#" className="text-blue-600 hover:underline block">
    //               Statuts
    //             </a>
    //             <a href="#" className="text-blue-600 hover:underline block">
    //               Liste des bénéficiaires effectifs
    //             </a>
    //           </div>
    //         )}
    //       </div>

    //       {/* Documents manquants */}
    //       <div className="border-t pt-4">
    //         <h3 className="font-medium mb-3">Documents manquants</h3>
    //         <div className="border rounded-md overflow-hidden">
    //           <div className="flex items-center justify-between p-2 border-b bg-white">
    //             <span className="text-sm">Justificatif de domicile</span>
    //             <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
    //               <span className="text-xs">!</span>
    //             </div>
    //           </div>
    //           <div className="flex items-center justify-between p-2 bg-white">
    //             <span className="text-sm">
    //               Liste des bénéficiaires effectifs
    //             </span>
    //             <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
    //               <span className="text-xs">!</span>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Documents non normalisés */}
    //       <div className="border-t pt-4">
    //         <h3 className="font-medium mb-3">Documents non normalisés</h3>
    //         <div className="border rounded-md overflow-hidden">
    //           <div className="flex items-center justify-between p-2 border-b bg-white">
    //             <span className="text-sm">Justificatif de domicile</span>
    //           </div>
    //           <div className="flex items-center justify-between p-2 bg-white">
    //             <span className="text-sm">
    //               Liste des bénéficiaires effectifs
    //             </span>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Validation button */}
    //       <div className="flex justify-between items-center pt-4">
    //         <Button
    //           variant="outline"
    //           size="icon"
    //           className="rounded-md border-gray-800"
    //         >
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             width="16"
    //             height="16"
    //             viewBox="0 0 24 24"
    //             fill="none"
    //             stroke="currentColor"
    //             strokeWidth="2"
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             className="lucide lucide-lock"
    //           >
    //             <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    //             <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    //           </svg>
    //         </Button>
    //         <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300">
    //           Valider le dossier
    //         </Button>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Document Viewer */}
    //   <div className="w-1/2">
    //     <div className="mb-4 flex items-center justify-between">
    //       <div className="text-sm font-medium">Documents</div>
    //       <Select defaultValue="liste">
    //         <SelectTrigger className="w-[220px] border-gray-300">
    //           <SelectValue placeholder="Document" />
    //         </SelectTrigger>
    //         <SelectContent>
    //           <SelectItem value="liste">Liste des documents</SelectItem>
    //           <SelectItem value="statuts">Statuts</SelectItem>
    //           <SelectItem value="beneficiaires">
    //             Liste des bénéficiaires
    //           </SelectItem>
    //         </SelectContent>
    //       </Select>
    //     </div>

    //     <div className="border rounded-lg overflow-hidden h-[600px]">
    //       <div className="p-4 flex justify-center items-center h-full bg-gray-50">
    //         <div className="text-center text-gray-500">
    //           <p>Sélectionnez un document pour l'afficher</p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
