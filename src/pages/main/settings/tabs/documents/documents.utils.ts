import { CreateDocumentDto } from "@/api-swagger/models/CreateDocumentDto";

const legalFormOptions = [
  { label: "SCI", value: CreateDocumentDto.legalForm.SCI },
  { label: "SARL", value: CreateDocumentDto.legalForm.SARL },
  { label: "EURL", value: CreateDocumentDto.legalForm.EURL },

  { label: "SASU / SAS", value: CreateDocumentDto.legalForm.SAS },
];
const benefitOptions = [
  { label: "Création", value: CreateDocumentDto.benefit.CREATION },
  { label: "Modification", value: CreateDocumentDto.benefit.UPDATE },
  { label: "Cessation", value: CreateDocumentDto.benefit.CESSATION },
];
const typeOptions = [
  { label: "Document interne", value: CreateDocumentDto.type.INTERNAL },
  {
    label: "Document à fournir au greffe",
    value: CreateDocumentDto.type.GREFFE,
  },
  { label: "Facture", value: CreateDocumentDto.type.INVOICE },
  {
    label: "Document d'annonce légal",
    value: CreateDocumentDto.type.LEGAL_ANNOUNCEMENT,
  },
  {
    label: "Document de validation du dossier",
    value: CreateDocumentDto.type.VALIDATION,
  },
];
export { legalFormOptions, benefitOptions, typeOptions };
