import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/home';
import ClassesPage from './pages/classes';
import MoimPage from './pages/moim';
import CommunityPage from './pages/community';
import SchedulePage from './pages/schedule';
import ScheduleDetailPage from './pages/schedule-detail';
import ProfilePage from './pages/profile';
import ChatPage from './pages/chat';
import ClassDetailPage from './pages/class-detail';
import MoimDetailPage from './pages/moim-detail';
import CommunityPostDetailPage from './pages/community-post-detail';
import ChatButton from './components/chat/ChatButton';
import ChatWindow from './components/chat/ChatWindow';
import ScrollToTop from './components/common/ScrollToTop';
import UserProfileSystem from './components/profile/UserProfileSystem';
import { AppContextProvider, useAppContext } from './context/AppContext';
import { handleLoginSuccess } from './utils/auth';

const AppContent: React.FC = () => {
  const { isChatModalOpen, setIsChatModalOpen } = useAppContext();

  // 앱 시작 시 로그인 성공 처리
  React.useEffect(() => {
    handleLoginSuccess().then((success) => {
      if (success) {
        console.log('로그인 완료!');
        // 필요시 추가 처리 (예: 사용자 정보 로드)
      }
    });
  }, []);

  const handleChatButtonClick = () => {
    setIsChatModalOpen(!isChatModalOpen);
  };

  // 채팅 시작 핸들러
  const handleStartChat = (userId: number) => {
    // 채팅 모달 열기
    setIsChatModalOpen(true);
    
    // 실제로는 해당 사용자와의 채팅방을 여는 로직 구현
    console.log(`${userId}번 사용자와 채팅 시작`);
  };

  return (
    <UserProfileSystem
      currentUserId={1} // 현재 로그인한 사용자 ID (실제로는 Context에서 가져와야 함)
      onStartChat={handleStartChat}
    >
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        <Header />
        <motion.main 
          className="flex-grow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/class-detail/:id" element={<ClassDetailPage />} />
            <Route path="/moim" element={<MoimPage />} />
            <Route path="/moim-detail/:id" element={<MoimDetailPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community-post-detail/:id" element={<CommunityPostDetailPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/schedule-detail/:id" element={<ScheduleDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </motion.main>
        <Footer />
        
        {/* 채팅 버튼 - 항상 표시, 열기/닫기 토글 */}
        <ChatButton 
          onClick={handleChatButtonClick}
          isOpen={isChatModalOpen}
        />
        
        {/* 채팅 창 - 전역 상태로 관리되어 페이지 이동해도 유지됨 */}
        <ChatWindow />
      </div>
    </UserProfileSystem>
  );
};

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
};

export default App;