import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * Provides Spotify access token globally across the app.
 * Token is persisted in localStorage so it survives page refreshes.
 */
export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('spotify_access_token') || null;
  });

  const login = (token) => {
    localStorage.setItem('spotify_access_token', token);
    setAccessToken(token);
  };

  const logout = () => {
    localStorage.removeItem('spotify_access_token');
    sessionStorage.removeItem('pkce_verifier');
    sessionStorage.removeItem('pkce_state');
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context.
 * @returns {{ accessToken: string|null, login: Function, logout: Function }}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
