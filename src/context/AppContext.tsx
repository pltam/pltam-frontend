import React from 'react';
import { Category, SubCategory, BoardType } from '../types/category';
import { categories } from '../data/categories';
import { boardTypes } from '../data/boardTypes';

interface ChatMessage {
  id: number;
  text: string;
  type: 'sent' | 'received';
  timestamp: string;
  senderName?: string;
  senderId?: string;
  unreadCount?: number;
}

interface ChatParticipant {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  role?: 'member' | 'admin';
}

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  unreadCount: number;
  avatar: string;
  isGroup: boolean;
  timestamp: string;
  isOnline?: boolean;
  memberCount?: number;
  userId?: number;
  participants?: ChatParticipant[];
}

interface AppContextType {
  categories: Category[];
  boardTypes: BoardType[];
  selectedCategory: Category | null;
  selectedSubCategory: SubCategory | null;
  selectedBoardType: BoardType | null;
  isAuthenticated: boolean;
  isSearchModalOpen: boolean;
  isFilterModalOpen: boolean;
  isProfileModalOpen: boolean;
  isChatModalOpen: boolean;
  chatSelectedTab: string;
  chatSelectedRoom: ChatRoom | null;
  chatMessages: ChatMessage[];
  chatSettings: {
    translation: boolean;
    notificationSound: boolean;
    chatNotification: boolean;
    emailNotification: boolean;
  };
  regions: string[];
  setSelectedCategory: (category: Category | null) => void;
  setSelectedSubCategory: (subCategory: SubCategory | null) => void;
  setSelectedBoardType: (boardType: BoardType | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsSearchModalOpen: (isOpen: boolean) => void;
  setIsFilterModalOpen: (isOpen: boolean) => void;
  setIsProfileModalOpen: (isOpen: boolean) => void;
  setIsChatModalOpen: (isOpen: boolean) => void;
  setChatSelectedTab: (tab: string) => void;
  setChatSelectedRoom: (room: ChatRoom | null) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatSettings: (settings: any) => void;
  closeChatModal: () => void;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = React.useState<SubCategory | null>(null);
  const [selectedBoardType, setSelectedBoardType] = React.useState<BoardType | null>(boardTypes[0]);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState<boolean>(false);
  const [isChatModalOpen, setIsChatModalOpen] = React.useState<boolean>(false);
  
  // 채팅 관련 상태
  const [chatSelectedTab, setChatSelectedTab] = React.useState<string>("chatbot");
  const [chatSelectedRoom, setChatSelectedRoom] = React.useState<ChatRoom | null>(null);
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
  const [chatSettings, setChatSettings] = React.useState({
    translation: true,
    notificationSound: true,
    chatNotification: true,
    emailNotification: false,
  });

  const regions = [
    '서울', '경기', '인천', '강원', '충북', '충남', '세종', '대전', 
    '광주', '전북', '경북', '대구', '제주', '전남', '경남/울산', '부산', '온라인'
  ];

  // 채팅 메시지 추가 함수
  const addChatMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };

  // 채팅창 닫기 시 채팅방 초기화 함수
  const closeChatModal = () => {
    setIsChatModalOpen(false);
    // 채팅방에 있었다면 초기화
    if (chatSelectedRoom) {
      setChatSelectedRoom(null);
      setChatMessages([]);
      setChatSelectedTab('chat-rooms'); // 다음에 열 때 채팅방 목록 표시
    }
  };

  // 로컬 스토리지에서 채팅 설정 로드
  React.useEffect(() => {
    const savedSettings = {
      translation: localStorage.getItem('chat_translation') !== 'false',
      notificationSound: localStorage.getItem('chat_notificationSound') !== 'false',
      chatNotification: localStorage.getItem('chat_chatNotification') !== 'false',
      emailNotification: localStorage.getItem('chat_emailNotification') === 'true',
    };
    setChatSettings(savedSettings);
  }, []);

  const value = {
    categories,
    boardTypes,
    selectedCategory,
    selectedSubCategory,
    selectedBoardType,
    isAuthenticated,
    isSearchModalOpen,
    isFilterModalOpen,
    isProfileModalOpen,
    isChatModalOpen,
    chatSelectedTab,
    chatSelectedRoom,
    chatMessages,
    chatSettings,
    regions,
    setSelectedCategory,
    setSelectedSubCategory,
    setSelectedBoardType,
    setIsAuthenticated,
    setIsSearchModalOpen,
    setIsFilterModalOpen,
    setIsProfileModalOpen,
    setIsChatModalOpen,
    setChatSelectedTab,
    setChatSelectedRoom,
    setChatMessages,
    addChatMessage,
    setChatSettings,
    closeChatModal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};