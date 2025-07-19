import type React from "react";
import { useState } from "react";
import { ImageIcon, FileText } from "lucide-react";
import PendingFeature from "../../PendingFeature";

interface MailsSectionProps {
  dossierId: string;
}

interface Email {
  id: string;
  expediteur?: string;
  destinataire?: string;
  email: string;
  date: string;
  pj: number;
  attachments: Attachment[];
  subject: string;
  content: string;
}

interface Attachment {
  name: string;
  type: string;
  size: string;
  dateAdded: string;
  preview?: string;
}

export default function MailsSection({ dossierId }: MailsSectionProps) {
  const [activeMailTab, setActiveMailTab] = useState("reception");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>("1");
  const [selectedAttachment, setSelectedAttachment] =
    useState<Attachment | null>(null);
  const [newAttachments, setNewAttachments] = useState<string[]>([
    "carte_vitale.png",
    "statuts_constitutifs.pdf",
  ]);

  // Emails reçus avec détails des pièces jointes
  const receivedEmails: Email[] = [
    {
      id: "1",
      expediteur: "Cabinet MAZARS",
      email: "helene.turelle@mazars.fr",
      date: "8h53",
      pj: 2,
      attachments: [
        {
          name: "carte_vitale.png",
          type: "image/png",
          size: "1.2 MB",
          dateAdded: "12/02/2023",
          preview: "/placeholder.svg?height=300&width=400",
        },
        {
          name: "statuts_constitutifs.pdf",
          type: "application/pdf",
          size: "3.5 MB",
          dateAdded: "12/02/2023",
        },
      ],
      subject: "Création entreprise Chocolat & Co",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu
      sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
      
      Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse
      dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit
      odio.`,
    },
    {
      id: "2",
      expediteur: "Cabinet CAPIRO",
      email: "j.moreau@capiro.fr",
      date: "12h45",
      pj: 1,
      attachments: [
        {
          name: "statuts_constitutifs.pdf",
          type: "application/pdf",
          size: "2.8 MB",
          dateAdded: "15/02/2023",
        },
      ],
      subject: "Suivi dossier Chocolat & Co",
      content: `Bonjour,

      Je vous contacte concernant le suivi du dossier de création pour Chocolat & Co.
      Pourriez-vous me confirmer la réception des documents envoyés la semaine dernière ?
      
      Cordialement,
      J. Moreau`,
    },
  ];

  // Emails envoyés
  const sentEmails: Email[] = [
    {
      id: "3",
      destinataire: "helene.turelle@mazars.fr",
      email: "helene.turelle@mazars.fr",
      date: "mar 12 fev 8h53",
      pj: 2,
      attachments: [
        {
          name: "carte_vitale.png",
          type: "image/png",
          size: "1.2 MB",
          dateAdded: "12/02/2023",
          preview: "/placeholder.svg?height=300&width=400",
        },
        {
          name: "statuts_constitutifs.pdf",
          type: "application/pdf",
          size: "3.5 MB",
          dateAdded: "12/02/2023",
        },
      ],
      subject: "Création entreprise Chocolat & Co",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu
      sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
      
      Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse
      dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit
      odio.`,
    },
  ];

  // Fonction pour gérer la sélection d'un email
  const handleEmailSelect = (emailId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedEmailId(emailId);
    setSelectedAttachment(null); // Reset selected attachment when changing email
  };

  // Trouver l'email sélectionné
  const selectedEmail = [...receivedEmails, ...sentEmails].find(
    (email) => email.id === selectedEmailId
  );

  // Fonction pour supprimer une pièce jointe
  const removeAttachment = (attachment: string) => {
    setNewAttachments(newAttachments.filter((a) => a !== attachment));
  };

  // Fonction pour ajouter une pièce jointe (simulation)
  const addAttachment = () => {
    // Dans une application réelle, cela ouvrirait un sélecteur de fichier
    alert(
      "Cette fonctionnalité ouvrirait un sélecteur de fichier dans une application réelle."
    );
  };

  // Fonction pour afficher les détails d'une pièce jointe
  const handleAttachmentClick = (attachment: Attachment) => {
    setSelectedAttachment(attachment);
  };

  // Fonction pour fermer la boîte de dialogue des détails de pièce jointe
  const closeAttachmentDetails = () => {
    setSelectedAttachment(null);
  };

  // Fonction pour obtenir l'icône appropriée pour le type de fichier
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />;
    } else if (type.includes("pdf")) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else {
      return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <PendingFeature />
    // <div className="space-y-4">
    //   <Tabs
    //     value={activeMailTab}
    //     onValueChange={setActiveMailTab}
    //     className="w-full"
    //   >
    //     <TabsList className="flex h-auto bg-transparent p-0 w-full justify-start border-b mb-4">
    //       <TabsTrigger
    //         value="reception"
    //         className="flex items-center gap-1.5 px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:text-formality-primary data-[state=active]:bg-transparent bg-white text-gray-600 font-medium"
    //       >
    //         Réception
    //       </TabsTrigger>
    //       <TabsTrigger
    //         value="expedition"
    //         className="flex items-center gap-1.5 px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:text-formality-primary data-[state=active]:bg-transparent bg-white text-gray-600 font-medium"
    //       >
    //         Expédition
    //       </TabsTrigger>
    //       <TabsTrigger
    //         value="creation"
    //         className="flex items-center gap-1.5 px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:text-formality-primary data-[state=active]:bg-transparent bg-white text-gray-600 font-medium"
    //       >
    //         Création
    //       </TabsTrigger>
    //     </TabsList>

    //     {/* Onglet Réception */}
    //     <TabsContent value="reception">
    //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //         <div className="md:col-span-1 border rounded-lg overflow-hidden">
    //           <Table>
    //             <TableHeader>
    //               <TableRow className="bg-gray-100">
    //                 <TableHead className="font-medium">Expéditeur</TableHead>
    //                 <TableHead className="font-medium">Date</TableHead>
    //                 <TableHead className="font-medium text-center">
    //                   PJ
    //                 </TableHead>
    //               </TableRow>
    //             </TableHeader>
    //             <TableBody>
    //               {receivedEmails.map((email) => (
    //                 <TableRow
    //                   key={email.id}
    //                   className={`hover:bg-gray-50 cursor-pointer ${
    //                     selectedEmailId === email.id ? "bg-blue-50" : "bg-white"
    //                   }`}
    //                   onClick={(e) => handleEmailSelect(email.id, e)}
    //                 >
    //                   <TableCell className="align-top">
    //                     <div className="font-medium">{email.expediteur}</div>
    //                     <div className="text-sm text-gray-700">
    //                       {email.email}
    //                     </div>
    //                   </TableCell>
    //                   <TableCell className="align-top">
    //                     {formatDate(email.date)}
    //                   </TableCell>
    //                   <TableCell className="text-center align-top">
    //                     {email.pj > 0 && (
    //                       <div className="flex items-center justify-center">
    //                         <Paperclip className="h-4 w-4" />
    //                         <span className="ml-1">{email.pj}</span>
    //                       </div>
    //                     )}
    //                   </TableCell>
    //                 </TableRow>
    //               ))}
    //             </TableBody>
    //           </Table>
    //         </div>

    //         <div className="md:col-span-2 border rounded-lg">
    //           {selectedEmail && (
    //             <>
    //               <div className="border-b p-4">
    //                 <div>
    //                   <div className="text-sm text-gray-500 mb-1">
    //                     Pièces jointes
    //                   </div>
    //                   <div className="flex flex-wrap gap-2">
    //                     {selectedEmail.attachments.map((attachment, index) => (
    //                       <Badge
    //                         key={index}
    //                         variant="outline"
    //                         className="bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center gap-1"
    //                         onClick={() => handleAttachmentClick(attachment)}
    //                       >
    //                         {getFileIcon(attachment.type)}
    //                         <span>{attachment.name}</span>
    //                       </Badge>
    //                     ))}
    //                   </div>
    //                 </div>
    //               </div>

    //               <div className="p-4">
    //                 <h3 className="text-xl font-medium mb-6">
    //                   {selectedEmail.subject}
    //                 </h3>
    //                 <div className="text-sm text-gray-600 whitespace-pre-line">
    //                   {selectedEmail.content}
    //                 </div>
    //               </div>
    //             </>
    //           )}
    //         </div>
    //       </div>
    //     </TabsContent>

    //     {/* Onglet Expédition */}
    //     <TabsContent value="expedition">
    //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //         <div className="md:col-span-1 border rounded-lg overflow-hidden">
    //           <Table>
    //             <TableHeader>
    //               <TableRow className="bg-gray-100">
    //                 <TableHead className="font-medium">Destinataire</TableHead>
    //                 <TableHead className="font-medium">Date</TableHead>
    //                 <TableHead className="font-medium text-center">
    //                   PJ
    //                 </TableHead>
    //               </TableRow>
    //             </TableHeader>
    //             <TableBody>
    //               {sentEmails.map((email) => (
    //                 <TableRow
    //                   key={email.id}
    //                   className={`hover:bg-gray-50 cursor-pointer ${
    //                     selectedEmailId === email.id ? "bg-blue-50" : "bg-white"
    //                   }`}
    //                   onClick={(e) => handleEmailSelect(email.id, e)}
    //                 >
    //                   <TableCell className="align-top">
    //                     <div className="text-sm text-gray-700">
    //                       {email.email}
    //                     </div>
    //                   </TableCell>
    //                   <TableCell className="align-top">
    //                     {formatDate(email.date)}
    //                   </TableCell>
    //                   <TableCell className="text-center align-top">
    //                     {email.pj > 0 && (
    //                       <div className="flex items-center justify-center">
    //                         <Paperclip className="h-4 w-4" />
    //                         <span className="ml-1">{email.pj}</span>
    //                       </div>
    //                     )}
    //                   </TableCell>
    //                 </TableRow>
    //               ))}
    //             </TableBody>
    //           </Table>
    //         </div>

    //         <div className="md:col-span-2 border rounded-lg">
    //           {selectedEmail && (
    //             <>
    //               <div className="border-b p-4">
    //                 <div>
    //                   <div className="text-sm text-gray-500 mb-1">
    //                     Pièces jointes
    //                   </div>
    //                   <div className="flex flex-wrap gap-2">
    //                     {selectedEmail.attachments.map((attachment, index) => (
    //                       <Badge
    //                         key={index}
    //                         variant="outline"
    //                         className="bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center gap-1"
    //                         onClick={() => handleAttachmentClick(attachment)}
    //                       >
    //                         {getFileIcon(attachment.type)}
    //                         <span>{attachment.name}</span>
    //                       </Badge>
    //                     ))}
    //                   </div>
    //                 </div>
    //               </div>

    //               <div className="p-4">
    //                 <h3 className="text-xl font-medium mb-6">
    //                   {selectedEmail.subject}
    //                 </h3>
    //                 <div className="text-sm text-gray-600 whitespace-pre-line">
    //                   {selectedEmail.content}
    //                 </div>
    //               </div>
    //             </>
    //           )}
    //         </div>
    //       </div>
    //     </TabsContent>

    //     {/* Onglet Création */}
    //     <TabsContent value="creation">
    //       <div className="space-y-4">
    //         <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
    //           <div className="text-sm">Destinataire</div>
    //           <div className="flex gap-2 items-center">
    //             <Input
    //               className="flex-1"
    //               placeholder="Adresse email du destinataire"
    //             />
    //             <Select>
    //               <SelectTrigger className="w-[180px]">
    //                 <SelectValue placeholder="ComboBox" />
    //               </SelectTrigger>
    //               <SelectContent>
    //                 <SelectItem value="contact1">
    //                   helene.turelle@mazars.fr
    //                 </SelectItem>
    //                 <SelectItem value="contact2">j.moreau@capiro.fr</SelectItem>
    //               </SelectContent>
    //             </Select>
    //           </div>
    //         </div>

    //         <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
    //           <div className="text-sm">CC</div>
    //           <div className="flex gap-2 items-center">
    //             <Input className="flex-1" placeholder="Copie à..." />
    //             <Select>
    //               <SelectTrigger className="w-[180px]">
    //                 <SelectValue placeholder="ComboBox" />
    //               </SelectTrigger>
    //               <SelectContent>
    //                 <SelectItem value="contact1">
    //                   helene.turelle@mazars.fr
    //                 </SelectItem>
    //                 <SelectItem value="contact2">j.moreau@capiro.fr</SelectItem>
    //               </SelectContent>
    //             </Select>
    //           </div>
    //         </div>

    //         <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
    //           <div className="text-sm">CCI</div>
    //           <div className="flex gap-2 items-center">
    //             <Input className="flex-1" placeholder="Copie cachée à..." />
    //             <Select>
    //               <SelectTrigger className="w-[180px]">
    //                 <SelectValue placeholder="ComboBox" />
    //               </SelectTrigger>
    //               <SelectContent>
    //                 <SelectItem value="contact1">
    //                   helene.turelle@mazars.fr
    //                 </SelectItem>
    //                 <SelectItem value="contact2">j.moreau@capiro.fr</SelectItem>
    //               </SelectContent>
    //             </Select>
    //           </div>
    //         </div>

    //         <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
    //           <div className="text-sm">Pièces jointes</div>
    //           <div className="space-y-2">
    //             <div className="flex items-center gap-2">
    //               <Input
    //                 className="flex-1"
    //                 value={newAttachments.join(", ")}
    //                 readOnly
    //                 placeholder="Aucune pièce jointe"
    //               />
    //               <Button variant="outline" onClick={addAttachment}>
    //                 Ajouter
    //               </Button>
    //             </div>
    //             {newAttachments.length > 0 && (
    //               <div className="flex flex-wrap gap-2">
    //                 {newAttachments.map((attachment, index) => (
    //                   <Badge
    //                     key={index}
    //                     variant="outline"
    //                     className="bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
    //                   >
    //                     {attachment}
    //                     <button
    //                       onClick={() => removeAttachment(attachment)}
    //                       className="ml-1 h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center"
    //                     >
    //                       <X className="h-3 w-3" />
    //                     </button>
    //                   </Badge>
    //                 ))}
    //               </div>
    //             )}
    //           </div>
    //         </div>

    //         <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
    //           <div className="text-sm">Titre du mail</div>
    //           <Input placeholder="Sujet de l'email" />
    //         </div>

    //         <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
    //           <div className="text-sm">Corps du mail</div>
    //           <Textarea
    //             className="min-h-[300px]"
    //             placeholder="Contenu de l'email..."
    //           />
    //         </div>

    //         <div className="flex justify-end">
    //           <Button className="bg-green-600 hover:bg-green-700">
    //             Envoyer
    //           </Button>
    //         </div>
    //       </div>
    //     </TabsContent>
    //   </Tabs>

    //   {/* Boîte de dialogue pour afficher les détails de la pièce jointe */}
    //   <Dialog
    //     open={!!selectedAttachment}
    //     onOpenChange={() => closeAttachmentDetails()}
    //   >
    //     <DialogContent className="sm:max-w-[600px]">
    //       <DialogHeader>
    //         <DialogTitle>Détails de la pièce jointe</DialogTitle>
    //       </DialogHeader>
    //       {selectedAttachment && (
    //         <div className="space-y-4">
    //           <Card>
    //             <CardHeader>
    //               <CardTitle className="flex items-center gap-2">
    //                 {getFileIcon(selectedAttachment.type)}
    //                 {selectedAttachment.name}
    //               </CardTitle>
    //             </CardHeader>
    //             <CardContent>
    //               <div className="grid grid-cols-2 gap-4">
    //                 <div>
    //                   <p className="text-sm font-medium text-gray-500">
    //                     Type de fichier
    //                   </p>
    //                   <p>{selectedAttachment.type}</p>
    //                 </div>
    //                 <div>
    //                   <p className="text-sm font-medium text-gray-500">
    //                     Taille
    //                   </p>
    //                   <p>{selectedAttachment.size}</p>
    //                 </div>
    //                 <div>
    //                   <p className="text-sm font-medium text-gray-500">
    //                     Date d'ajout
    //                   </p>
    //                   <p>{selectedAttachment.dateAdded}</p>
    //                 </div>
    //               </div>
    //             </CardContent>
    //           </Card>

    //           {selectedAttachment.preview &&
    //             selectedAttachment.type.startsWith("image/") && (
    //               <div className="mt-4">
    //                 <p className="text-sm font-medium text-gray-500 mb-2">
    //                   Aperçu
    //                 </p>
    //                 <div className="border rounded-lg overflow-hidden">
    //                   <img
    //                     src={selectedAttachment.preview || "/placeholder.svg"}
    //                     alt={selectedAttachment.name}
    //                     className="w-full object-contain max-h-[300px]"
    //                   />
    //                 </div>
    //               </div>
    //             )}

    //           <div className="flex justify-end gap-2 mt-4">
    //             <Button variant="outline" onClick={closeAttachmentDetails}>
    //               Fermer
    //             </Button>
    //             <Button>Télécharger</Button>
    //           </div>
    //         </div>
    //       )}
    //     </DialogContent>
    //   </Dialog>
    // </div>
  );
}
