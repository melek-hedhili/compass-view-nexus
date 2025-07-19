import { Check } from "lucide-react";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";

export function BeneficiariesList() {
  return (
    <div>
      <h3 className="font-medium mb-4">Liste des bénéficiaires effectifs</h3>
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-40 text-sm">Nombre d'associés</div>
          <div className="flex-1 flex items-center gap-2">
            <ControlledInput
              name="numberOfBeneficiaries"
              defaultValue="2"
              className="max-w-[60px]"
            />
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
              <Check className="h-3 w-3" />
            </div>
            <a href="#" className="text-blue-600 hover:underline text-sm">
              LBE
            </a>
          </div>
        </div>
        {/* Associé N°1 */}
        <div className="ml-4">
          <h4 className="font-medium mb-2">Associé N°1</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-36 text-sm">Prénom</div>
              <div className="flex-1 flex items-center gap-2">
                <ControlledInput
                  name="firstName"
                  defaultValue="John"
                  className="max-w-xs"
                />
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
                  <div className="h-3 w-3 rounded-full bg-gray-400" />
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  LBE
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-36 text-sm">Nom</div>
              <div className="flex-1 flex items-center gap-2">
                <ControlledInput
                  name="lastName"
                  defaultValue="Doe"
                  className="max-w-xs"
                />
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
                  <div className="h-3 w-3 rounded-full bg-gray-400" />
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  LBE
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Associé N°2 */}
        <div className="ml-4">
          <h4 className="font-medium mb-2">Associé N°2</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-36 text-sm">Prénom</div>
              <div className="flex-1 flex items-center gap-2">
                <ControlledInput
                  name="firstName"
                  defaultValue="John"
                  className="max-w-xs"
                />
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
                  <div className="h-3 w-3 rounded-full bg-gray-400" />
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  LBE
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-36 text-sm">Nom</div>
              <div className="flex-1 flex items-center gap-2">
                <ControlledInput
                  name="lastName"
                  defaultValue="Doe"
                  className="max-w-xs"
                />
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
                  <div className="h-3 w-3 rounded-full bg-gray-400" />
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
  );
}
