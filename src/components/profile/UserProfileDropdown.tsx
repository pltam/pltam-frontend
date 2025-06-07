import React from 'react';
import { createPortal } from 'react-dom';
import { Card, CardBody, Button, Avatar, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { User } from '../../data/mockData';

interface UserProfileDropdownProps {
  user: User | null;
  isVisible: boolean;
  onClose: () => void;
  onViewProfile: () => void;
  onStartChat: (userId?: number) => void;
  onReport: () => void;
  position: { x: number; y: number };
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  user,
  isVisible,
  onClose,
  onViewProfile,
  onStartChat,
  onReport,
  position
}) => {
  React.useEffect(() => {
    if (isVisible) {
      const handleClickOutside = () => onClose();
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);

      // 드롭다운이 화면을 벗어나면 스크롤해서 전체가 보이도록 함
      const scrollIntoView = () => {
        const dropdownHeight = 400;
        const viewportHeight = window.innerHeight;
        const currentScrollY = window.scrollY;

        // 뷰포트 기준으로 드롭다운 위치 계산
        const viewportY = position.y - currentScrollY;

        if (viewportY + dropdownHeight > viewportHeight) {
          const targetScrollY = position.y + dropdownHeight - viewportHeight + 20;
          window.scrollTo({
            top: Math.max(0, targetScrollY),
            behavior: 'smooth'
          });
        }
      };

      setTimeout(scrollIntoView, 100);

      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isVisible, onClose, position]);

  if (!isVisible || !user) {
    return null;
  }

  // 화면 경계 안전장치
  const safePosition = {
    x: Math.min(Math.max(10, position.x), window.innerWidth - 330),
    y: position.y + 8
  };

  const dropdownContent = (
    <div 
      className="absolute z-[9999]"
      style={{
        left: safePosition.x,
        top: safePosition.y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Card className="w-80 shadow-lg">
        <CardBody className="p-4">
          {/* 사용자 기본 정보 */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Avatar src={user.avatar} size="lg" />
              {user.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-sm text-foreground-500">
                {user.isOnline ? '온라인' : '오프라인'}
              </p>
            </div>
          </div>

          {/* 사용자 통계 */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{user.rating}</div>
              <div className="text-xs text-foreground-500">평점</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{user.followerCount || 0}</div>
              <div className="text-xs text-foreground-500">팔로워</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{user.reviewCount}</div>
              <div className="text-xs text-foreground-500">리뷰</div>
            </div>
          </div>

          {/* 위치 정보 */}
          {user.location && (
            <div className="flex items-center gap-2 mb-4 text-sm text-foreground-500">
              <Icon icon="lucide:map-pin" className="text-primary" />
              <span>{user.location}</span>
            </div>
          )}

          <Divider className="my-3" />

          {/* 액션 버튼들 */}
          <div className="space-y-2">
            <Button
              variant="light"
              startContent={<Icon icon="lucide:user" />}
              className="w-full justify-start"
              onPress={() => {
                onViewProfile();
                onClose();
              }}
            >
              프로필 보기
            </Button>
            <Button
              variant="light"
              startContent={<Icon icon="lucide:message-circle" />}
              className="w-full justify-start"
              onPress={() => {
                onStartChat(user.id);
                onClose();
              }}
            >
              1:1 채팅
            </Button>
            <Button
              variant="light"
              startContent={<Icon icon="lucide:flag" />}
              className="w-full justify-start text-danger"
              onPress={() => {
                onReport();
                onClose();
              }}
            >
              신고하기
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  // body에 포털로 렌더링
  return createPortal(dropdownContent, document.body);
};

export default UserProfileDropdown;
