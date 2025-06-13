// src/utils/api.ts
export async function apiRequest(url: string, options: RequestInit = {}): Promise<Response> {
    let accessToken = localStorage.getItem('access_token');
    
    // 첫 번째 요청
    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': accessToken ? `Bearer ${accessToken}` : '',
            'Content-Type': 'application/json'
        }
    });
    
    // 401 에러 시 토큰 갱신 후 재시도
    if (response.status === 401) {
        const refreshResponse = await fetch('https://api.jungho.xyz/api/auth/reissue', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            localStorage.setItem('access_token', data.access_token);
            
            // 새 토큰으로 재요청
            response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${data.access_token}`,
                    'Content-Type': 'application/json'
                }
            });
        } else {
            // Refresh Token도 만료된 경우
            localStorage.removeItem('access_token');
            window.location.href = '/'; // 홈으로 리다이렉트
            throw new Error('Authentication failed');
        }
    }
    
    return response;
}

// 사용 예시들
export const fetchUserInfo = async () => {
    try {
        const response = await apiRequest('https://api.jungho.xyz/api/user/info');
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
        const response = await apiRequest(`https://api.jungho.xyz/api/user/profile/${userId}`);
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
        const response = await apiRequest('https://api.jungho.xyz/api/posts', {
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
        const response = await apiRequest('https://api.jungho.xyz/api/user/profile', {
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
        const response = await apiRequest(`https://api.jungho.xyz/api/posts/${postId}`, {
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
