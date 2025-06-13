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

  const logout = async () => {
    try {
      console.log("로그아웃 요청 중...");
      // 서버에 로그아웃 요청하여 쿠키 삭제
      await fetch('https://api.jungho.xyz/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include', // 쿠키 포함
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('로그아웃 API 요청 실패:', error);
    } finally {
      // API 요청 성공/실패와 관계없이 클라이언트 정리
      localStorage.removeItem('access_token');
      setUser(null);

      // 홈으로 리다이렉트
      window.location.href = '/';
    }
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
