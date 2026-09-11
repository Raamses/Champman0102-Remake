import React, { createContext, useContext, useState } from 'react';
import { UserProfile } from '../types';

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  logout: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  uid: 'local-manager',
  displayName: 'Manager',
  email: '',
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  const logout = () => {
    setProfile(DEFAULT_PROFILE);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, logout }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
