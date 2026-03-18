import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type SiteMode = 'candidate' | 'employer';

interface ModeContextType {
  mode: SiteMode;
  setMode: (mode: SiteMode) => void;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

const STORAGE_KEY = 'site_mode';

export const ModeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const [mode, setModeState] = useState<SiteMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'employer' ? 'employer' : 'candidate';
  });

  // When user logs in/out, sync mode to their role so all consumers update
  useEffect(() => {
    if (user?.role === 'candidate' || user?.role === 'employer') {
      setModeState(user.role);
      localStorage.setItem(STORAGE_KEY, user.role);
    }
  }, [user?.role]);

  const setMode = (newMode: SiteMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  };

  const toggleMode = () => setMode(mode === 'candidate' ? 'employer' : 'candidate');

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = (): ModeContextType => {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used inside ModeProvider');
  return ctx;
};

/**
 * Returns the effective site mode:
 * - Authenticated candidate/employer → their actual role (overrides stored mode)
 * - Guest → stored mode preference
 * Use this instead of useMode() anywhere role should drive the UI.
 */
export const useEffectiveMode = (): SiteMode => {
  const { user } = useAuth();
  const { mode } = useMode();
  if (user?.role === 'candidate' || user?.role === 'employer') return user.role;
  return mode;
};

