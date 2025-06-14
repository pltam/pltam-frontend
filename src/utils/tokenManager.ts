// src/utils/tokenManager.ts
interface TokenInfo {
  token: string;
  expiresAt: number; // timestamp
}

class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  // JWT 토큰에서 만료 시간 추출
  private getTokenExpiration(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // exp는 초 단위이므로 밀리초로 변환
    } catch {
      return Date.now(); // 파싱 실패 시 즉시 만료로 처리
    }
  }

  // 토큰 저장 및 자동 갱신 스케줄링
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.scheduleTokenRefresh(token);
  }

  // 토큰 가져오기
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // 토큰 유효성 검사
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const expiresAt = this.getTokenExpiration(token);
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5분 버퍼

    return expiresAt > now + bufferTime;
  }

  // 토큰 자동 갱신 스케줄링
  private scheduleTokenRefresh(token: string): void {
    // 기존 타이머 클리어
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const expiresAt = this.getTokenExpiration(token);
    const now = Date.now();
    const refreshTime = 5 * 60 * 1000; // 만료 5분 전에 갱신
    const delay = Math.max(0, expiresAt - now - refreshTime);

    console.log(`다음 토큰 갱신까지: ${Math.round(delay / 1000)}초`);

    this.refreshTimer = setTimeout(() => {
      this.refreshToken();
    }, delay);
  }

  // 토큰 갱신
  async refreshToken(): Promise<string> {
    // 이미 갱신 중이면 기존 Promise 반환
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    try {
      console.log('토큰 갱신 시작...');
      
      const response = await fetch('https://api.jungho.xyz/api/v1/auth/reissue', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const newToken = data.access_token;
        
        this.setToken(newToken); // 새 토큰 저장 및 스케줄링
        console.log('토큰 갱신 성공');
        
        return newToken;
      } else {
        console.log('토큰 갱신 실패 - 로그인 필요');
        this.clearToken();
        window.location.href = '/';
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      this.clearToken();
      throw error;
    }
  }

  // 토큰 삭제
  clearToken(): void {
    localStorage.removeItem('access_token');
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // 토큰 관리 시작 (앱 시작 시 호출)
  initialize(): void {
    const token = this.getToken();
    if (token && this.isTokenValid()) {
      this.scheduleTokenRefresh(token);
    } else if (token) {
      // 토큰이 있지만 곧 만료되거나 이미 만료됨
      this.refreshToken().catch(() => {
        // 갱신 실패 시 토큰 삭제
        this.clearToken();
      });
    }
  }
}

// 싱글톤 인스턴스
export const tokenManager = new TokenManager();
