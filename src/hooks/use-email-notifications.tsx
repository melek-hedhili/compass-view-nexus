
import { useEffect } from "react";
import { useSocketContext } from "@/context/SocketContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface UseEmailNotificationsOptions {
  isAuthenticated: boolean;
}

export const useEmailNotifications = ({ isAuthenticated }: UseEmailNotificationsOptions) => {
  const socket = useSocketContext();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !socket) return;

    const handleConnect = () => {
      console.log("connected to socket");
    };

    const handleDisconnect = () => {
      console.log("disconnected from socket");
    };

    const handleNewEmail = (emailData: any) => {
      console.log("New email received:", emailData);
      queryClient.invalidateQueries({ queryKey: ["emails"] });

      const isOnMailRoute = location.pathname.includes("/dashboard/mail");

      if (isOnMailRoute) {
        toast.success("Nouveau email reçu", {
          description: "La boîte mail a été mise à jour",
        });
      } else {
        toast.success("Nouveau email reçu", {
          description: "Un nouveau message est arrivé dans votre boîte mail",
          action: (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/dashboard/mail")}
              className="ml-2"
            >
              Voir
            </Button>
          ),
          duration: 5000,
        });
      }
    };

    // Attach listeners once
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("newEmail", handleNewEmail);

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("newEmail", handleNewEmail);
    };
  }, [isAuthenticated, socket, location.pathname, navigate, queryClient]);

  return socket;
};
