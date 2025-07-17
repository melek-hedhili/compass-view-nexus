import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Date invalide";
    }
    return format(date, "dd MMMM yyyy HH:mm", {
      locale: fr,
    });
  } catch {
    return "Date invalide";
  }
};
