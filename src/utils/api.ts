// src/utils/api.ts
import { tokenManager } from './tokenManager';

export async function apiRequest(url: string, options: RequestInit = {}): Promise<Response> {
    // 토큰 유효성 검사 및 필요시 갱신
    if (!tokenManager.isTokenValid()) {
        try {
            await tokenManager.refreshToken();
        } catch (error) {
            console.debug('Token refresh failed, proceeding without token');
        }
    }

    let accessToken = tokenManager.getToken();
    
    // 첫 번째 요청
    let response = await fetch(url, {
        credentials: 'include',
        ...options,
        headers: {
            ...options.headers,
            'Authorization': accessToken ? `Bearer ${accessToken}` : '',
            'Content-Type': 'application/json'
        }
    });
    
    // 401 에러 시 토큰 갱신 후 재시도 (fallback)
    if (response.status === 401 && accessToken) {
        try {
            console.log('401 에러 - 토큰 갱신 재시도...');
            const newToken = await tokenManager.refreshToken();
            
            // 새 토큰으로 재요청
            response = await fetch(url, {
                credentials: 'include',
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${newToken}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.log('토큰 갱신 실패 - 인증 오류');
            throw new Error('Authentication failed');
        }
    }
    
    return response;
}

// 사용 예시들
export const fetchUserInfo = async () => {
    try {
        const response = await apiRequest('https://api.jungho.xyz/api/v1/user/info');
        if (response.ok) {
            const userData = await response.json();
            return userData;
        } else {
            throw new Error('사용자 정보 로드 실패');
        }
    } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        throw error;
    }
};

export const fetchUserProfile = async (userId: number) => {
    try {
        const response = await apiRequest(`https://api.jungho.xyz/api/v1/user/profile/${userId}`);
        if (response.ok) {
            const profileData = await response.json();
            return profileData;
        } else {
            throw new Error('프로필 정보 로드 실패');
        }
    } catch (error) {
        console.error('프로필 정보 로드 실패:', error);
        throw error;
    }
};

export const createPost = async (postData: any) => {
    try {
        const response = await apiRequest('https://api.jungho.xyz/api/v1/posts', {
            method: 'POST',
            body: JSON.stringify(postData)
        });
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            throw new Error('게시글 작성 실패');
        }
    } catch (error) {
        console.error('게시글 작성 실패:', error);
        throw error;
    }
};

export const updateUserProfile = async (profileData: any) => {
    try {
        const response = await apiRequest('https://api.jungho.xyz/api/v1/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            throw new Error('프로필 업데이트 실패');
        }
    } catch (error) {
        console.error('프로필 업데이트 실패:', error);
        throw error;
    }
};

export const deletePost = async (postId: number) => {
    try {
        const response = await apiRequest(`https://api.jungho.xyz/api/v1/posts/${postId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            return true;
        } else {
            throw new Error('게시글 삭제 실패');
        }
    } catch (error) {
        console.error('게시글 삭제 실패:', error);
        throw error;
    }
};
