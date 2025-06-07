import React from 'react';
import { Avatar } from '@heroui/react';
import { User } from '../../data/mockData';

interface UserProfileClickableProps {
  user: User;
  onProfileClick?: (userId: number, event: React.MouseEvent) => void;
  showName?: boolean;
  avatarSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

// 클릭 가능한 사용자 프로필 컴포넌트
const UserProfileClickable: React.FC<UserProfileClickableProps> = ({
  user,
  onProfileClick,
  showName = true,
  avatarSize = 'sm',
  className = ''
}) => {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onProfileClick?.(user.id, event);
  };

  return (
    <div 
      className={`flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition-colors ${className}`}
      onClick={handleClick}
    >
      <div className="relative">
        <Avatar src={user.avatar} size={avatarSize} />
        {user.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
      {showName && (
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{user.name}</div>
          {user.location && (
            <div className="text-xs text-gray-500 truncate">{user.location}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfileClickable;