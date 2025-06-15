
import { useEffect } from "react";
import { useSocket } from "./use-socket";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const useEmailNotifications = () => {
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log("connected to socket");
    };

    const handleDisconnect = () => {
      console.log("disconnected from socket");
    };

    const handleNewEmail = (emailData: any) => {
      console.log("New email received:", emailData);
      
      // Invalidate all email queries
      queryClient.invalidateQueries({ queryKey: ["emails"] });

      const isOnMailRoute = location.pathname.includes("/dashboard/mail");

      if (isOnMailRoute) {
        // User is already on mail route - simple notification
        toast.success("Nouveau email reçu", {
          description: "La boîte mail a été mise à jour",
        });
      } else {
        // User is not on mail route - notification with link
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
          duration: 5000, // Keep it longer so user can click
        });
      }
    };

    // Listen for socket events
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("newEmail", handleNewEmail);

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("newEmail", handleNewEmail);
    };
  }, [socket, location.pathname, navigate, queryClient]);

  return socket;
};
