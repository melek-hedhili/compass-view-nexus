import { useEffect, useRef } from "react";
import { URL_API } from "@/utils/constants";
import type { ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import { io, Socket as IOSocket } from "socket.io-client";

export const useSocket = (
  options?: Partial<ManagerOptions & SocketOptions>
): IOSocket | null => {
  const socketRef = useRef<IOSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      // Clean up if no token is found
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.close();
        socketRef.current = null;
      }
      console.error("No token found while using socket");
      return;
    }

    // Close any existing socket before creating a new one
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.close();
    }

    // Create a new socket connection
    socketRef.current = io(URL_API, {
      ...options,
      path: "/email-ws",
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [options]); // Re-run only when options change

  return socketRef.current;
};
