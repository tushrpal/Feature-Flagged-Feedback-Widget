import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchFeatureFlags } from "../api/mockApi";

type FeatureFlags = {
  emailRequired: boolean;
  darkMode: boolean;
};

type ContextType = {
  flags: FeatureFlags;
};

const FeatureFlagContext = createContext<ContextType | undefined>(undefined);

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (!context) throw new Error("useFeatureFlags must be inside provider");
  return context.flags;
}

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>({
    emailRequired: false,
    darkMode: false,
  });

  useEffect(() => {
    fetchFeatureFlags().then(setFlags).catch(console.error);
  }, []);

  return (
    <FeatureFlagContext.Provider value={{ flags }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}
