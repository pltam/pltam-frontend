import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchUserInfo } from '../utils/api';

interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string) => Promise<void>;
  logout: () => void;
  refreshUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // 앱 시작 시 토큰 확인 및 사용자 정보 로드
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const accessToken = localStorage.getItem('access_token');
    
    if (accessToken) {
      try {
        await loadUserInfo();
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        localStorage.removeItem('access_token');
      }
    }
    
    setIsLoading(false);
  };

  const loadUserInfo = async () => {
    try {
      const userInfo = await fetchUserInfo();
      setUser(userInfo);
    } catch (error) {
      throw error;
    }
  };

  const login = async (accessToken: string) => {
    localStorage.setItem('access_token', accessToken);
    await loadUserInfo();
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    
    // 쿠키에서 refresh_token도 제거 (서버에 로그아웃 요청)
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.jungho.xyz;';
    
    // 홈으로 리다이렉트
    window.location.href = '/';
  };

  const refreshUserInfo = async () => {
    if (isAuthenticated) {
      await loadUserInfo();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUserInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
