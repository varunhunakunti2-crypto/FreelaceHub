'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'client' | 'freelancer';

export interface UserProfile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  email: string;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  hourly_rate?: number | null;
  skills?: string[] | null;
}

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  loading: true,
});

export const UserProvider = ({ 
  children, 
  user, 
  profile, 
  loading 
}: { 
  children: ReactNode;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}) => {
  return (
    <UserContext.Provider value={{ user, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
