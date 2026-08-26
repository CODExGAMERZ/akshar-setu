'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserSession } from '@/types';
import { StorageService } from '@/lib/storage';

interface AuthContextType {
  session: UserSession;
  signInWithGoogle: () => void;
  continueAsGuest: () => void;
  signOut: () => void;
  isProfileReadyModalOpen: boolean;
  setIsProfileReadyModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession>({ isGuest: true, user: null });
  const [isProfileReadyModalOpen, setIsProfileReadyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loaded = StorageService.getSession();
    setSession(loaded);
  }, []);

  const signInWithGoogle = () => {
    // Simulates Google OAuth Sign-in for immediate demo/hackathon deployment
    const newSession: UserSession = {
      isGuest: false,
      user: {
        id: 'usr_google_123',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@gmail.com',
        avatarUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDl_paqyHow3TF4FMuOEd-jBCVh9QODPv3mjePU1fjo0T8fGtp2Fq1cSM7hh_VgH9tRo2LgFLr5xMSa9N_4V4sD6OevLo3equYdsAeHm72hH5W_Srllx_6amIo47HFfe6B_KEOkr3uNecRBC5akytzgdyI4-VmeF45MVSYmj0W7KH4AzCweZK8chtyylP0Q22mcAkOK-ZqGJAtvzN-ghf2I-OQcxmoXY-40Mfly5SXdFrpvjBv3Tmspfg',
      },
    };
    setSession(newSession);
    StorageService.saveSession(newSession);
    setIsProfileReadyModalOpen(false);
  };

  const continueAsGuest = () => {
    const guestSession: UserSession = { isGuest: true, user: null };
    setSession(guestSession);
    StorageService.saveSession(guestSession);
    setIsProfileReadyModalOpen(false);
  };

  const signOut = () => {
    const guestSession: UserSession = { isGuest: true, user: null };
    setSession(guestSession);
    StorageService.saveSession(guestSession);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        signInWithGoogle,
        continueAsGuest,
        signOut,
        isProfileReadyModalOpen,
        setIsProfileReadyModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
