import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DriverProfile } from '../types';
import { MOCK_DRIVER } from './api';

interface AuthContextType {
  driverProfile: DriverProfile;
  setDriverProfile: (profile: DriverProfile) => void;
  isRegistered: boolean;
  setIsRegistered: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  driverProfile: MOCK_DRIVER,
  setDriverProfile: () => {},
  isRegistered: false,
  setIsRegistered: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [driverProfile, setDriverProfile] = useState<DriverProfile>(MOCK_DRIVER);
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <AuthContext.Provider value={{ driverProfile, setDriverProfile, isRegistered, setIsRegistered }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
