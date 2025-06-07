import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { User, getUserById } from '../../data/mockData';
import UserProfileDropdown from './UserProfileDropdown';
import UserProfileModal from './UserProfileModal';
import ReportModal from './ReportModal';
import ProfileClickProvider from './ProfileClickProvider';

interface UserProfileSystemProps {
  currentUserId: number;
  onStartChat?: (userId: number) => void;
  children?: React.ReactNode;
}

const UserProfileSystem: React.FC<UserProfileSystemProps> = ({
  currentUserId,
  onStartChat,
  children
}) => {
  const [dropdownState, setDropdownState] = useState<{
    isVisible: boolean;
    user: User | null;
    position: { x: number; y: number };
  }>({
    isVisible: false,
    user: null,
    position: { x: 0, y: 0 }
  });

  const [profileModalState, setProfileModalState] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null
  });

  const location = useLocation();

  const [reportModalState, setReportModalState] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null
  });

  // 페이지 이동시 드롭다운 숨기기
  React.useEffect(() => {
    hideProfileDropdown();
  }, [location.pathname]);

  // 전역 이벤트로 드롭다운 닫기
  React.useEffect(() => {
    const handleCloseProfileDropdown = () => {
      hideProfileDropdown();
    };

    window.addEventListener('closeProfileDropdown', handleCloseProfileDropdown);
    
    return () => {
      window.removeEventListener('closeProfileDropdown', handleCloseProfileDropdown);
    };
  }, []);

  // 프로필 드롭다운 표시
  const showProfileDropdown = (userId: number, event: React.MouseEvent) => {
    console.log('Profile clicked:', userId); // 디버깅용
    if (userId === currentUserId) return; // 본인 프로필은 드롭다운 없음

    const user = getUserById(userId);
    if (!user) {
      console.log('User not found:', userId); // 디버깅용
      return;
    }

    // 클릭된 요소의 정확한 위치 계산
    const rect = event.currentTarget.getBoundingClientRect();
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    console.log('Click position:', {
      rect: rect,
      scrollX: scrollX,
      scrollY: scrollY,
      finalX: rect.left + scrollX,
      finalY: rect.bottom + scrollY
    });

    setDropdownState({
      isVisible: true,
      user,
      position: {
        x: rect.left + scrollX,
        y: rect.bottom + scrollY
      }
    });
  };

  // 프로필 드롭다운 숨기기
  const hideProfileDropdown = () => {
    console.log('Hiding profile dropdown'); // 디버깅용
    setDropdownState({
      isVisible: false,
      user: null,
      position: { x: 0, y: 0 }
    });
  };

  // 중첩된 프로필 뷰 처리 (팔로워/팔로잉에서 클릭)
  const handleViewNestedProfile = (clickedUser: User) => {
    setProfileModalState({
      isOpen: true,
      user: clickedUser
    });
  };

  // 프로필 상세 모달 열기
  const openProfileModal = (userId?: number) => {
    const targetUserId = userId || dropdownState.user?.id;
    if (!targetUserId) return;

    const user = getUserById(targetUserId);
    if (!user) return;

    setProfileModalState({
      isOpen: true,
      user
    });
  };

  // 프로필 상세 모달 닫기
  const closeProfileModal = () => {
    setProfileModalState({
      isOpen: false,
      user: null
    });
  };

  // 신고 모달 열기
  const openReportModal = (userId?: number) => {
    const targetUserId = userId || dropdownState.user?.id;
    if (!targetUserId) return;

    const user = getUserById(targetUserId);
    if (!user) return;

    setReportModalState({
      isOpen: true,
      user
    });
  };

  // 신고 모달 닫기
  const closeReportModal = () => {
    setReportModalState({
      isOpen: false,
      user: null
    });
  };

  // 1:1 채팅 시작
  const handleStartChat = (userId?: number) => {
    const targetUserId = userId || dropdownState.user?.id;
    if (!targetUserId) return;

    onStartChat?.(targetUserId);
  };

  // 신고 처리
  const handleReport = (reason: string, details: string) => {
    if (!reportModalState.user) return;

    // 실제로는 API 호출
    console.log('신고 접수:', {
      reporterId: currentUserId,
      targetUserId: reportModalState.user.id,
      reason,
      details,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <ProfileClickProvider onProfileClick={showProfileDropdown}>
      {children}

      {/* 프로필 드롭다운 */}
      <UserProfileDropdown
        user={dropdownState.user}
        isVisible={dropdownState.isVisible}
        onClose={hideProfileDropdown}
        onViewProfile={() => openProfileModal()}
        onStartChat={() => handleStartChat(dropdownState.user?.id)}
        onReport={() => openReportModal()}
        position={dropdownState.position}
      />

      {/* 프로필 상세 모달 */}
      <UserProfileModal
        user={profileModalState.user}
        isOpen={profileModalState.isOpen}
        onClose={closeProfileModal}
        onStartChat={() => handleStartChat(profileModalState.user?.id)}
        onReport={() => openReportModal(profileModalState.user?.id)}
        currentUserId={currentUserId}
        onViewNestedProfile={handleViewNestedProfile}
      />

      {/* 신고 모달 */}
      <ReportModal
        user={reportModalState.user}
        isOpen={reportModalState.isOpen}
        onClose={closeReportModal}
        onReport={handleReport}
      />
    </ProfileClickProvider>
  );
};

// 사용자 프로필 클릭 가능한 컴포넌트들을 위한 HOC
export const withProfileClick = <P extends object>(
  Component: React.ComponentType<P>,
  getUserIdFromProps: (props: P) => number
) => {
  return React.forwardRef<any, P & { onProfileClick?: (userId: number, event: React.MouseEvent) => void }>((props, ref) => {
    const { onProfileClick, ...restProps } = props;
    const userId = getUserIdFromProps(restProps as P);

    const handleClick = (event: React.MouseEvent) => {
      onProfileClick?.(userId, event);
    };

    return (
      <Component
        {...(restProps as P)}
        ref={ref}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />
    );
  });
};

export default UserProfileSystem;
