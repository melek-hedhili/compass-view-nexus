import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DataDto } from "@/api-swagger/models/DataDto";
import { DataService } from "@/api-swagger/services/DataService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Archive, Edit, PlusCircle, Redo, Trash } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Quotes = () => {
  const [quotes, setQuotes] = useState<DataDto[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editQuote, setEditQuote] = useState<DataDto | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: quotesData, refetch } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      return await DataService.dataControllerFindAll({
        dataType: "QUOTE",
      });
    },
  });

  useEffect(() => {
    if (quotesData) {
      setQuotes(quotesData);
    }
  }, [quotesData]);

  const createQuoteMutation = useMutation(DataService.dataControllerCreate, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      setOpen(false);
      toast({
        title: "Succès",
        description: "Devis créé avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du devis",
        variant: "destructive",
      });
    },
  });

  const updateQuoteMutation = useMutation(DataService.dataControllerUpdate, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      setOpen(false);
      setEditQuote(null);
      toast({
        title: "Succès",
        description: "Devis mis à jour avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du devis",
        variant: "destructive",
      });
    },
  });

  const deleteQuoteMutation = useMutation(DataService.dataControllerDelete, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast({
        title: "Succès",
        description: "Devis supprimé avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du devis",
        variant: "destructive",
      });
    },
  });

  const filteredQuotes = quotes?.filter((quote) => {
    const dataName = quote.dataName || "";
    const dataValue = quote.dataValue || "";
    return (
      dataName.toLowerCase().includes(search.toLowerCase()) ||
      dataValue.toLowerCase().includes(search.toLowerCase())
    );
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Date invalide";
      }
      return format(date, "dd MMMM yyyy", {
        locale: fr,
      });
    } catch (error) {
      return "Date invalide";
    }
  };

  const handleArchive = async (quote: DataDto) => {
    try {
      await updateQuoteMutation.mutateAsync({
        id: quote.id!,
        requestBody: {
          dataName: quote.dataName,
          dataValue: quote.dataValue,
        },
      });
      toast({
        title: "Succès",
        description: "Devis archivé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'archivage du devis",
        variant: "destructive",
      });
    }
  };

  const handleRestore = async (quote: DataDto) => {
    try {
      await updateQuoteMutation.mutateAsync({
        id: quote.id!,
        requestBody: {
          dataName: quote.dataName,
          dataValue: quote.dataValue,
        },
      });
      toast({
        title: "Succès",
        description: "Devis restauré avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la restauration du devis",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center">
          <Input
            placeholder="Rechercher un devis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un devis
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter un devis</DialogTitle>
                <DialogDescription>
                  Ajouter un nouveau devis à la liste.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom
                  </Label>
                  <Input
                    id="name"
                    defaultValue=""
                    className="col-span-3"
                    onChange={(e) =>
                      setEditQuote({ ...editQuote, dataName: e.target.value } as DataDto)
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Valeur
                  </Label>
                  <Input
                    id="value"
                    defaultValue=""
                    className="col-span-3"
                    onChange={(e) =>
                      setEditQuote({ ...editQuote, dataValue: e.target.value } as DataDto)
                    }
                  />
                </div>
              </div>
              <Button onClick={() => createQuoteMutation.mutate({
                  dataType: "QUOTE",
                  dataName: editQuote?.dataName || "",
                  dataValue: editQuote?.dataValue || "",
                })}>Créer</Button>
            </DialogContent>
          </Dialog>
          <Button onClick={() => refetch()}>Rafraîchir</Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableCaption>Liste des devis</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Nom</TableHead>
              <TableHead>Valeur</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes?.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="font-medium">{quote.dataName}</TableCell>
                <TableCell>{quote.dataValue}</TableCell>
                <TableCell>{formatDate(quote.createdAt!)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-4">
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost">
                          <Edit className="mr-2 h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Modifier un devis</DialogTitle>
                          <DialogDescription>
                            Modifier un devis de la liste.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Nom
                            </Label>
                            <Input
                              id="name"
                              defaultValue={quote.dataName}
                              className="col-span-3"
                              onChange={(e) =>
                                setEditQuote({ ...quote, dataName: e.target.value })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="value" className="text-right">
                              Valeur
                            </Label>
                            <Input
                              id="value"
                              defaultValue={quote.dataValue}
                              className="col-span-3"
                              onChange={(e) =>
                                setEditQuote({ ...quote, dataValue: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <Button onClick={() => updateQuoteMutation.mutate({
                            id: quote.id!,
                            requestBody: {
                              dataName: editQuote?.dataName || "",
                              dataValue: editQuote?.dataValue || "",
                            },
                          })}>Modifier</Button>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost">
                          <Trash className="mr-2 h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr(e) ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteQuoteMutation.mutate(quote.id!)}>
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button variant="ghost" onClick={() => handleArchive(quote)}>
                      <Archive className="mr-2 h-4 w-4" />
                    </Button>
                    <Button variant="ghost" onClick={() => handleRestore(quote)}>
                      <Redo className="mr-2 h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                Total: {filteredQuotes?.length} devis
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default Quotes;
