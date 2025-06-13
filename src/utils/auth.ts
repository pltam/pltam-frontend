// src/utils/auth.ts
export const handleLoginSuccess = async (): Promise<boolean> => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginStatus = urlParams.get('login');
    
    if (loginStatus === 'success') {
        try {
            const response = await fetch('https://api.jungho.xyz/api/v1/auth/reissue', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access_token);
                
                // URL 파라미터 제거
                window.history.replaceState({}, document.title, window.location.pathname);
                
                return true; // 로그인 성공
            } else {
                console.error('토큰 발급 실패');
                return false;
            }
        } catch (error) {
            console.error('네트워크 오류:', error);
            return false;
        }
    }
    return false;
};
