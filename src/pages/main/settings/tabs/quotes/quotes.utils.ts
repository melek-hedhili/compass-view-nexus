import { CreateDataDto } from "@/api-swagger";

const responseTypeOptions = [
  { label: "Texte libre", value: CreateDataDto.type.STRING },
  { label: "Date", value: CreateDataDto.type.DATE },
  { label: "Nombre", value: CreateDataDto.type.NUMBER },
  {
    label: "Choix unique",
    value: CreateDataDto.type.SINGLE_CHOICE,
  },
  {
    label: "Choix multiple",
    value: CreateDataDto.type.MULTIPLE_CHOICE,
  },
];

export { responseTypeOptions };
