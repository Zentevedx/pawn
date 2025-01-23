"use client";

import React, { createContext, useContext, useState } from "react";

interface GlobalState {
  clienteGuardado: boolean;
  setClienteGuardado: (value: boolean) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clienteGuardado, setClienteGuardado] = useState(false);

  return (
    <GlobalContext.Provider value={{ clienteGuardado, setClienteGuardado }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalState => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext debe usarse dentro de GlobalProvider");
  }
  return context;
};
