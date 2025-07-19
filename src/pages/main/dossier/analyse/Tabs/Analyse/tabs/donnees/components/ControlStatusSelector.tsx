import { ControlledSelect } from "@/components/ui/controlled/controlled-select/controlled-select";

export function ControlStatusSelector() {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-sm font-medium">Statut du contrôle</span>
      <ControlledSelect
        name="controlStatus"
        data={["etude", "en-cours", "termine"]}
        getOptionValue={(option) => option}
        getOptionLabel={(option) => option}
      />
    </div>
  );
}
