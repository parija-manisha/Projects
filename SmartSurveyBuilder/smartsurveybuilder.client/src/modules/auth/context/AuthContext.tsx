import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthContext } from './AuthContextProvider';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth state from localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        JSON.parse(user);
        // Auth is already loaded from localStorage in the slice
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    // Set initialized flag after cleanup
    const timer = setTimeout(() => setIsInitialized(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
