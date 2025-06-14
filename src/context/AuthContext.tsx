import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchUserInfo, apiRequest } from '../utils/api';
import { tokenManager } from '../utils/tokenManager';

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
    const initializeAuth = async () => {
      // 토큰 관리자 초기화
      tokenManager.initialize();
      
      const accessToken = tokenManager.getToken();
      
      if (accessToken) {
        try {
          await loadUserInfo();
        } catch (error) {
          console.error('사용자 정보 로드 실패:', error);
          tokenManager.clearToken();
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userInfo = await fetchUserInfo();
      setUser(userInfo);
    } catch (error) {
      throw error;
    }
  };

  const login = async (accessToken: string) => {
    tokenManager.setToken(accessToken); // tokenManager로 토큰 관리
    await loadUserInfo();
  };

  const logout = async () => {
    try {
      console.log("로그아웃 요청 중...");
      // 서버에 로그아웃 요청하여 쿠키 삭제 (Authorization 헤더와 쿠키 자동 포함)
      await apiRequest('https://api.jungho.xyz/api/v1/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.error('로그아웃 API 요청 실패:', error);
    } finally {
      // API 요청 성공/실패와 관계없이 클라이언트 정리
      tokenManager.clearToken(); // tokenManager로 토큰 삭제
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
