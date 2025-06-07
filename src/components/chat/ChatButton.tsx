import React from 'react';
import { Icon } from '@iconify/react';
import { useAppContext } from '../../context/AppContext';

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, isOpen }) => {
  const { closeChatModal } = useAppContext();

  // 모바일에서 채팅창이 열려있으면 버튼 숨김
  if (isOpen) {
    return (
      <div className="sm:block hidden">
        <div 
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer z-[9999] hover:scale-105"
          onClick={closeChatModal}
        >
          <Icon icon="lucide:x" className="text-xl text-white" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer z-[9999] hover:scale-105"
      onClick={onClick}
    >
      <Icon icon="lucide:message-circle" className="text-xl text-white" />
    </div>
  );
};

export default ChatButton;