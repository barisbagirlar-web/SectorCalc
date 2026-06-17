"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type ToolsPageSearchContextValue = {
  readonly searchQuery: string;
  readonly setSearchQuery: (value: string) => void;
  readonly hideExplorerChrome: boolean;
};

const ToolsPageSearchContext = createContext<ToolsPageSearchContextValue | null>(null);

type ToolsPageSearchProviderProps = {
  readonly children: ReactNode;
};

export function ToolsPageSearchProvider({ children }: ToolsPageSearchProviderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ToolsPageSearchContext.Provider
      value={{ searchQuery, setSearchQuery, hideExplorerChrome: true }}
    >
      {children}
    </ToolsPageSearchContext.Provider>
  );
}

export function useToolsPageSearch(): ToolsPageSearchContextValue {
  const context = useContext(ToolsPageSearchContext);
  const [localQuery, setLocalQuery] = useState("");

  if (context) {
    return context;
  }

  return {
    searchQuery: localQuery,
    setSearchQuery: setLocalQuery,
    hideExplorerChrome: false,
  };
}
