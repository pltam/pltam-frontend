import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Tabs, Tab, Link, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [selected, setSelected] = React.useState<string>("login");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [rememberMe, setRememberMe] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // 개발환경 체크
  const isDevelopment = process.env.REACT_APP_DEV_DEMO_ENABLED === 'true';
  const demoEmail = process.env.REACT_APP_DEV_DEMO_EMAIL || '';
  const demoPassword = process.env.REACT_APP_DEV_DEMO_PASSWORD || '';
  const demoName = process.env.REACT_APP_DEV_DEMO_NAME || '데모 사용자';

  const handleLogin = () => {
    setIsLoading(true);
    // 실제 구현에서는 API 호출 등을 통해 로그인 처리
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1000);
  };

  const handleDemoLogin = () => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 500);
  };

  const handleSignup = () => {
    setIsLoading(true);
    // 실제 구현에서는 API 호출 등을 통해 회원가입 처리
    setTimeout(() => {
      setIsLoading(false);
      setSelected("login");
    }, 1000);
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
                <Icon icon="lucide:compass" className="text-primary text-3xl" />
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
                      <Icon icon="lucide:settings" className="text-warning-600 text-sm" />
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
                      startContent={<Icon icon="lucide:zap" />}
                    >
                      데모 계정으로 빠른 로그인
                    </Button>
                    <div className="text-xs text-warning-600 mt-2 text-center">
                      {demoName} ({demoEmail})
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
                      label="이메일"
                      placeholder="이메일을 입력하세요"
                      type="email"
                      value={email}
                      onValueChange={setEmail}
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
                        window.location.href = 'https://localhost:8443/oauth2/authorization/google';
                      }}>
                        <Icon icon="logos:google-icon" className="text-xl" />
                      </Button>
                      <Button variant="bordered" className="w-full" onPress={() => {
                        window.location.href = 'https://localhost:8443/oauth2/authorization/naver';
                      }}>
                        <Icon icon="logos:naver" className="text-xl" />
                      </Button>
                      <Button variant="bordered" className="w-full" onPress={() => {
                        window.location.href = 'https://localhost:8443/oauth2/authorization/kakao';
                      }}>
                        <Icon icon="logos:kakao" className="text-xl" />
                      </Button>
                    </div>
                  </div>
                </Tab>
                <Tab key="signup" title="회원가입">
                  <div className="space-y-4 py-2">
                    <Input
                      label="이메일"
                      placeholder="이메일을 입력하세요"
                      type="email"
                      variant="bordered"
                      radius="sm"
                    />
                    <Input
                      label="비밀번호"
                      placeholder="비밀번호를 입력하세요"
                      type="password"
                      variant="bordered"
                      radius="sm"
                    />
                    <Input
                      label="비밀번호 확인"
                      placeholder="비밀번호를 다시 입력하세요"
                      type="password"
                      variant="bordered"
                      radius="sm"
                    />
                    <Checkbox size="sm">
                      <span className="text-sm">
                        <Link href="#" size="sm" className="text-primary">이용약관</Link>과 <Link href="#" size="sm" className="text-primary">개인정보처리방침</Link>에 동의합니다
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
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-content1 px-2 text-foreground-500">또는</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <Button variant="bordered" className="w-full" onPress={() => {
                        window.location.href = 'https://localhost:8443/oauth2/authorization/google';
                      }}>
                        <Icon icon="logos:google-icon" className="text-xl" />
                      </Button>
                      <Button variant="bordered" className="w-full" onPress={() => {
                        window.location.href = 'https://localhost:8443/oauth2/authorization/naver';
                      }}>
                        <Icon icon="logos:naver" className="text-xl" />
                      </Button>
                      <Button variant="bordered" className="w-full" onPress={() => {
                        window.location.href = 'https://localhost:8443/oauth2/authorization/kakao';
                      }}>
                        <Icon icon="logos:kakao" className="text-xl" />
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