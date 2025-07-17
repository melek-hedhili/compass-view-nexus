import { useCallback, useEffect } from "react";
import { useSocketContext } from "@/context/SocketContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface UseEmailNotificationsOptions {
  isAuthenticated: boolean;
}

export const useEmailNotifications = ({
  isAuthenticated,
}: UseEmailNotificationsOptions) => {
  const socket = useSocketContext();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleNewEmail = useCallback(
    async (emailData: any) => {
      console.log("New email received:", emailData);

      const isOnMailRoute = location.pathname.includes("/dashboard/mail");

      if (isOnMailRoute) {
        toast.success("Nouveau email reçu", {
          description: "La boîte mail a été mise à jour",
        });
      } else {
        // Get toast ID so we can dismiss it later
        const toastId = toast.success("Nouveau email reçu", {
          description: "Un nouveau message est arrivé dans votre boîte mail",
          action: (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigate("/dashboard/mail");
                toast.dismiss(toastId);
              }}
              className="ml-2"
            >
              Voir
            </Button>
          ),
          duration: 5000,
        });
      }
      //data base doesnt sync immediately so we need to wait for 1 second
      setTimeout(async () => {
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["emails", "counts"],
          }),
          queryClient.invalidateQueries({
            queryKey: ["emails", "inbox"],
          }),
          queryClient.invalidateQueries({
            queryKey: ["emails", "dossier"],
          }),
        ]);
      }, 1000);
    },
    [queryClient, location.pathname, navigate]
  );

  useEffect(() => {
    if (!isAuthenticated || !socket) return;

    socket.on("newEmail", handleNewEmail);

    return () => {
      socket.off("newEmail", handleNewEmail);
    };
  }, [
    isAuthenticated,
    socket,
    location.pathname,
    navigate,
    queryClient,
    handleNewEmail,
  ]);

  return socket;
};
