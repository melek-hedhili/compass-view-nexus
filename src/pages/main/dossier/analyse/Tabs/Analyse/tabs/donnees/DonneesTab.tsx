import { BeneficiariesList } from "./components/BeneficiariesList";
import { DocumentViewer } from "./components/DocumentViewer";
import { DocumentDataService } from "@/api-swagger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import StatutSection from "./components/StatutSection";

type Associe = {
  prenom: string;
  nom: string;
  prenom2: string;
  nom2: string;
};
type FormValues = {
  statut_controle: string;
  statut: {
    nomEntreprise: string;
    formeJuridique: string;
    filiale: boolean;
    agricole: boolean;
    pricipaleActivite: string;
    duree: number;
  };
  liste_beneficiaires: {
    nombre_associes: number;
    associes: Associe[];
  };
};
const DonneesTab = () => {
  const { dossierId } = useParams();
  const queryClient = useQueryClient();
  const methods = useForm<FormValues>({
    defaultValues: {
      statut_controle: "",
      statut: {
        nomEntreprise: "",
        formeJuridique: "",
        filiale: false,
        agricole: false,
        pricipaleActivite: "",
        duree: 0,
      },
      liste_beneficiaires: {
        nombre_associes: 0,
        associes: [],
      },
    },
  });
  const {
    data: analyse,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["analyse", dossierId],
    queryFn: () =>
      DocumentDataService.documentDataControllerFindAll({
        id: dossierId,
      }),
  });
  useEffect(() => {
    if (isSuccess) {
      methods.reset({});
    }
  }, [analyse, isSuccess]);
  const createDocumentDataFile = useMutation({
    mutationFn: () =>
      DocumentDataService.documentDataControllerFillDocumentData({
        id: dossierId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyse", dossierId] });
    },
  });

  const unvalidAnalyse = analyse?.length === 0 || analyse === null;

  if (isLoading) {
    return (
      <div className="flex gap-6 flex-col md:flex-row animate-pulse">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-10 w-[180px] rounded" />
          </div>
          <div className="mb-6 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="h-10 w-48 rounded flex-1" />
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-10 w-16 rounded" />
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
            {[1, 2].map((n) => (
              <div key={n} className="ml-4 space-y-2">
                <Skeleton className="h-5 w-36 rounded" />
                <Skeleton className="h-10 w-48 rounded" />
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-5 w-36 rounded" />
                <Skeleton className="h-10 w-48 rounded" />
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-10 w-[220px] rounded" />
          </div>
          <Skeleton className="h-[600px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <Form methods={methods}>
      <div className="flex gap-6 flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          {unvalidAnalyse ? (
            <Button
              type="button"
              className="px-6 py-3 rounded bg-primary text-white font-semibold shadow hover:bg-primary/90 transition"
              onClick={() => createDocumentDataFile.mutateAsync()}
              loading={createDocumentDataFile.isPending}
            >
              {createDocumentDataFile.isPending ? "Lancement..." : "Lancer IA"}
            </Button>
          ) : (
            <>
              {analyse.map((item, idx) => (
                <div key={idx}>
                  <h2 className="text-lg font-bold mb-4">
                    {item.document?.documentName}
                  </h2>
                  {/* <ControlStatusSelector /> */}
                  <StatutSection
                    shortName={item.document.shortName}
                    documentData={item.documentData}
                  />
                  <BeneficiariesList />
                </div>
              ))}
            </>
          )}
        </div>
        <div className="w-full md:w-1/2">
          <DocumentViewer />
        </div>
      </div>
    </Form>
  );
};

export default DonneesTab;
