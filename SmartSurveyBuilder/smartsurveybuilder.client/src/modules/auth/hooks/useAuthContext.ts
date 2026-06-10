import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import type { AuthContextType } from '../types/authTypes';

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
