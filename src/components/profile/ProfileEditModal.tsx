import React from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Input, 
  Textarea,
  Avatar,
  Select,
  SelectItem
} from '@heroui/react';
import { Icon } from '@iconify/react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: ProfileData) => void;
  currentProfile: ProfileData;
}

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  location: string;
  avatar: string;
  phone?: string;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  currentProfile 
}) => {
  const [formData, setFormData] = React.useState<ProfileData>(currentProfile);
  const [isLoading, setIsLoading] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState(currentProfile.avatar);

  // 지역 목록
  const regions = [
    '서울', '경기', '인천', '강원', '충북', '충남', '세종', '대전', 
    '광주', '전북', '경북', '대구', '제주', '전남', '경남/울산', '부산'
  ];

  // 모달이 열릴 때마다 현재 프로필 정보로 초기화
  React.useEffect(() => {
    if (isOpen) {
      setFormData(currentProfile);
      setAvatarPreview(currentProfile.avatar);
    }
  }, [isOpen, currentProfile]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        setFormData(prev => ({
          ...prev,
          avatar: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('프로필 저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialConnect = (provider: 'google' | 'naver' | 'kakao') => {
    // 실제로는 소셜 로그인 연동 API 호출
    console.log(`${provider} 계정 연동 시도`);
    
    // 임시 알림
    alert(`${provider} 계정 연동 기능은 준비 중입니다.`);
  };

  const handleCancel = () => {
    setFormData(currentProfile);
    setAvatarPreview(currentProfile.avatar);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleCancel}
      placement="center"
      size="lg"
      scrollBehavior="inside"
      classNames={{
        backdrop: "z-[10100]",
        wrapper: "z-[10100]",
        base: "z-[10100]"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:user-cog" className="text-primary text-xl" />
                <span>프로필 수정</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* 프로필 사진 */}
                <div className="flex flex-col items-center">
                  <Avatar
                    src={avatarPreview}
                    className="w-24 h-24 mb-4"
                    isBordered
                    color="primary"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label htmlFor="avatar-upload">
                      <Button
                        as="span"
                        variant="bordered"
                        size="sm"
                        startContent={<Icon icon="lucide:camera" />}
                        className="cursor-pointer"
                      >
                        사진 변경
                      </Button>
                    </label>
                    <p className="text-xs text-foreground-500">
                      JPG, PNG 파일만 업로드 가능 (최대 5MB)
                    </p>
                  </div>
                </div>

                {/* 기본 정보 */}
                <div className="space-y-4">
                  <Input
                    label="이름"
                    placeholder="이름을 입력하세요"
                    value={formData.name}
                    onValueChange={(value) => handleInputChange('name', value)}
                    variant="bordered"
                    isRequired
                    startContent={<Icon icon="lucide:user" className="text-foreground-400" />}
                  />

                  <Input
                    label="이메일"
                    placeholder="이메일을 입력하세요"
                    type="email"
                    value={formData.email}
                    onValueChange={(value) => handleInputChange('email', value)}
                    variant="bordered"
                    isRequired
                    startContent={<Icon icon="lucide:mail" className="text-foreground-400" />}
                  />

                  <Input
                    label="전화번호"
                    placeholder="전화번호를 입력하세요 (선택사항)"
                    value={formData.phone || ''}
                    onValueChange={(value) => handleInputChange('phone', value)}
                    variant="bordered"
                    startContent={<Icon icon="lucide:phone" className="text-foreground-400" />}
                  />

                  <Select
                    label="지역"
                    placeholder="지역을 선택하세요"
                    selectedKeys={formData.location ? [formData.location] : []}
                    onSelectionChange={(keys) => {
                      const selectedLocation = Array.from(keys)[0] as string;
                      handleInputChange('location', selectedLocation);
                    }}
                    variant="bordered"
                    startContent={<Icon icon="lucide:map-pin" className="text-foreground-400" />}
                  >
                    {regions.map((region) => (
                      <SelectItem key={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </Select>

                  <Textarea
                    label="자기소개"
                    placeholder="자신을 소개해주세요"
                    value={formData.bio}
                    onValueChange={(value) => handleInputChange('bio', value)}
                    variant="bordered"
                    minRows={3}
                    maxRows={5}
                    maxLength={200}
                    description={`${formData.bio.length}/200자`}
                  />
                </div>

                {/* 소셜 계정 연동 섹션 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:link" className="text-foreground-600" />
                    <h3 className="text-md font-semibold">소셜 계정 연동</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-divider rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon icon="logos:google-icon" className="text-xl" />
                        <div>
                          <p className="text-sm font-medium">Google</p>
                          <p className="text-xs text-foreground-500">Google 계정과 연동</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="bordered"
                        startContent={<Icon icon="lucide:link" />}
                        onPress={() => handleSocialConnect('google')}
                      >
                        연동
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-divider rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon icon="logos:naver" className="text-xl" />
                        <div>
                          <p className="text-sm font-medium">Naver</p>
                          <p className="text-xs text-foreground-500">네이버 계정과 연동</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="bordered"
                        startContent={<Icon icon="lucide:link" />}
                        onPress={() => handleSocialConnect('naver')}
                      >
                        연동
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-divider rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon icon="logos:kakao" className="text-xl" />
                        <div>
                          <p className="text-sm font-medium">Kakao</p>
                          <p className="text-xs text-foreground-500">카카오 계정과 연동</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="bordered"
                        startContent={<Icon icon="lucide:link" />}
                        onPress={() => handleSocialConnect('kakao')}
                      >
                        연동
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-foreground-500 bg-foreground-50 p-3 rounded-lg">
                    <Icon icon="lucide:info" className="inline mr-1" />
                    소셜 계정을 연동하면 더 편리하게 로그인할 수 있습니다.
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button 
                variant="light" 
                onPress={handleCancel}
                isDisabled={isLoading}
              >
                취소
              </Button>
              <Button 
                color="primary" 
                onPress={handleSave}
                isLoading={isLoading}
                startContent={!isLoading && <Icon icon="lucide:save" />}
              >
                저장
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ProfileEditModal;