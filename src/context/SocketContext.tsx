
import React, { createContext, useContext, useMemo } from "react";
import { useSocket } from "@/hooks/use-socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext<ReturnType<typeof useSocket> | null>(null);

export const useSocketContext = () => {
  const ctx = useContext(SocketContext);
  if (ctx === undefined) throw new Error("useSocketContext must be used within a SocketProvider");
  return ctx;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  // Only create the socket once per session if authenticated
  const socket = useSocket(isAuthenticated ? undefined : null);

  // Only provide the socket if authenticated
  const value = useMemo(() => (isAuthenticated ? socket : null), [socket, isAuthenticated]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
