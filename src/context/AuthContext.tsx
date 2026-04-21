import React, { createContext, useState, useContext, ReactNode } from 'react';

// Типы для токенов
type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

// Типы для контекста
type AuthContextType = {
  authTokens: AuthTokens | null;
  setTokens: (tokens: AuthTokens) => void;
  getTokens: () => AuthTokens | null;
  logout: () => void;
};

// Создаем контекст
const AuthContext = createContext<AuthContextType | null>(null);

// Провайдер для контекста
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);

  // Функция для сохранения токенов
  const setTokens = (tokens: AuthTokens) => {
    localStorage.setItem('tokens', JSON.stringify(tokens));
    setAuthTokens(tokens);
};


  // Функция для получения токенов
  const getTokens = (): AuthTokens | null => {
    const tokens = localStorage.getItem('tokens');
    return tokens ? JSON.parse(tokens) : null;
  };

  // Функция для выхода
  const logout = () => {
    localStorage.removeItem('tokens');
    setAuthTokens(null);
  };

  return (
    <AuthContext.Provider value={{ authTokens, setTokens, getTokens, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};