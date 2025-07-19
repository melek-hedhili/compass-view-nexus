import { Check } from "lucide-react";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select/controlled-select";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { ControlledRadioGroup } from "@/components/ui/controlled/controlled-radio-group/controlled-radio-group";
import { DocumentDataResponseDto } from "@/api-swagger";
import { FC } from "react";
interface StatutSectionProps {
  shortName: string;
  documentData: DocumentDataResponseDto[];
}
const StatutSection: FC<StatutSectionProps> = ({ shortName, documentData }) => {
  console.log("shrtn");
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-4">Statut</h3>
      <div className="space-y-4">
        {/* Nom de l'entreprise */}

        {/* Forme juridique */}
        {documentData.map((item, idx) => (
          <>
            <div className="flex items-center">
              <div className="w-40 text-sm">Nom de l'entreprise</div>
              <div className="flex-1 flex items-center gap-2">
                <ControlledInput
                  name="companyName"
                  defaultValue={item.dataTemplate.fieldName}
                  className="max-w-xs"
                />
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
                  <Check className="h-3 w-3" />
                </div>
                <a className="text-blue-600 hover:underline text-sm">
                  {shortName}
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-40 text-sm">Forme juridique</div>
              <div className="flex-1 flex items-center gap-2">
                <ControlledSelect
                  name="legalForm"
                  data={item.dataTemplate.legalForm}
                  getOptionValue={(option) => option}
                  getOptionLabel={(option) => option}
                />

                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
                  <Check className="h-3 w-3" />
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Statut
                </a>
              </div>
            </div>
            {/* Filiale ou sous filiale d'une entreprise agricole */}
            <div className="flex items-center">
              <div className="w-40 text-sm">
                Filiale ou une sous filiale d'une entreprise agricole
              </div>
              <div className="flex-1 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ControlledRadioGroup
                    direction="row"
                    name="filiale"
                    options={[
                      {
                        label: "Non",
                        value: "non",
                      },
                      {
                        label: "Oui",
                        value: "oui",
                      },
                    ]}
                  />
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                  <Check className="h-3 w-3" />
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Statut
                </a>
              </div>
            </div>
            {/* Entreprise agricole */}
            <div className="flex items-center">
              <div className="w-40 text-sm">Entreprise agricole</div>
              <div className="flex-1 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ControlledRadioGroup
                    direction="row"
                    name="agricole"
                    options={[
                      {
                        label: "Non",
                        value: "non",
                      },
                      {
                        label: "Oui",
                        value: "oui",
                      },
                    ]}
                  />
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
                  <Check className="h-3 w-3" />
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Statut
                </a>
              </div>
            </div>
            {/* Principale activité */}
            <div className="flex items-center">
              <div className="w-40 text-sm">Principale activité</div>
              <div className="flex-1 flex items-center gap-2">
                <ControlledInput
                  name="mainActivity"
                  defaultValue="Fabrication et commercialisation de denrées alimentaires périssables"
                  className="max-w-xs"
                />
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
                  <div className="h-3 w-3 rounded-full bg-gray-400" />
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Statut
                </a>
              </div>
            </div>
            {/* Durée */}
            <div className="flex items-center">
              <div className="w-40 text-sm">Durée</div>
              <div className="flex-1 flex items-center gap-2">
                <ControlledInput name="duration" className="max-w-xs" />
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
                  <Check className="h-3 w-3" />
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Statut
                </a>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};
export default StatutSection;
