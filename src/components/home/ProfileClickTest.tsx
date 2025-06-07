import React from 'react';
import { Card, CardBody, Avatar } from '@heroui/react';
import { useProfileClick } from '../profile/ProfileClickProvider';
import UserProfileClickable from '../profile/UserProfileClickable';
import { mockUsers } from '../../data/mockData';

const ProfileClickTest: React.FC = () => {
  const { onProfileClick } = useProfileClick();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">프로필 클릭 테스트</h2>
        <p className="text-gray-600">아래 프로필을 클릭해보세요!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockUsers.slice(0, 6).map((user) => (
          <Card key={user.id} className="p-4">
            <CardBody>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-4">방법 1: UserProfileClickable 사용</h3>
                <UserProfileClickable
                  user={user}
                  onProfileClick={onProfileClick}
                  showName={true}
                  avatarSize="lg"
                  className="justify-center"
                />
              </div>
              
              <div className="text-center border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">방법 2: 직접 클릭 핸들러</h3>
                <div 
                  className="flex items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-3 transition-colors"
                  onClick={(e) => onProfileClick(user.id, e)}
                >
                  <div className="relative">
                    <Avatar src={user.avatar} size="lg" />
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.location}</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-4 text-xs text-gray-400">
                팔로워: {user.followerCount} | 팔로잉: {user.followingCount}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">테스트 가이드</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 프로필을 클릭하면 드롭다운 메뉴가 나타납니다</li>
          <li>• "프로필 상세보기"를 클릭하면 상세 모달이 열립니다</li>
          <li>• "1:1 채팅"을 클릭하면 채팅창이 열립니다</li>
          <li>• "신고하기"를 클릭하면 신고 모달이 열립니다</li>
          <li>• ESC 키나 외부 클릭으로 드롭다운을 닫을 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileClickTest;