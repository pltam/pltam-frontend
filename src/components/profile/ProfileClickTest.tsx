import React from 'react';
import { Avatar, Card, CardBody } from '@heroui/react';
import { useProfileClick } from './ProfileClickProvider';

// 프로필 클릭 테스트 컴포넌트
const ProfileClickTest: React.FC = () => {
  const { onProfileClick } = useProfileClick();

  const testUsers = [
    { id: 101, name: '김기타', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=101' },
    { id: 102, name: '박요가', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=102' },
    { id: 103, name: '이등산', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=103' },
  ];

  const handleTestClick = (userId: number, event: React.MouseEvent) => {
    console.log('Test profile click:', userId);
    onProfileClick(userId, event);
  };

  return (
    <Card className="m-4">
      <CardBody className="p-6">
        <h3 className="text-lg font-bold mb-4">프로필 클릭 테스트</h3>
        <div className="flex gap-4">
          {testUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
              onClick={(e) => handleTestClick(user.id, e)}
            >
              <Avatar src={user.avatar} size="sm" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          위의 프로필을 클릭하면 드롭다운이 나와야 합니다.
        </p>
      </CardBody>
    </Card>
  );
};

export default ProfileClickTest;