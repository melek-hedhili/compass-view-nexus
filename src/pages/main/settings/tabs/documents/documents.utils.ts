const legalFormOptions: { label: string; value: string }[] = [
  { label: "SCI", value: "SCI" },
  { label: "SARL", value: "SARL" },
  { label: "EURL", value: "EURL" },

  { label: "SASU / SAS", value: "SAS" },
];
const benefitOptions: { label: string; value: string }[] = [
  { label: "Création", value: "CREATION" },
  { label: "Modification", value: "UPDATE" },
  { label: "Cessation", value: "CESSATION" },
];
const typeOptions: { label: string; value: string }[] = [
  { label: "Document interne", value: "INTERNAL" },
  {
    label: "Document à fournir au greffe",
    value: "GREFFE",
  },
  { label: "Facture", value: "INVOICE" },
  {
    label: "Document d'annonce légal",
    value: "LEGAL_ANNOUNCEMENT",
  },
  {
    label: "Document de validation du dossier",
    value: "VALIDATION",
  },
];
export { legalFormOptions, benefitOptions, typeOptions };
