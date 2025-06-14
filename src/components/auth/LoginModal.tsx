import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Checkbox,
    Tabs,
    Tab,
    Link,
    Card,
    CardBody
} from '@heroui/react';
import {Icon} from '@iconify/react';
import { tokenManager } from '../../utils/tokenManager';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({isOpen, onClose, onLoginSuccess}) => {
    const { login } = useAuth();
    const [selected, setSelected] = React.useState<string>("login");
    const [username, setUsername] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [confirmPassword, setConfirmPassword] = React.useState<string>("");
    const [signupUsername, setSignupUsername] = React.useState<string>("");
    const [signupPassword, setSignupPassword] = React.useState<string>("");
    const [rememberMe, setRememberMe] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [agreeToTerms, setAgreeToTerms] = React.useState<boolean>(false);

    // API Base URL
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.jungho.xyz';

    // 개발환경 체크
    const isDevelopment = process.env.REACT_APP_DEV_DEMO_ENABLED === 'true';
    const demoUsername = process.env.REACT_APP_DEV_DEMO_USERNAME || '';
    const demoPassword = process.env.REACT_APP_DEV_DEMO_PASSWORD || '';
    const demoName = process.env.REACT_APP_DEV_DEMO_NAME || '데모 사용자';

    // 토큰 처리 함수 (소셜 로그인과 동일한 로직)
    const handleTokenAfterLogin = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/reissue`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                // ✅ AuthContext의 login 함수 사용 (사용자 정보도 자동으로 로드됨)
                await login(data.access_token);
                console.log('로그인 완료');
            } else {
                console.error('토큰 발급 실패');
                throw new Error('토큰 발급 실패');
            }
        } catch (error) {
            console.error('토큰 처리 오류:', error);
            throw error;
        }
    };

    const handleLogin = async () => {
        if (!username || !password) {
            alert('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);

        try {
            // Spring Security는 기본적으로 form 데이터를 받습니다
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (response.ok) {
                // 로그인 성공 후 토큰 처리 (소셜 로그인과 동일한 로직)
                await handleTokenAfterLogin();
                onLoginSuccess();
            } else {
                alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = () => {
        setUsername(demoUsername);
        setPassword(demoPassword);
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            onLoginSuccess();
        }, 500);
    };

    const handleSignup = async () => {
        if (!signupUsername || !signupPassword || !confirmPassword) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        if (signupPassword !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!agreeToTerms) {
            alert('이용약관과 개인정보처리방침에 동의해주세요.');
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('username', signupUsername);
            formData.append('password', signupPassword);

            console.log('회원가입 요청 시작:', { username: signupUsername });
            console.log('FormData 내용:', Array.from(formData.entries()));

            const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
                method: 'POST',
                body: formData,
                // FormData 사용시 Content-Type 헤더는 브라우저가 자동으로 설정
            });

            console.log('회원가입 응답 상태:', response.status);
            console.log('회원가입 응답 URL:', response.url);

            if (response.ok) {
                alert('회원가입이 완료되었습니다. 로그인해주세요.');
                setSelected("login");
                // 회원가입 폼 초기화
                setSignupUsername('');
                setSignupPassword('');
                setConfirmPassword('');
                setAgreeToTerms(false);
            } else {
                const errorData = await response.json();
                console.error('회원가입 실패 응답:', errorData);
                alert(errorData.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            alert('회원가입 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            size="md"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-center">
                            <div className="flex justify-center mb-2">
                                <Icon icon="lucide:compass" className="text-primary text-3xl"/>
                            </div>
                            <h2 className="text-xl font-semibold">플탐에 오신 것을 환영합니다</h2>
                            <p className="text-foreground-500 text-sm">취미를 탐색하고 새로운 경험을 시작하세요</p>
                        </ModalHeader>
                        <ModalBody>
                            {/* 개발환경에서만 데모 계정 표시 */}
                            {isDevelopment && (
                                <Card className="bg-warning-50 border border-warning-200 mb-4">
                                    <CardBody className="p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon icon="lucide:settings" className="text-warning-600 text-sm"/>
                                            <span className="text-warning-800 text-sm font-medium">개발용 데모 계정</span>
                                        </div>
                                        <div className="text-xs text-warning-700 mb-3">
                                            개발 환경에서 빠른 테스트를 위한 임시 계정입니다.<br/>
                                            (배포 시 자동으로 제거됩니다)
                                        </div>
                                        <Button
                                            size="sm"
                                            color="warning"
                                            variant="flat"
                                            className="w-full"
                                            onPress={handleDemoLogin}
                                            isLoading={isLoading}
                                            startContent={<Icon icon="lucide:zap"/>}
                                        >
                                            데모 계정으로 빠른 로그인
                                        </Button>
                                        <div className="text-xs text-warning-600 mt-2 text-center">
                                            {demoName} ({demoUsername})
                                        </div>
                                    </CardBody>
                                </Card>
                            )}

                            <Tabs
                                aria-label="Login options"
                                selectedKey={selected}
                                onSelectionChange={setSelected as any}
                                className="w-full"
                                variant="underlined"
                                color="primary"
                            >
                                <Tab key="login" title="로그인">
                                    <div className="space-y-4 py-2">
                                        <Input
                                            label="아이디"
                                            placeholder="아이디를 입력하세요"
                                            type="text"
                                            value={username}
                                            onValueChange={setUsername}
                                            variant="bordered"
                                            radius="sm"
                                        />
                                        <Input
                                            label="비밀번호"
                                            placeholder="비밀번호를 입력하세요"
                                            type="password"
                                            value={password}
                                            onValueChange={setPassword}
                                            variant="bordered"
                                            radius="sm"
                                        />
                                        <div className="flex justify-between items-center">
                                            <Checkbox size="sm" isSelected={rememberMe} onValueChange={setRememberMe}>
                                                <span className="text-sm">로그인 상태 유지</span>
                                            </Checkbox>
                                            <Link href="#" size="sm" className="text-primary">비밀번호 찾기</Link>
                                        </div>
                                        <Button
                                            color="primary"
                                            className="w-full"
                                            onPress={handleLogin}
                                            isLoading={isLoading}
                                        >
                                            로그인
                                        </Button>
                                        <div className="relative my-6">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-divider"></div>
                                            </div>
                                            <div className="relative flex justify-center text-xs">
                                                <span className="bg-content1 px-2 text-foreground-500">또는</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <Button variant="bordered" className="w-full" onPress={() => {
                                                window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
                                            }}>
                                                <Icon icon="logos:google-icon" className="text-xl"/>
                                            </Button>
                                            <Button variant="bordered" className="w-full" onPress={() => {
                                                window.location.href = `${API_BASE_URL}/oauth2/authorization/naver`;
                                            }}>
                                                <Icon icon="logos:naver" className="text-xl"/>
                                            </Button>
                                            <Button variant="bordered" className="w-full" onPress={() => {
                                                window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
                                            }}>
                                                <Icon icon="logos:kakao" className="text-xl"/>
                                            </Button>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab key="signup" title="회원가입">
                                    <div className="space-y-4 py-2">
                                        <Input
                                            label="아이디"
                                            placeholder="아이디를 입력하세요"
                                            type="text"
                                            value={signupUsername}
                                            onValueChange={setSignupUsername}
                                            variant="bordered"
                                            radius="sm"
                                        />
                                        <Input
                                            label="비밀번호"
                                            placeholder="비밀번호를 입력하세요"
                                            type="password"
                                            value={signupPassword}
                                            onValueChange={setSignupPassword}
                                            variant="bordered"
                                            radius="sm"
                                        />
                                        <Input
                                            label="비밀번호 확인"
                                            placeholder="비밀번호를 다시 입력하세요"
                                            type="password"
                                            value={confirmPassword}
                                            onValueChange={setConfirmPassword}
                                            variant="bordered"
                                            radius="sm"
                                        />
                                        <Checkbox size="sm" isSelected={agreeToTerms} onValueChange={setAgreeToTerms}>
                      <span className="text-sm">
                        <Link href="#" size="sm" className="text-primary">이용약관</Link>과 <Link href="#" size="sm"
                                                                                             className="text-primary">개인정보처리방침</Link>에 동의합니다
                      </span>
                                        </Checkbox>
                                        <Button
                                            color="primary"
                                            className="w-full"
                                            onPress={handleSignup}
                                            isLoading={isLoading}
                                        >
                                            회원가입
                                        </Button>
                                        <div className="relative my-6">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-divider"></div>
                                            </div>
                                            <div className="relative flex justify center text-xs">
                                                <span className="bg-content1 px-2 text-foreground-500">소셜 로그인</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <Button variant="bordered" className="w-full" onPress={() => {
                                                window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
                                            }}>
                                                <Icon icon="logos:google-icon" className="text-xl"/>
                                            </Button>
                                            <Button variant="bordered" className="w-full" onPress={() => {
                                                window.location.href = `${API_BASE_URL}/oauth2/authorization/naver`;
                                            }}>
                                                <Icon icon="logos:naver" className="text-xl"/>
                                            </Button>
                                            <Button variant="bordered" className="w-full" onPress={() => {
                                                window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
                                            }}>
                                                <Icon icon="logos:kakao" className="text-xl"/>
                                            </Button>
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                닫기
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default LoginModal;