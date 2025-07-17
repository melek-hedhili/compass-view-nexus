import PendingFeature from "../../PendingFeature";

interface ControleSectionProps {
  dossierId?: string;
}

export default function ControleSection({ dossierId }: ControleSectionProps) {
  return (
    <PendingFeature />
    // <Card className="p-6">
    //   <h2 className="text-lg font-medium mb-4">Contrôle du dossier</h2>
    //   <p className="text-gray-500">Interface de contrôle à venir...</p>
    // </Card>
  );
}
