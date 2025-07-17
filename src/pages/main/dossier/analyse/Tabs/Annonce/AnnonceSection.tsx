import { useState } from "react";
import PendingFeature from "../../PendingFeature";

interface AnnonceSectionProps {
  dossierId?: string;
}

export default function AnnonceSection({ dossierId }: AnnonceSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // Define the sections/pages
  const sections = [
    { id: "publication", title: "Publication" },
    { id: "acces", title: "Accès" },
    { id: "documents", title: "Documents" },
  ];

  const goToNextPage = () => {
    if (currentPage < sections.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <PendingFeature />
    //     <div className="space-y-6">
    //       {/* Navigation tabs */}
    //       <div className="flex border-b">
    //         {sections.map((section, index) => (
    //           <Button
    //             key={section.id}
    //             variant="ghost"
    //             className={`px-4 py-2 rounded-none ${
    //               currentPage === index
    //                 ? "border-b-2 border-formality-primary text-formality-primary"
    //                 : "text-gray-600"
    //             }`}
    //             onClick={() => setCurrentPage(index)}
    //           >
    //             {section.title}
    //           </Button>
    //         ))}
    //       </div>

    //       {/* Content area */}
    //       <div className="flex gap-6">
    //         {/* Left column - Form content */}
    //         <div className="w-2/3">
    //           {/* Page 0: Publication */}
    //           {currentPage === 0 && (
    //             <div className="space-y-6">
    //               <Card className="p-6 border rounded-lg">
    //                 <h3 className="font-medium mb-4 text-lg">Journal</h3>
    //                 <div className="space-y-4">
    //                   <Input className="w-full" placeholder="Nom du journal" />
    //                 </div>
    //               </Card>

    //               <Card className="p-6 border rounded-lg">
    //                 <h3 className="font-medium mb-4 text-lg">Texte de l'annonce</h3>
    //                 <div className="space-y-4">
    //                   <Textarea
    //                     className="min-h-[300px] font-mono text-sm"
    //                     placeholder="Saisissez le texte de l'annonce ici..."
    //                     defaultValue={`Par acte SSP du 15/12/2024 il a été constitué une SARL dénommée: CHOCOLAT & CO
    // Siège social: 25 rue des Lilas 75001 PARIS
    // Capital: 10.000€
    // Objet: Fabrication et commercialisation de denrées alimentaires périssables
    // Gérant: M. DUPONT Jean, 12 avenue Victor Hugo 75016 PARIS
    // Durée: 99 ans à compter de l'immatriculation au RCS de PARIS`}
    //                   />
    //                   <div className="flex justify-end">
    //                     <Button
    //                       variant="outline"
    //                       size="sm"
    //                       className="flex items-center gap-1"
    //                     >
    //                       <Copy className="h-4 w-4" /> Copier
    //                     </Button>
    //                   </div>
    //                 </div>
    //               </Card>
    //             </div>
    //           )}

    //           {/* Page 1: Accès */}
    //           {currentPage === 1 && (
    //             <div className="space-y-6">
    //               <Card className="p-6 border rounded-lg">
    //                 <h3 className="font-medium mb-4 text-lg">Login</h3>
    //                 <div className="flex items-center gap-4">
    //                   <Input className="max-w-xs" placeholder="Identifiant" />
    //                   <Button
    //                     variant="outline"
    //                     size="sm"
    //                     className="flex items-center gap-1"
    //                   >
    //                     Accès au site <Lock className="h-4 w-4 ml-1" />
    //                   </Button>
    //                 </div>
    //               </Card>

    //               <Card className="p-6 border rounded-lg">
    //                 <h3 className="font-medium mb-4 text-lg">Mot de passe</h3>
    //                 <div className="flex items-center gap-4">
    //                   <Input
    //                     className="max-w-xs"
    //                     type="password"
    //                     placeholder="Mot de passe"
    //                   />
    //                   <Button
    //                     variant="outline"
    //                     size="sm"
    //                     className="flex items-center gap-1"
    //                   >
    //                     <Copy className="h-4 w-4" /> Copier
    //                   </Button>
    //                 </div>
    //               </Card>

    //               <Card className="p-6 border rounded-lg">
    //                 <h3 className="font-medium mb-4 text-lg">
    //                   Informations de publication
    //                 </h3>
    //                 <div className="space-y-4">
    //                   <div className="flex items-center">
    //                     <div className="w-40 text-sm">Date de publication</div>
    //                     <div className="flex-1">
    //                       <Input type="date" className="max-w-xs" />
    //                     </div>
    //                   </div>
    //                   <div className="flex items-center">
    //                     <div className="w-40 text-sm">Numéro de publication</div>
    //                     <div className="flex-1">
    //                       <Input
    //                         className="max-w-xs"
    //                         placeholder="N° de publication"
    //                       />
    //                     </div>
    //                   </div>
    //                   <div className="flex items-center">
    //                     <div className="w-40 text-sm">Coût</div>
    //                     <div className="flex-1">
    //                       <Input className="max-w-xs" placeholder="Montant en €" />
    //                     </div>
    //                   </div>
    //                 </div>
    //               </Card>
    //             </div>
    //           )}

    //           {/* Page 2: Documents */}
    //           {currentPage === 2 && (
    //             <div className="space-y-6">
    //               <Card className="p-6 border rounded-lg">
    //                 <h3 className="font-medium mb-4 text-lg">Débours payés</h3>
    //                 <div className="p-8 border-dashed border-2 border-gray-300 flex flex-col items-center justify-center text-gray-500 rounded-md">
    //                   <Upload className="h-8 w-8 mb-2" />
    //                   <p className="text-sm">Zone de drag & drop des fichiers</p>
    //                 </div>
    //               </Card>

    //               <Card className="p-6 border rounded-lg">
    //                 <h3 className="font-medium mb-4 text-lg">Annonce légale</h3>
    //                 <div className="p-8 border-dashed border-2 border-gray-300 flex flex-col items-center justify-center text-gray-500 rounded-md">
    //                   <Upload className="h-8 w-8 mb-2" />
    //                   <p className="text-sm">Zone de drag & drop des fichiers</p>
    //                 </div>
    //               </Card>

    //               <Card className="p-6 border rounded-lg">
    //                 <h3 className="font-medium mb-4 text-lg">Facture</h3>
    //                 <div className="p-8 border-dashed border-2 border-gray-300 flex flex-col items-center justify-center text-gray-500 rounded-md">
    //                   <Upload className="h-8 w-8 mb-2" />
    //                   <p className="text-sm">Zone de drag & drop des fichiers</p>
    //                 </div>
    //               </Card>
    //             </div>
    //           )}

    //           {/* Navigation buttons */}
    //           <div className="flex justify-between mt-6">
    //             <Button
    //               variant="outline"
    //               onClick={goToPreviousPage}
    //               disabled={currentPage === 0}
    //               className="flex items-center gap-1"
    //             >
    //               <ChevronLeft className="h-4 w-4" /> Précédent
    //             </Button>
    //             <Button
    //               variant="outline"
    //               onClick={goToNextPage}
    //               disabled={currentPage === sections.length - 1}
    //               className="flex items-center gap-1"
    //             >
    //               Suivant <ChevronRight className="h-4 w-4" />
    //             </Button>
    //           </div>
    //         </div>

    //         {/* Right column - Preview */}
    //         <div className="w-1/3">
    //           <Card className="border rounded-lg overflow-hidden h-full">
    //             <div className="p-4 border-b bg-gray-50">
    //               <h3 className="font-medium">Aperçu</h3>
    //             </div>
    //             <div className="p-4 h-[600px] overflow-auto">
    //               <div className="space-y-4">
    //                 <div className="text-sm">
    //                   <div className="font-medium mb-1">Journal:</div>
    //                   <div className="bg-gray-50 p-2 rounded border">
    //                     Journal Officiel
    //                   </div>
    //                 </div>

    //                 <div className="text-sm">
    //                   <div className="font-medium mb-1">Texte de l'annonce:</div>
    //                   <div className="bg-gray-50 p-2 rounded border whitespace-pre-line font-mono text-xs">
    //                     Par acte SSP du 15/12/2024 il a été constitué une SARL
    //                     dénommée: CHOCOLAT & CO Siège social: 25 rue des Lilas 75001
    //                     PARIS Capital: 10.000€ Objet: Fabrication et
    //                     commercialisation de denrées alimentaires périssables
    //                     Gérant: M. DUPONT Jean, 12 avenue Victor Hugo 75016 PARIS
    //                     Durée: 99 ans à compter de l'immatriculation au RCS de PARIS
    //                   </div>
    //                 </div>

    //                 <div className="text-sm">
    //                   <div className="font-medium mb-1">Documents:</div>
    //                   <div className="bg-gray-50 p-2 rounded border">
    //                     <div className="flex items-center justify-between text-xs mb-1">
    //                       <span>annonce-legale.pdf</span>
    //                       <span className="text-gray-500">125 KB</span>
    //                     </div>
    //                     <div className="flex items-center justify-between text-xs">
    //                       <span>facture-publication.pdf</span>
    //                       <span className="text-gray-500">78 KB</span>
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </Card>
    //         </div>
    //       </div>
    //     </div>
  );
}
