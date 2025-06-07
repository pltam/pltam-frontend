import React, { createContext, useContext } from 'react';

interface ProfileClickContextType {
  onProfileClick: (userId: number, event: React.MouseEvent) => void;
}

const ProfileClickContext = createContext<ProfileClickContextType | undefined>(undefined);

export const useProfileClick = () => {
  const context = useContext(ProfileClickContext);
  if (!context) {
    console.error('useProfileClick must be used within a ProfileClickProvider');
    throw new Error('useProfileClick must be used within a ProfileClickProvider');
  }
  return context;
};

interface ProfileClickProviderProps {
  children: React.ReactNode;
  onProfileClick: (userId: number, event: React.MouseEvent) => void;
}

// 프로필 클릭 이벤트를 전달하는 Context Provider
export const ProfileClickProvider: React.FC<ProfileClickProviderProps> = ({
  children,
  onProfileClick
}) => {
  return (
    <ProfileClickContext.Provider value={{ onProfileClick }}>
      {children}
    </ProfileClickContext.Provider>
  );
};

export default ProfileClickProvider;