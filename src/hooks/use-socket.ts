import { useEffect, useRef } from "react";
import { URL_API } from "@/utils/constants";
import type { ManagerOptions, SocketOptions } from "socket.io-client";
import { io, type Socket as IOSocket } from "socket.io-client";

export const useSocket = (
  options?: Partial<ManagerOptions & SocketOptions>
): IOSocket | null => {
  const socketRef = useRef<IOSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // Log for debugging auth state and token presence
    console.log(
      "[useSocket] Trying to create socket. Token found:",
      !!token,
      "| Value:",
      token
    );

    // If no token, don't create the socket
    if (!token) {
      if (socketRef.current) {
        console.log("[useSocket] No token: cleaning up any existing socket.");
        socketRef.current.removeAllListeners();
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    // Clean up any existing socket before creating a new one
    if (socketRef.current) {
      console.log("[useSocket] Closing old socket before creating a new one");
      socketRef.current.removeAllListeners();
      socketRef.current.close();
    }

    // Attempt to create socket
    console.log("[useSocket] Creating new socket with token");
    socketRef.current = io(URL_API, {
      ...options,
      path: "/email-ws",
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Log when socket is created
    socketRef.current.on("connect", () => {
      console.log("[useSocket] Socket connected:", socketRef.current?.id);
    });
    socketRef.current.on("disconnect", () => {
      console.log("[useSocket] Socket disconnected");
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        console.log("[useSocket] Unmount: cleaning up socket");
        socketRef.current.removeAllListeners();
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [options]); // Only re-run when options change

  // If the socket is not connected, return null (prevents premature usage)
  return socketRef.current;
};
