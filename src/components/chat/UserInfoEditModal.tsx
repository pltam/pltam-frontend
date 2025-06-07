import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Avatar
} from '@heroui/react';
import { Icon } from '@iconify/react';

interface UserInfoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userInfo: {
    name: string;
    email: string;
    phone: string;
    bio: string;
    avatar: string;
  }) => void;
  currentUserInfo: {
    name: string;
    email: string;
    phone: string;
    bio: string;
    avatar: string;
  };
}

const UserInfoEditModal: React.FC<UserInfoEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentUserInfo
}) => {
  const [userInfo, setUserInfo] = useState(currentUserInfo);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setUserInfo(currentUserInfo);
    }
  }, [isOpen, currentUserInfo]);

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(userInfo);
      onClose();
    } catch (error) {
      console.error('정보 수정 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
      classNames={{
        base: "w-full max-w-2xl mx-4 z-[10000]",
        backdrop: "z-[10000]",
        wrapper: "z-[10000]",
        body: "p-6"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3 border-b border-divider pb-4">
          <Icon icon="lucide:edit" className="text-primary" />
          <h3 className="text-lg font-bold">사용자 정보 수정</h3>
        </ModalHeader>
        
        <ModalBody className="space-y-6">
          {/* 프로필 사진 */}
          <div className="flex items-center gap-4">
            <Avatar
              src={userInfo.avatar}
              size="lg"
              className="w-20 h-20"
            />
            <div>
              <h4 className="font-semibold mb-2">프로필 사진</h4>
              <Button size="sm" variant="flat" startContent={<Icon icon="lucide:upload" />}>
                사진 변경
              </Button>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG 파일만 업로드 가능합니다</p>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="이름"
              value={userInfo.name}
              onValueChange={(value) => handleInputChange('name', value)}
              placeholder="이름을 입력하세요"
              startContent={<Icon icon="lucide:user" className="text-gray-400" />}
              isRequired
            />
            <Input
              label="이메일"
              type="email"
              value={userInfo.email}
              onValueChange={(value) => handleInputChange('email', value)}
              placeholder="이메일을 입력하세요"
              startContent={<Icon icon="lucide:mail" className="text-gray-400" />}
              isRequired
            />
          </div>

          <Input
            label="전화번호"
            value={userInfo.phone}
            onValueChange={(value) => handleInputChange('phone', value)}
            placeholder="전화번호를 입력하세요"
            startContent={<Icon icon="lucide:phone" className="text-gray-400" />}
          />

          <Textarea
            label="자기소개"
            value={userInfo.bio}
            onValueChange={(value) => handleInputChange('bio', value)}
            placeholder="자기소개를 입력하세요"
            maxRows={4}
            maxLength={200}
          />
          <div className="text-right text-xs text-gray-400">
            {userInfo.bio.length}/200
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2 pt-4 border-t border-divider">
          <Button
            variant="light"
            onPress={onClose}
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
            {isLoading ? '저장 중...' : '저장'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserInfoEditModal;