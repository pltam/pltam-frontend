import React from 'react';
import { 
  Button, 
  Card,
  CardBody,
  Avatar,
  Switch,
  Textarea,
  Divider
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAppContext } from '../../context/AppContext';
import { mockChatRooms, getUserById } from '../../data/mockData';
import UserProfileModal from '../profile/UserProfileModal';
import ReportModal from '../profile/ReportModal';
import ProfileEditModal from '../profile/ProfileEditModal';
import LanguageSelectModal from './LanguageSelectModal';
import ConfirmModal from './ConfirmModal';
import ToastNotification from './ToastNotification';

interface ChatMessage {
  id: number;
  text: string;
  type: 'sent' | 'received';
  timestamp: string;
  senderName?: string;
  senderId?: string;
  unreadCount?: number; // 읽지 않은 사람 수
}

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  unreadCount: number;
  avatar: string;
  isGroup: boolean;
  timestamp: string;
  userId?: number;
  memberCount?: number;
  participants?: Array<{
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    role?: 'admin' | 'member';
  }>;
}

const ChatWindow: React.FC = () => {
  const {
    isChatModalOpen,
    setIsChatModalOpen,
    chatSelectedTab,
    setChatSelectedTab,
    chatSelectedRoom,
    setChatSelectedRoom,
    chatMessages,
    setChatMessages,
    addChatMessage,
    chatSettings,
    setChatSettings,
    closeChatModal
  } = useAppContext();

  // 메시지 스크롤 ref
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);

  const [inputMessage, setInputMessage] = React.useState('');
  const [showParticipants, setShowParticipants] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<ChatMessage[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = React.useState(0);
  
  // 프로필 모달 상태
  const [profileModalState, setProfileModalState] = React.useState<{
    isOpen: boolean;
    user: any | null;
  }>({
    isOpen: false,
    user: null
  });

  // 신고 모달 상태
  const [reportModalState, setReportModalState] = React.useState<{
    isOpen: boolean;
    user: any | null;
  }>({
    isOpen: false,
    user: null
  });

  // 사용자 정보 수정 모달 상태
  const [userInfoEditModal, setUserInfoEditModal] = React.useState(false);

  // 언어 선택 모달 상태
  const [languageSelectModal, setLanguageSelectModal] = React.useState(false);

  // 현재 사용자 정보 상태
  const [currentUserInfo, setCurrentUserInfo] = React.useState({
    name: '사용자',
    email: 'user@example.com',
    phone: '010-1234-5678',
    bio: '안녕하세요! 플탐을 이용하고 있습니다.',
    avatar: 'https://cf.channel.io/avatar/emoji/umbrella.f392e0.png'
  });

  // 선택된 언어 상태
  const [selectedLanguage, setSelectedLanguage] = React.useState('ko');

  // 확인 모달 상태
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'warning' | 'danger' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  });

  // 토스트 알림 상태
  const [toast, setToast] = React.useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // 컴포넌트 마운트 시 localStorage에서 설정 로드
  React.useEffect(() => {
    // 언어 설정 로드
    const savedLanguage = localStorage.getItem('chat_language');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }

    // 사용자 정보 로드 (실제로는 API에서 가져와야 함)
    const savedUserInfo = localStorage.getItem('chat_userInfo');
    if (savedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(savedUserInfo);
        setCurrentUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    }

    // 브라우저 알림 권한 요청
    if (chatSettings.chatNotification && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // 토스트 알림 표시
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  // 확인 모달 표시
  const showConfirm = (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    type: 'warning' | 'danger' | 'info' = 'warning'
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      type
    });
  };

  // 새 메시지 알림 표시
  const showMessageNotification = (message: ChatMessage, roomName: string) => {
    if (!chatSettings.chatNotification) return;
    
    // 알림음 재생
    if (chatSettings.notificationSound) {
      playNotificationSound();
    }

    // 브라우저 알림 표시
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(`${roomName}에서 새 메시지`, {
        body: `${message.senderName}: ${message.text}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // 5초 후 자동 닫기
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  };

  // 언어 감지 함수 (개선된 버전)
  const detectLanguage = (text: string): string => {
    console.log(`🔍 언어 감지 시도: "${text}"`);
    
    // 텍스트가 비어있거나 너무 짧으면 기본값 반환
    if (!text || text.trim().length < 2) {
      console.log('⚠️ 텍스트가 너무 짧음, 한국어로 기본 설정');
      return 'ko';
    }
    
    const cleanText = text.trim();
    
    // 영어 감지 (알파벳만 있고 한글이 없는 경우)
    if (/^[A-Za-z\s\.\?\!\'\",\-\(\)0-9]+$/.test(cleanText) && !/[가-힣]/.test(cleanText)) {
      console.log('✅ 영어로 감지됨');
      return 'en';
    }
    
    // 일본어 감지 (히라가나, 가타가나 포함)
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(cleanText)) {
      console.log('✅ 일본어로 감지됨');
      return 'ja';
    }
    
    // 중국어 감지 (한자만 있고 한글이 없는 경우)
    if (/[\u4E00-\u9FFF]/.test(cleanText) && !/[가-힣]/.test(cleanText) && !/[\u3040-\u309F\u30A0-\u30FF]/.test(cleanText)) {
      console.log('✅ 중국어로 감지됨');
      return 'zh';
    }
    
    // 스페인어 감지 (특수 문자 포함)
    if (/[ñáéíóúüÑÁÉÍÓÚÜ]/.test(cleanText)) {
      console.log('✅ 스페인어로 감지됨');
      return 'es';
    }
    
    // 프랑스어 감지 (특수 문자 포함)
    if (/[àâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]/.test(cleanText)) {
      console.log('✅ 프랑스어로 감지됨');
      return 'fr';
    }
    
    // 독일어 감지 (특수 문자 포함)
    if (/[äöüßÄÖÜ]/.test(cleanText)) {
      console.log('✅ 독일어로 감지됨');
      return 'de';
    }
    
    // 러시아어 감지 (키릴 문자)
    if (/[\u0400-\u04FF]/.test(cleanText)) {
      console.log('✅ 러시아어로 감지됨');
      return 'ru';
    }
    
    // 한국어 감지 (한글 포함)
    if (/[가-힣]/.test(cleanText)) {
      console.log('✅ 한국어로 감지됨');
      return 'ko';
    }
    
    // 기본값은 영어 (알파벳이 포함된 경우)
    if (/[A-Za-z]/.test(cleanText)) {
      console.log('⚠️ 구체적 언어 감지 실패, 영어로 기본 설정');
      return 'en';
    }
    
    // 최후의 기본값은 한국어
    console.log('⚠️ 언어 감지 완전 실패, 한국어로 기본 설정');
    return 'ko';
  };

  // 브라우저 AI 번역 함수 (개선된 버전)
  const translateWithBrowserAI = async (text: string, targetLanguage: string, sourceLanguage: string = 'auto'): Promise<string> => {
    try {
      // @ts-ignore - Chrome의 실험적 Translation API
      if ('ai' in window && 'translation' in window.ai) {
        // @ts-ignore
        const canTranslate = await window.ai.translation.canTranslate({
          sourceLanguage: sourceLanguage === 'auto' ? detectLanguage(text) : sourceLanguage,
          targetLanguage: targetLanguage
        });

        if (canTranslate === 'no') {
          throw new Error(`Translation from ${sourceLanguage} to ${targetLanguage} not supported`);
        }

        // @ts-ignore
        const translator = await window.ai.translation.createTranslator({
          sourceLanguage: sourceLanguage === 'auto' ? detectLanguage(text) : sourceLanguage,
          targetLanguage: targetLanguage
        });

        const result = await translator.translate(text);
        if (result && result.trim() && result !== text) {
          return result;
        }
      }
      throw new Error('Browser AI translation not available');
    } catch (error) {
      console.log('Browser AI 번역 실패:', error);
      throw error;
    }
  };

  // 브라우저 AI 사용 가능 여부 확인 (더 상세한 로그)
  const checkBrowserAIAvailable = (): boolean => {
    try {
      console.log('🔍 Browser AI 사용 가능 여부 확인...');
      console.log('브라우저:', navigator.userAgent);
      
      // window.ai 존재 확인
      if (!('ai' in window)) {
        console.log('❌ window.ai가 존재하지 않음 - Chrome의 Translation API 플래그가 비활성화된 것 같습니다');
        console.log('💡 해결방법: chrome://flags/#translation-api 에서 Enabled로 설정 후 Chrome 재시작');
        return false;
      }
      
      console.log('✅ window.ai 존재함');
      
      // @ts-ignore
      if (!window.ai) {
        console.log('❌ window.ai가 null 또는 undefined');
        return false;
      }
      
      // @ts-ignore
      console.log('window.ai 객체:', window.ai);
      
      // @ts-ignore
      if (!('translation' in window.ai)) {
        console.log('❌ window.ai.translation이 존재하지 않음');
        // @ts-ignore
        console.log('사용 가능한 window.ai 속성들:', Object.keys(window.ai));
        return false;
      }
      
      console.log('✅ Browser AI Translation API 사용 가능');
      return true;
    } catch (error) {
      console.log('❌ Browser AI 확인 중 오류:', error);
      return false;
    }
  };

  // 무제한 번역 API들 (CORS 우회 방법들) - 소스 언어 지원 + 개선된 오류 처리
  const translateWithFreeGoogle = async (text: string, targetLanguage: string, sourceLanguage: string = 'auto'): Promise<string> => {
    try {
      const detectedSource = sourceLanguage === 'auto' ? detectLanguage(text) : sourceLanguage;
      console.log(`🌐 Google Translate 시도: ${detectedSource} -> ${targetLanguage}`);
      
      // Google Translate 무료 엔드포인트 (여러 방법 시도)
      const methods = [
        // 방법 1: 기본 Google Translate API
        async () => {
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${detectedSource}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
          console.log('🔗 Google API 1 시도:', url);
          const response = await fetch(url);
          return response;
        },
        
        // 방법 2: 다른 클라이언트
        async () => {
          const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${detectedSource}&tl=${targetLanguage}&q=${encodeURIComponent(text)}`;
          console.log('🔗 Google API 2 시도:', url);
          const response = await fetch(url);
          return response;
        },
        
        // 방법 3: translate.google.com
        async () => {
          const url = `https://translate.google.com/translate_a/single?client=gtx&sl=${detectedSource}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}&ie=UTF-8&oe=UTF-8`;
          console.log('🔗 Google API 3 시도:', url);
          const response = await fetch(url);
          return response;
        }
      ];

      for (let i = 0; i < methods.length; i++) {
        try {
          console.log(`🌐 Google 방법 ${i + 1} 시도 중...`);
          const response = await methods[i]();
          
          if (response.ok) {
            const data = await response.json();
            console.log('📥 Google 응답 데이터:', data);
            
            if (data && data[0] && data[0][0] && data[0][0][0]) {
              const translated = data[0][0][0].trim();
              if (translated && translated !== text) {
                console.log(`✅ Google 방법 ${i + 1} 성공:`, translated);
                return translated;
              }
            }
          } else {
            console.log(`❌ Google 방법 ${i + 1} HTTP 오류:`, response.status, response.statusText);
          }
        } catch (methodError) {
          console.log(`❌ Google 방법 ${i + 1} 실패:`, methodError);
          continue; // 다음 방법 시도
        }
      }
      
      throw new Error('All Google Translate methods failed');
    } catch (error) {
      console.log('❌ Google Translate (free) 전체 실패:', error);
      throw error;
    }
  };

  // Microsoft Translator (무료 방법) - 소스 언어 지원
  const translateWithBing = async (text: string, targetLanguage: string, sourceLanguage: string = 'auto'): Promise<string> => {
    try {
      const detectedSource = sourceLanguage === 'auto' ? detectLanguage(text) : sourceLanguage;
      
      // Bing 번역 무료 엔드포인트
      const response = await fetch('https://www.bing.com/ttranslatev3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          fromLang: detectedSource,
          to: targetLanguage,
          text: text
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data[0] && data[0].translations && data[0].translations[0]) {
          const translated = data[0].translations[0].text.trim();
          if (translated && translated !== text) {
            return translated;
          }
        }
      }
      
      throw new Error('Bing Translate failed');
    } catch (error) {
      console.log('Bing Translate 실패:', error);
      throw error;
    }
  };

  // Yandex Translate (무료 방법) - 소스 언어 지원
  const translateWithYandex = async (text: string, targetLanguage: string, sourceLanguage: string = 'auto'): Promise<string> => {
    try {
      const detectedSource = sourceLanguage === 'auto' ? detectLanguage(text) : sourceLanguage;
      const response = await fetch(`https://translate.yandex.net/api/v1/tr.json/translate?id=487dd75e.651a4acd.74dd0f82-0-0&srv=tr-text&lang=${detectedSource}-${targetLanguage}&text=${encodeURIComponent(text)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.text && data.text[0]) {
          const translated = data.text[0].trim();
          if (translated && translated !== text) {
            return translated;
          }
        }
      }
      
      throw new Error('Yandex Translate failed');
    } catch (error) {
      console.log('Yandex Translate 실패:', error);
      throw error;
    }
  };

  // LibreTranslate (오픈소스 번역 서비스) - 무료
  const translateWithLibreTranslate = async (text: string, targetLanguage: string, sourceLanguage: string = 'auto'): Promise<string> => {
    try {
      const detectedSource = sourceLanguage === 'auto' ? detectLanguage(text) : sourceLanguage;
      console.log(`🔓 LibreTranslate 시도: ${detectedSource} -> ${targetLanguage}`);
      
      // 여러 LibreTranslate 인스턴스 시도
      const instances = [
        'https://libretranslate.de/translate',
        'https://translate.argosopentech.com/translate',
        'https://libretranslate.com/translate'
      ];
      
      for (const apiUrl of instances) {
        try {
          console.log(`🔗 LibreTranslate 인스턴스 시도: ${apiUrl}`);
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              q: text,
              source: detectedSource,
              target: targetLanguage,
              format: 'text'
            })
          });

          if (response.ok) {
            const data = await response.json();
            console.log('📥 LibreTranslate 응답:', data);
            
            if (data.translatedText) {
              const translated = data.translatedText.trim();
              if (translated && translated !== text) {
                console.log(`✅ LibreTranslate 성공: "${translated}"`);
                return translated;
              }
            }
          } else {
            console.log(`❌ LibreTranslate HTTP 오류:`, response.status, response.statusText);
          }
        } catch (instanceError) {
          console.log(`❌ LibreTranslate 인스턴스 실패:`, instanceError);
          continue;
        }
      }
      
      throw new Error('All LibreTranslate instances failed');
    } catch (error) {
      console.log('❌ LibreTranslate 전체 실패:', error);
      throw error;
    }
  };

  // MyMemory API (제한된 사용) - 소스 언어 지원
  const translateWithMyMemory = async (text: string, targetLanguage: string, sourceLanguage: string = 'auto'): Promise<string> => {
    try {
      const detectedSource = sourceLanguage === 'auto' ? detectLanguage(text) : sourceLanguage;
      console.log(`📝 MyMemory 시도: ${detectedSource} -> ${targetLanguage}`);
      
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${detectedSource}|${targetLanguage}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`MyMemory HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 MyMemory 응답:', data);
      
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        const translated = data.responseData.translatedText.trim();
        if (translated && translated !== text) {
          console.log(`✅ MyMemory 성공: "${translated}"`);
          return translated;
        }
      }
      
      throw new Error('MyMemory translation failed or returned empty');
    } catch (error) {
      console.log('❌ MyMemory 번역 실패:', error);
      throw error;
    }
  };

  // 메시지 번역 상태 관리
  const [translatedTexts, setTranslatedTexts] = React.useState<{[key: string]: string}>({});
  const [translatingIds, setTranslatingIds] = React.useState<Set<number>>(new Set());

  // 통합 번역 함수 (하드코딩 번역 제거)
  const translateMessage = async (messageId: number, text: string, targetLanguage: string): Promise<string> => {
    // 고유한 캐시 키 생성 (채팅방 ID 포함)
    const cacheKey = `${chatSelectedRoom?.id || 'unknown'}-${messageId}-${text}-${targetLanguage}`;
    
    // 캐시된 번역이 있으면 사용
    if (translatedTexts[cacheKey]) {
      console.log('💾 캐시된 번역 사용:', translatedTexts[cacheKey]);
      return translatedTexts[cacheKey];
    }

    console.log(`🔄 번역 시작: "${text}" -> ${targetLanguage}`);

    // 원문 언어 감지
    const sourceLanguage = detectLanguage(text);
    console.log(`🔍 감지된 언어: ${sourceLanguage} (원문: "${text}")`);

    // 같은 언어면 번역하지 않음
    if (sourceLanguage === targetLanguage) {
      console.log(`⏭️ 같은 언어이므로 번역 생략 (${sourceLanguage} -> ${targetLanguage})`);
      
      // 번역 중 상태 해제
      setTranslatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
      
      return text;
    }

    // 번역 중 상태 설정
    setTranslatingIds(prev => new Set(prev).add(messageId));

    try {
      let translatedText = '';

      // 1순위: Browser AI Translation (Chrome에서만)
      const browserAIAvailable = checkBrowserAIAvailable();
      console.log('🔍 Browser AI 사용 가능:', browserAIAvailable);
      
      if (browserAIAvailable) {
        try {
          console.log('🤖 Browser AI 번역 시도...');
          translatedText = await translateWithBrowserAI(text, targetLanguage, sourceLanguage);
          console.log('✅ Browser AI 번역 성공:', translatedText);
        } catch (error) {
          console.log('❌ Browser AI 실패:', error);
        }
      } else {
        console.log('⏭️ Browser AI 사용 불가, Google Translate로 건너뜀');
      }

      // 2순위: Google Translate (무료, 무제한)
      if (!translatedText) {
        try {
          console.log('🌐 Google Translate (free) 시도...');
          translatedText = await translateWithFreeGoogle(text, targetLanguage, sourceLanguage);
          console.log('✅ Google Translate (free) 성공:', translatedText);
        } catch (error) {
          console.log('❌ Google Translate (free) 실패:', error);
        }
      }

      // 3순위: Bing Translate (무료, 무제한)
      if (!translatedText) {
        try {
          console.log('🔵 Bing Translate 시도...');
          translatedText = await translateWithBing(text, targetLanguage, sourceLanguage);
          console.log('✅ Bing Translate 성공:', translatedText);
        } catch (error) {
          console.log('❌ Bing Translate 실패:', error);
        }
      }

      // 4순위: Yandex Translate (무료, 무제한)
      if (!translatedText) {
        try {
          console.log('🟡 Yandex Translate 시도...');
          translatedText = await translateWithYandex(text, targetLanguage, sourceLanguage);
          console.log('✅ Yandex Translate 성공:', translatedText);
        } catch (error) {
          console.log('❌ Yandex Translate 실패:', error);
        }
      }

      // 5순위: LibreTranslate (오픈소스)
      if (!translatedText) {
        try {
          console.log('🔓 LibreTranslate 시도...');
          translatedText = await translateWithLibreTranslate(text, targetLanguage, sourceLanguage);
          console.log('✅ LibreTranslate 성공:', translatedText);
        } catch (error) {
          console.log('❌ LibreTranslate 실패:', error);
        }
      }

      // 6순위: MyMemory API (제한적 사용)
      if (!translatedText) {
        try {
          console.log('📝 MyMemory 번역 시도... (제한적)');
          translatedText = await translateWithMyMemory(text, targetLanguage, sourceLanguage);
          console.log('✅ MyMemory 번역 성공:', translatedText);
        } catch (error) {
          console.log('❌ MyMemory 실패:', error);
        }
      }

      // 모든 번역 서비스 실패 시
      if (!translatedText) {
        console.log('❌ 모든 번역 서비스 실패');
        const languageNames: { [key: string]: string } = {
          'en': 'English',
          'ja': '日本語', 
          'zh': '中文',
          'es': 'Español',
          'fr': 'Français',
          'de': 'Deutsch',
          'ru': 'Русский',
          'ko': '한국어'
        };
        translatedText = `[번역 실패: ${languageNames[targetLanguage] || targetLanguage}]`;
      }

      // 번역 결과 캐시에 저장 (고유한 키로)
      setTranslatedTexts(prev => ({
        ...prev,
        [cacheKey]: translatedText
      }));

      return translatedText;

    } catch (error) {
      console.error('❌ 번역 전체 실패:', error);
      const languageNames: { [key: string]: string } = {
        'en': 'English',
        'ja': '日本語', 
        'zh': '中文',
        'es': 'Español',
        'fr': 'Français',
        'de': 'Deutsch',
        'ru': 'Русский',
        'ko': '한국어'
      };
      return `[번역 오류: ${languageNames[targetLanguage] || targetLanguage}]`;
    } finally {
      // 번역 중 상태 해제
      setTranslatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  // 채팅방이 닫혀있으면 렌더링하지 않음
  if (!isChatModalOpen) return null;

  // 프로필 모달 열기
  const openProfileModal = (userId: number) => {
    console.log('Opening profile modal for user:', userId);
    const user = getUserById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return;
    }

    setProfileModalState({
      isOpen: true,
      user
    });
  };

  // 프로필 모달 닫기
  const closeProfileModal = () => {
    setProfileModalState({
      isOpen: false,
      user: null
    });
  };

  // 1:1 채팅 시작 (프로필 모달에서)
  const handleStartChatFromProfile = (userId: number) => {
    // 이미 채팅창이므로 특별한 처리 불필요
    console.log('Start chat with user:', userId);
    closeProfileModal();
  };

  // 신고하기 (프로필 모달에서)
  const handleReportFromProfile = () => {
    const user = profileModalState.user;
    if (user) {
      setReportModalState({
        isOpen: true,
        user
      });
      closeProfileModal();
    }
  };

  // 신고 모달 닫기
  const closeReportModal = () => {
    setReportModalState({
      isOpen: false,
      user: null
    });
  };

  // 신고 처리
  const handleReport = (reason: string, details: string) => {
    if (!reportModalState.user) return;

    // 실제로는 API 호출
    console.log('신고 접수:', {
      targetUserId: reportModalState.user.id,
      reason,
      details,
      timestamp: new Date().toISOString()
    });

    showToast('신고가 접수되었습니다.', 'success');
    closeReportModal();
  };

  // 탭 변경
  const handleTabChange = (tab: string) => {
    setChatSelectedTab(tab);
    setChatSelectedRoom(null);
    setChatMessages([]);
  };

  // 채팅방 선택
  const handleRoomSelect = (room: any) => {
    setChatSelectedRoom(room);
    loadMessages(room.id);
  };

  // AI 챗봇 열기
  const handleOpenChatBot = () => {
    const aiRoom: ChatRoom = {
      id: 'ai-bot',
      name: '플탐 AI 도우미',
      avatar: 'https://cf.channel.io/thumb/200x200/pub-file/1/1/placeholder.svg',
      lastMessage: '',
      unreadCount: 0,
      isGroup: false,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };
    setChatSelectedRoom(aiRoom);
    setChatMessages([
      {
        id: 1,
        text: '안녕하세요! 플탐 AI 도우미입니다. 무엇을 도와드릴까요?',
        type: 'received',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        senderName: '플탐 AI 도우미',
        senderId: 'ai-bot',
        unreadCount: 0
      }
    ]);
  };

  // 메시지 로드
  const loadMessages = (roomId: string) => {
    const mockMessages: { [key: string]: ChatMessage[] } = {
      // 모임 채팅방
      'moim1': [
        { id: 1, text: '오늘 저녁 7시에 만나요!', type: 'received', timestamp: '19:00', senderName: '이민수', senderId: '104', unreadCount: 0 },
        { id: 2, text: '장소는 어디로 할까요?', type: 'received', timestamp: '19:01', senderName: '박지영', senderId: '105', unreadCount: 2 },
        { id: 3, text: '시청역 1번 출구 어떨까요?', type: 'sent', timestamp: '19:02', senderName: '나', senderId: 'me', unreadCount: 3 }
      ],
      'moim2': [
        { id: 1, text: '다음 주제는 알고리즘입니다', type: 'received', timestamp: '14:30', senderName: '김코더', senderId: '107', unreadCount: 1 },
        { id: 2, text: '자료구조와 관련된 문제를 풀어볼 예정입니다', type: 'received', timestamp: '14:31', senderName: '김코더', senderId: '107', unreadCount: 0 }
      ],
      'moim3': [
        { id: 1, text: '북한산 코스 정보 공유해요', type: 'received', timestamp: '08:00', senderName: '산악인', senderId: '103', unreadCount: 0 },
        { id: 2, text: '백운대 코스는 어떨까요?', type: 'sent', timestamp: '08:05', senderName: '나', senderId: 'me', unreadCount: 2 },
        { id: 3, text: '좋은 생각이에요! 날씨도 확인해보세요', type: 'received', timestamp: '08:10', senderName: '등반러버', senderId: '108', unreadCount: 1 }
      ],
      // 1:1 채팅방 (senderId를 'user1', 'user2', 'user3'로 설정)
      'user1': [
        { id: 1, text: '안녕하세요! 잘 부탁드립니다.', type: 'received', timestamp: '14:30', senderName: '김철수', senderId: 'user1', unreadCount: 0 },
        { id: 2, text: '네, 저도 잘 부탁드려요!', type: 'sent', timestamp: '14:31', senderName: '나', senderId: 'me', unreadCount: 1 },
        { id: 3, text: '언제 시간 되실 때 만나서 이야기해요', type: 'received', timestamp: '14:32', senderName: '김철수', senderId: 'user1', unreadCount: 0 }
      ],
      'user2': [
        { id: 1, text: 'Can I change the meeting time tomorrow?', type: 'received', timestamp: '11:45', senderName: '이영희', senderId: 'user2', unreadCount: 0 },
        { id: 2, text: 'What time do you want to change?', type: 'sent', timestamp: '11:50', senderName: '나', senderId: 'me', unreadCount: 1 }
      ],
      'user3': [
        { id: 1, text: '자료 공유해드렸습니다.', type: 'received', timestamp: '09:30', senderName: '박민수', senderId: 'user3', unreadCount: 0 },
        { id: 2, text: '감사합니다! 확인해보겠습니다.', type: 'sent', timestamp: '09:35', senderName: '나', senderId: 'me', unreadCount: 0 },
        { id: 3, text: '혹시 질문이 있으시면 언제든 연락주세요', type: 'received', timestamp: '09:40', senderName: '박민수', senderId: 'user3', unreadCount: 1 }
      ]
    };

    setChatMessages(mockMessages[roomId] || []);
  };

  // 메시지 전송
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // 참여자 수 계산 (1:1 채팅은 1명, 그룹 채팅은 전체 참여자 수 - 1)
    let unreadCount = 0;
    if (chatSelectedRoom?.id.startsWith('user')) {
      // 1:1 채팅
      unreadCount = 1;
    } else if (chatSelectedRoom?.id === 'ai-bot') {
      // AI 봇은 읽음 처리 안함
      unreadCount = 0;
    } else {
      // 그룹 채팅 - 참여자 수에서 자신 제외
      const participants = getParticipants(chatSelectedRoom?.id || '');
      unreadCount = participants.length;
    }

    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      text: inputMessage,
      type: 'sent',
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      senderName: '나',
      senderId: 'me',
      unreadCount: unreadCount
    };

    addChatMessage(newMessage);
    setInputMessage('');

    // AI 챗봇 응답 시뮬레이션
    if (chatSelectedRoom?.id === 'ai-bot') {
      setTimeout(() => {
        const botResponse: ChatMessage = {
          id: chatMessages.length + 2,
          text: '도움이 필요하신 내용을 자세히 알려주시면 답변드리겠습니다.',
          type: 'received',
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          senderName: '플탐 AI 도우미',
          senderId: 'ai-bot',
          unreadCount: 0
        };
        addChatMessage(botResponse);
        
        // AI 응답 알림 표시
        showMessageNotification(botResponse, '플탐 AI 도우미');
      }, 1000);
    }
  };

  // 메시지 발신자의 아바타 가져오기
  const getMessageSenderAvatar = (message: ChatMessage) => {
    // AI 봇인 경우
    if (message.senderId === 'ai-bot') {
      return 'https://cf.channel.io/thumb/200x200/pub-file/1/1/placeholder.svg';
    }
    
    // 1:1 채팅인 경우 상대방 아바타
    if (chatSelectedRoom?.id.startsWith('user')) {
      return chatSelectedRoom.avatar;
    }
    
    // 모임 채팅인 경우 실제 발신자 아바타
    if (message.senderId && message.senderId !== 'me') {
      const userId = parseInt(message.senderId);
      if (!isNaN(userId)) {
        const user = getUserById(userId);
        return user?.avatar || chatSelectedRoom?.avatar || '';
      }
    }
    
    return chatSelectedRoom?.avatar || '';
  };

  // 채팅방으로 돌아가기
  const handleBackToRooms = () => {
    setChatSelectedRoom(null);
    setChatMessages([]);
    setShowParticipants(false);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    setCurrentSearchIndex(0);
  };

  // 참여자 목록 표시/숨김
  const handleShowParticipants = () => {
    setShowParticipants(!showParticipants);
    setShowSearch(false);
  };

  // 검색 표시/숨김
  const handleShowSearch = () => {
    setShowSearch(!showSearch);
    setShowParticipants(false);
    if (!showSearch) {
      setSearchQuery('');
      setSearchResults([]);
      setCurrentSearchIndex(0);
    }
  };

  // 메시지 검색
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = chatMessages.filter(message => 
        message.text.toLowerCase().includes(query.toLowerCase()) ||
        message.senderName?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setCurrentSearchIndex(0);
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(0);
    }
  };

  // 다음/이전 검색 결과로 이동
  const navigateSearchResults = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = currentSearchIndex >= searchResults.length - 1 ? 0 : currentSearchIndex + 1;
    } else {
      newIndex = currentSearchIndex <= 0 ? searchResults.length - 1 : currentSearchIndex - 1;
    }
    
    setCurrentSearchIndex(newIndex);
    scrollToMessage(searchResults[newIndex].id);
  };

  // 검색 키워드 하이라이트 함수
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-300 font-semibold px-0.5 rounded">
          {part}
        </span>
      ) : part
    );
  };

  // 검색된 메시지 위치로 스크롤
  const scrollToMessage = (messageId: number) => {
    if (!messagesContainerRef.current) return;
    
    const messageElement = messagesContainerRef.current.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
      messageElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // 메시지 하이라이트 효과
      messageElement.classList.add('animate-pulse', 'bg-yellow-100', 'border-2', 'border-yellow-400', 'rounded-lg');
      setTimeout(() => {
        messageElement.classList.remove('animate-pulse', 'bg-yellow-100', 'border-2', 'border-yellow-400', 'rounded-lg');
      }, 2000);
      
      // 검색 모드 종료
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
      setCurrentSearchIndex(0);
    }
  };

  // 참여자 목록 가져오기 (mockData 사용)
  const getParticipants = (roomId: string) => {
    const room = mockChatRooms.find(r => r.id.toString() === roomId);
    if (!room || !room.participants) return [];
    
    return room.participants.map(p => ({
      id: p.id.toString(),
      name: p.name,
      avatar: p.avatar,
      isOnline: p.isOnline,
      role: p.role as 'admin' | 'member' | undefined
    }));
  };

  // 설정 변경
  const handleSettingChange = (key: string, value: boolean) => {
    const newSettings = {
      ...chatSettings,
      [key]: value
    };
    setChatSettings(newSettings);
    localStorage.setItem(`chat_${key}`, value.toString());
    
    // 설정별 맞춤 메시지
    const settingMessages: { [key: string]: string } = {
      translation: value ? '메시지 번역이 활성화되었습니다' : '메시지 번역이 비활성화되었습니다',
      notificationSound: value ? '알림음이 활성화되었습니다' : '알림음이 비활성화되었습니다',
      chatNotification: value ? '채팅 알림이 활성화되었습니다' : '채팅 알림이 비활성화되었습니다',
      emailNotification: value ? '이메일 알림이 활성화되었습니다' : '이메일 알림이 비활성화되었습니다'
    };
    
    showToast(settingMessages[key] || `${key} 설정이 변경되었습니다`, 'info');
    
    // 브라우저 알림 권한 요청 (채팅 알림 활성화 시)
    if (key === 'chatNotification' && value && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showToast('브라우저 알림이 허용되었습니다', 'success');
        } else {
          showToast('브라우저 알림이 차단되었습니다', 'warning');
        }
      });
    }
  };

  // 사용자 정보 수정 저장
  const handleUserInfoSave = (profileData: any) => {
    const userInfo = {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone || '010-1234-5678',
      bio: profileData.bio,
      avatar: profileData.avatar
    };
    
    setCurrentUserInfo(userInfo);
    
    // localStorage에 저장
    localStorage.setItem('chat_userInfo', JSON.stringify(userInfo));
    
    // 실제로는 API 호출하여 서버에 저장
    console.log('사용자 정보 수정됨:', userInfo);
    
    // 성공 알림
    showToast('사용자 정보가 성공적으로 수정되었습니다.', 'success');
  };

  // 언어 변경
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem('chat_language', language);
    
    const languageNames: { [key: string]: string } = {
      'ko': '한국어',
      'en': 'English',
      'ja': '日本語',
      'zh': '中文',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'ru': 'Русский'
    };
    
    console.log(`언어가 ${languageNames[language]}로 변경되었습니다.`);
    showToast(`언어가 ${languageNames[language]}로 변경되었습니다.`, 'success');
  };

  // 알림음 테스트
  const playNotificationSound = () => {
    // 브라우저에서 알림음 재생
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {
      // 파일이 없거나 재생 실패 시 여러 스타일 중 랜덤 선택
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const soundStyles = [
        // 스타일 1: 카카오톡 스타일 (도-미)
        () => {
          const playTone = (frequency: number, startTime: number, duration: number) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
          };
          
          const now = audioContext.currentTime;
          playTone(523.25, now, 0.15); // 도 (C5)
          playTone(659.25, now + 0.1, 0.2); // 미 (E5)
        },
        
        // 스타일 2: 디스코드 스타일 (단일 톤)
        () => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 587.33; // D5
          oscillator.type = 'triangle';
          
          const now = audioContext.currentTime;
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          
          oscillator.start(now);
          oscillator.stop(now + 0.4);
        },
        
        // 스타일 3: 애플 스타일 (트라이톤)
        () => {
          const playChord = (frequencies: number[], startTime: number, duration: number) => {
            frequencies.forEach(freq => {
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              oscillator.frequency.value = freq;
              oscillator.type = 'sine';
              
              gainNode.gain.setValueAtTime(0, startTime);
              gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
              gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
              
              oscillator.start(startTime);
              oscillator.stop(startTime + duration);
            });
          };
          
          const now = audioContext.currentTime;
          playChord([440, 554.37], now, 0.25); // A4 + C#5
        }
      ];
      
      // 랜덤으로 알림음 스타일 선택
      const randomStyle = soundStyles[Math.floor(Math.random() * soundStyles.length)];
      randomStyle();
      
      console.log('🔔 알림음 테스트');
    });
  };

  // 설정 초기화
  const resetChatSettings = () => {
    const handleReset = () => {
      const defaultSettings = {
        translation: false,
        notificationSound: true,
        chatNotification: true,
        emailNotification: false
      };
      
      setChatSettings(defaultSettings);
      
      // localStorage에서 설정 제거
      Object.keys(defaultSettings).forEach(key => {
        localStorage.removeItem(`chat_${key}`);
      });
      
      setSelectedLanguage('ko');
      localStorage.removeItem('chat_language');
      
      showToast('설정이 초기화되었습니다.', 'success');
    };

    showConfirm(
      '설정 초기화',
      '모든 채팅 설정을 초기화하시겠습니까?\n(사용자 정보는 유지됩니다)',
      handleReset,
      'warning'
    );
  };

  // 채팅창 닫기
  const handleClose = () => {
    // 채팅방에 있다면 채팅방 목록으로 돌아가기
    if (chatSelectedRoom) {
      setChatSelectedRoom(null);
      setChatMessages([]);
      setShowParticipants(false);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
      setCurrentSearchIndex(0);
      // 채팅방 탭으로 변경
      setChatSelectedTab('chat-rooms');
    } else {
      // 채팅방이 아닌 경우에만 완전히 닫기
      setIsChatModalOpen(false);
    }
  };

  // 채팅창 내용 렌더링
  const renderChatContent = () => {
    if (chatSelectedRoom) {
      return (
        <div className="flex flex-col h-full">
          {/* 채팅 헤더 */}
          <div className="flex items-center justify-between p-4 bg-primary text-white">
            <div className="flex items-center gap-3">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-white hover:bg-white/20"
                onPress={handleBackToRooms}
              >
                <Icon icon="lucide:arrow-left" />
              </Button>
              <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 -m-2 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // 1:1 채팅인 경우 프로필 모달, 모임 채팅인 경우 참여자 목록
                  if (chatSelectedRoom?.id.startsWith('user')) {
                    // 1:1 채팅 - 상대방 프로필 표시 (채팅방의 userId 사용)
                    const userId = chatSelectedRoom.userId;
                    console.log('Header clicked - 1:1 chat userId:', userId);
                    if (userId) {
                      openProfileModal(userId);
                    }
                  } else if (chatSelectedRoom?.userId) {
                    // 모임 채팅 - 모임 리더 프로필 표시
                    console.log('Header clicked - group leader userId:', chatSelectedRoom.userId);
                    openProfileModal(chatSelectedRoom.userId);
                  } else {
                    // 모임 채팅 - 참여자 목록 표시
                    console.log('Header clicked - showing participants');
                    handleShowParticipants();
                  }
                }}
              >
                <Avatar src={chatSelectedRoom.avatar} size="sm" />
                <div>
                  <span className="font-semibold block">{chatSelectedRoom.name}</span>
                  <span className="text-xs opacity-80">
                    {chatSelectedRoom.id.startsWith('user') ? '온라인' : `${getParticipants(chatSelectedRoom.id).length}명 · 탭하여 참여자 보기`}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-white hover:bg-white/20"
                onPress={handleShowSearch}
              >
                <Icon icon="lucide:search" />
              </Button>
              
              {/* 1:1 채팅이 아닌 경우에만 참여자 정보 버튼 표시 */}
              {!chatSelectedRoom?.id.startsWith('user') && (
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onPress={handleShowParticipants}
                >
                  <Icon icon="lucide:info" />
                </Button>
              )}
            </div>
          </div>

          {/* 검색바 */}
          {showSearch && (
            <div className="p-3 border-b border-divider bg-white">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:search" className="text-gray-400" />
                <input
                  type="text"
                  placeholder="메시지 또는 발신자 검색..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchResults.length > 0) {
                      if (e.shiftKey) {
                        navigateSearchResults('prev');
                      } else {
                        navigateSearchResults('next');
                      }
                    }
                  }}
                  className="flex-1 outline-none text-sm bg-transparent"
                  autoFocus
                />
                {searchQuery && searchResults.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {currentSearchIndex + 1}/{searchResults.length}
                    </span>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => navigateSearchResults('prev')}
                      isDisabled={searchResults.length <= 1}
                    >
                      <Icon icon="lucide:chevron-up" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => navigateSearchResults('next')}
                      isDisabled={searchResults.length <= 1}
                    >
                      <Icon icon="lucide:chevron-down" />
                    </Button>
                  </div>
                )}
                {searchQuery && searchResults.length === 0 && (
                  <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
                    결과 없음
                  </span>
                )}
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                    setSearchResults([]);
                    setCurrentSearchIndex(0);
                  }}
                >
                  <Icon icon="lucide:x" />
                </Button>
              </div>
              {searchQuery && searchResults.length > 0 && (
                <div className="text-xs text-gray-500 mt-2">
                  Enter: 다음 결과 | Shift + Enter: 이전 결과
                </div>
              )}
            </div>
          )}

          {/* 참여자 목록 */}
          {showParticipants && !chatSelectedRoom.id.startsWith('user') && (
            <div className="border-b border-divider bg-white">
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-3">참여자 ({getParticipants(chatSelectedRoom.id).length})</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {getParticipants(chatSelectedRoom.id).map((participant) => (
                    <div 
                      key={participant.id} 
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                      onClick={(e) => {
                        console.log('Participant clicked - id:', participant.id, 'name:', participant.name);
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const userId = typeof participant.id === 'number' ? participant.id : parseInt(participant.id);
                        
                        console.log('Participant userId:', userId);
                        
                        if (!isNaN(userId)) {
                          console.log('Opening profile modal for userId:', userId);
                          openProfileModal(userId);
                        } else {
                          console.log('Invalid userId or NaN:', userId);
                        }
                      }}
                    >
                      <div className="relative">
                        <Avatar src={participant.avatar} size="sm" />
                        {participant.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{participant.name}</span>
                          {participant.role === 'admin' && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">관리자</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {participant.isOnline ? '온라인' : '오프라인'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 메시지 영역 */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          >
            {/* 검색 결과 표시 */}
            {showSearch && searchResults.length > 0 && (
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <Icon icon="lucide:search" className="w-4 h-4" />
                  검색 결과 ({searchResults.length}개)
                </div>
                {searchResults.map((message, index) => (
                  <div 
                    key={`search-${message.id}`} 
                    className={`border rounded-lg p-3 mb-2 cursor-pointer hover:shadow-md transition-all duration-200 ${
                      index === currentSearchIndex 
                        ? 'bg-blue-50 border-blue-300 shadow-md' 
                        : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                    }`}
                    onClick={() => {
                      setCurrentSearchIndex(index);
                      scrollToMessage(message.id);
                    }}
                  >
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                      {index === currentSearchIndex && (
                        <Icon icon="lucide:arrow-right" className="w-3 h-3 text-blue-600" />
                      )}
                      <span>{highlightText(message.senderName || '', searchQuery)}</span>
                      <span>•</span>
                      <span>{message.timestamp}</span>
                    </div>
                    <div className="text-sm mb-2">
                      {highlightText(message.text, searchQuery)}
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${
                      index === currentSearchIndex ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      <Icon icon="lucide:mouse-pointer-click" className="w-3 h-3" />
                      {index === currentSearchIndex ? '현재 선택됨' : '클릭하여 메시지로 이동'}
                    </div>
                  </div>
                ))}
                <Divider className="my-4" />
              </div>
            )}

            {/* 검색 결과가 없을 때 */}
            {showSearch && searchQuery && searchResults.length === 0 && (
              <div className="mb-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <Icon icon="lucide:search-x" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">'{searchQuery}'에 대한 검색 결과가 없습니다</div>
                </div>
                <Divider className="my-4" />
              </div>
            )}

            {/* 일반 메시지 */}
            {(showSearch ? chatMessages : chatMessages).map((message) => (
              <div
                key={message.id}
                data-message-id={message.id}
                className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-xs ${message.type === 'sent' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {message.type === 'received' && (
                    <Avatar 
                      src={getMessageSenderAvatar(message)} 
                      size="sm" 
                      className={`transition-transform ${
                        message.senderId !== 'ai-bot' && message.senderId !== 'me' 
                          ? 'cursor-pointer hover:scale-110' 
                          : 'cursor-default'
                      }`}
                      onClick={(e) => {
                        console.log('Avatar clicked - senderId:', message.senderId, 'roomId:', chatSelectedRoom?.id);
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // AI 봇 메시지는 프로필 없음
                        if (message.senderId === 'ai-bot') {
                          console.log('AI bot message - no profile');
                          return;
                        }
                        
                        let userId: number | null = null;
                        
                        if (chatSelectedRoom?.id.startsWith('user')) {
                          // 1:1 채팅인 경우 항상 상대방 프로필 (채팅방의 userId 사용)
                          userId = chatSelectedRoom.userId || null;
                          console.log('1:1 chat - using room userId:', userId);
                        } else if (message.senderId && message.senderId !== 'me') {
                          // 모임 채팅인 경우 실제 메시지 발신자 프로필
                          userId = parseInt(message.senderId);
                          console.log('Group chat - userId:', userId, 'from senderId:', message.senderId);
                        }
                        
                        if (userId && !isNaN(userId)) {
                          console.log('Opening profile modal for userId:', userId);
                          openProfileModal(userId);
                        } else {
                          console.log('Invalid userId or NaN:', userId);
                        }
                      }}
                    />
                  )}
                  <div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === 'sent'
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-white text-foreground shadow-sm rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm">
                        {searchQuery && showSearch ? highlightText(message.text, searchQuery) : message.text}
                      </p>
                      
                      {/* 번역 표시 - 개선된 조건 (같은 언어일 때는 표시 안함) */}
                      {(() => {
                        // 번역 기능이 비활성화되어 있으면 표시 안함
                        if (!chatSettings.translation) return null;
                        
                        // 받은 메시지가 아니거나 AI 봇 메시지면 표시 안함
                        if (message.type !== 'received' || message.senderId === 'ai-bot') return null;
                        
                        // 원문 언어 감지
                        const sourceLanguage = detectLanguage(message.text);
                        
                        // 같은 언어면 번역 표시 안함
                        if (sourceLanguage === selectedLanguage) {
                          console.log(`⏭️ 번역 표시 생략: ${sourceLanguage} -> ${selectedLanguage} (같은 언어)`);
                          return null;
                        }
                        
                        return (
                          <div className="mt-2 pt-2 border-t border-gray-200 opacity-75">
                            <div className="flex items-center gap-2">
                              <Icon icon="lucide:globe" className="text-xs text-blue-600" />
                              <p className="text-xs italic text-blue-600">
                                {translatingIds.has(message.id) ? (
                                  <span className="flex items-center gap-1">
                                    <Icon icon="lucide:loader-2" className="animate-spin text-xs" />
                                    번역 중...
                                  </span>
                                ) : (
                                  <TranslatedMessage 
                                    messageId={message.id}
                                    originalText={message.text}
                                    targetLanguage={selectedLanguage}
                                    onTranslate={translateMessage}
                                  />
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    
                    {/* 받은 메시지: 이름(왼쪽)과 시간+읽지않은수(오른쪽)을 메시지 박스 외부 아래에 표시 */}
                    {message.type === 'received' && message.senderName && (
                      <div className="flex items-center justify-between mt-1">
                        <span 
                          className={`text-xs text-gray-600 font-medium transition-colors ${
                            message.senderId !== 'ai-bot' && message.senderId !== 'me'
                              ? 'cursor-pointer hover:text-primary'
                              : 'cursor-default'
                          }`}
                          onClick={(e) => {
                            console.log('Name clicked - senderId:', message.senderId, 'roomId:', chatSelectedRoom?.id);
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // AI 봇 메시지는 프로필 없음
                            if (message.senderId === 'ai-bot') {
                              console.log('AI bot message - no profile');
                              return;
                            }
                            
                            let userId: number | null = null;
                            
                            if (chatSelectedRoom?.id.startsWith('user')) {
                              // 1:1 채팅인 경우 항상 상대방 프로필 (채팅방의 userId 사용)
                              userId = chatSelectedRoom.userId || null;
                              console.log('1:1 chat - using room userId:', userId);
                            } else if (message.senderId && message.senderId !== 'me') {
                              // 모임 채팅인 경우 실제 메시지 발신자 프로필
                              userId = parseInt(message.senderId);
                              console.log('Group chat - userId:', userId, 'from senderId:', message.senderId);
                            }
                            
                            if (userId && !isNaN(userId)) {
                              console.log('Opening profile modal for userId:', userId);
                              openProfileModal(userId);
                            } else {
                              console.log('Invalid userId or NaN:', userId);
                            }
                          }}
                        >
                          {message.senderName}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">
                            {message.timestamp}
                          </span>

                        </div>
                      </div>
                    )}
                    
                    {/* 보낸 메시지: 읽지않은수+시간을 메시지 박스 외부 아래 왼쪽에 표시 */}
                    {message.type === 'sent' && (
                      <div className="flex items-center gap-1 mt-1 justify-start">
                        <span className="text-xs text-foreground-400">
                          {message.timestamp}
                        </span>
                      </div>
                    )}
                  </div>
                  {message.unreadCount !== undefined && message.unreadCount > 0 && (
                      <span className="text-xs text-primary font-medium">
                              {message.unreadCount}
                            </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 입력 영역 */}
          <div className="p-4 border-t border-divider bg-white">
            <div className="flex gap-2">
              <Textarea
                placeholder="메시지를 입력하세요..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                minRows={1}
                maxRows={3}
                className="flex-1"
                classNames={{
                  input: "border-0 focus:ring-0",
                  inputWrapper: "border border-gray-300 rounded-full px-4 py-2 hover:border-primary focus-within:border-primary"
                }}
              />
              <Button
                isIconOnly
                color="primary"
                className="rounded-full w-10 h-10 min-w-10"
                onPress={handleSendMessage}
                isDisabled={!inputMessage.trim()}
              >
                <Icon icon="lucide:send" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        {/* 모바일에서만 상단바 표시 */}
        <div className="sm:hidden flex items-center justify-between p-4 border-b border-divider bg-white">
          <h2 className="text-lg font-bold">플탐 채팅</h2>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={closeChatModal}
          >
            <Icon icon="lucide:x" />
          </Button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {/* 챗봇 섹션 */}
          {chatSelectedTab === 'chatbot' && (
            <div className="p-4">
              <Card className="shadow-sm">
                <CardBody className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar
                      src="https://cf.channel.io/thumb/200x200/pub-file/1/1/placeholder.svg"
                      size="md"
                      className="flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">플탐 AI 도우미</h3>
                      <div className="space-y-2 text-sm text-foreground-600 mb-4">
                        <p>안녕하세요, <strong>플탐</strong> AI 도우미입니다.</p>
                        <p>무엇을 도와드릴까요?</p>
                        <div className="border-t border-divider my-3"></div>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:message-circle" className="text-primary" />
                            <span>챗봇 상담: 연중무휴 24시간</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:phone" className="text-primary" />
                            <span>유선상담: 평일 09:00-18:00</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:users" className="text-primary" />
                            <span>모임 채팅: 실시간 참여자간 대화</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:bell" className="text-primary" />
                            <span>중요 알림: 모임 및 수업 관련 안내</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Divider className="my-4" />
                  <div className="flex items-center justify-between">
                    <Button
                      color="primary"
                      startContent={<Icon icon="lucide:message-square" />}
                      onPress={handleOpenChatBot}
                      className="rounded-full"
                    >
                      챗봇에게 물어보기
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-success">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>상담사가 대기중</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* 채팅방 섹션 */}
          {chatSelectedTab === 'chat-rooms' && (
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4 px-2">나의 채팅방</h2>
              <div className="space-y-3">
                {/* 1:1 채팅방 */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-3 px-2">개인 채팅</h3>
                  <div className="space-y-2">
                    {mockChatRooms.filter(room => !room.isGroup).map((room) => {
                      const user = room.userId ? getUserById(room.userId) : null;
                      const isUserOnline = user && 'isOnline' in user ? user.isOnline : false;
                      return (
                        <Card 
                          key={room.id} 
                          isPressable 
                          onPress={() => handleRoomSelect(room as any)}
                          className="hover:shadow-md transition-shadow w-full"
                        >
                          <CardBody className="p-3 w-full">
                            <div className="flex items-center gap-3 w-full" style={{ height: '48px' }}>
                              <div className="relative">
                                <Avatar src={room.avatar} size="sm" className="flex-shrink-0" />
                                {isUserOnline && (
                                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 overflow-hidden flex flex-col justify-center h-full">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-sm truncate max-w-[140px]">{room.name}</h4>
                                </div>
                                <p className="text-xs text-foreground-500 truncate max-w-[200px]">
                                  {room.lastMessage}
                                </p>
                              </div>
                              <div className="flex flex-col items-end justify-center flex-shrink-0 ml-2 h-full">
                                <span className="text-xs text-foreground-400 mb-1">{room.timestamp}</span>
                                {room.unreadCount > 0 && (
                                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">
                                      {room.unreadCount > 99 ? '99+' : room.unreadCount}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* 모임 채팅방 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3 px-2">모임 채팅</h3>
                  <div className="space-y-2">
                    {mockChatRooms.filter(room => room.isGroup).map((room) => (
                      <Card 
                        key={room.id} 
                        isPressable 
                        onPress={() => handleRoomSelect(room as any)}
                        className="hover:shadow-md transition-shadow w-full"
                      >
                        <CardBody className="p-3 w-full">
                          <div className="flex items-center gap-3 w-full" style={{ height: '48px' }}>
                            <Avatar src={room.avatar} size="sm" className="flex-shrink-0" />
                            <div className="flex-1 min-w-0 overflow-hidden flex flex-col justify-center h-full">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-sm truncate max-w-[140px]">{room.name}</h4>
                              </div>
                              <p className="text-xs text-foreground-500 truncate max-w-[200px]">
                                {room.lastMessage}
                              </p>
                            </div>
                            <div className="flex flex-col items-end justify-center flex-shrink-0 ml-2 h-full">
                              <span className="text-xs text-foreground-400 mb-1">{room.timestamp}</span>
                              {room.unreadCount > 0 && (
                                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                  <span className="text-xs text-white font-medium">
                                    {room.unreadCount > 99 ? '99+' : room.unreadCount}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 설정 섹션 */}
          {chatSelectedTab === 'settings' && (
            <div className="p-4 space-y-4">
              {/* 프로필 섹션 */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
                <Avatar
                  src={currentUserInfo.avatar}
                  size="lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{currentUserInfo.name}</h3>
                  <p className="text-xs text-foreground-500">{currentUserInfo.email}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="light" 
                  startContent={<Icon icon="lucide:edit" />}
                  onPress={() => setUserInfoEditModal(true)}
                >
                  <span className="text-xs">정보 수정</span>
                </Button>
              </div>

              <Divider />

              {/* 상담 환경 */}
              <div>
                <h3 className="text-sm font-semibold mb-3">상담 환경</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:globe" className="text-sm" />
                      <span className="text-sm">언어</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="flat" 
                      endContent={<Icon icon="lucide:chevron-right" className="text-xs" />}
                      onPress={() => setLanguageSelectModal(true)}
                    >
                      <span className="text-xs">
                        {selectedLanguage === 'ko' ? '한국어' : 
                         selectedLanguage === 'en' ? 'English' :
                         selectedLanguage === 'ja' ? '日本語' :
                         selectedLanguage === 'zh' ? '中文' :
                         selectedLanguage === 'es' ? 'Español' :
                         selectedLanguage === 'fr' ? 'Français' :
                         selectedLanguage === 'de' ? 'Deutsch' :
                         selectedLanguage === 'ru' ? 'Русский' : '한국어'}
                      </span>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:languages" className="text-sm" />
                      <div className="flex flex-col">
                        <span className="text-sm">메시지 번역 표시</span>
                        <span className="text-xs text-gray-500">받은 메시지를 선택한 언어로 번역하여 표시</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-xs">
                            <div className={`w-2 h-2 rounded-full ${
                              checkBrowserAIAvailable() ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                            <span className={checkBrowserAIAvailable() ? 'text-green-600' : 'text-gray-500'}>
                              Browser AI
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-blue-600">Google</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                            <span className="text-cyan-600">Bing</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-yellow-600">Yandex</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Switch
                      size="sm"
                      isSelected={chatSettings.translation}
                      onValueChange={(value) => handleSettingChange('translation', value)}
                    />
                  </div>
                </div>
              </div>

              <Divider />

              {/* 알림 설정 */}
              <div>
                <h3 className="text-sm font-semibold mb-3">알림 설정</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:message-circle" className="text-sm" />
                      <span className="text-sm">채팅 알림</span>
                    </div>
                    <Switch
                      size="sm"
                      isSelected={chatSettings.chatNotification}
                      onValueChange={(value) => handleSettingChange('chatNotification', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:volume-2" className="text-sm" />
                      <span className="text-sm">알림음</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={playNotificationSound}
                        title="알림음 테스트"
                      >
                        <Icon icon="lucide:play" className="text-xs" />
                      </Button>
                      <Switch
                        size="sm"
                        isSelected={chatSettings.notificationSound}
                        onValueChange={(value) => handleSettingChange('notificationSound', value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:mail" className="text-sm" />
                      <span className="text-sm">이메일 알림</span>
                    </div>
                    <Switch
                      size="sm"
                      isSelected={chatSettings.emailNotification}
                      onValueChange={(value) => handleSettingChange('emailNotification', value)}
                    />
                  </div>
                </div>
              </div>

              <Divider />

              {/* 고급 설정 */}
              <div>
                <h3 className="text-sm font-semibold mb-3">고급 설정</h3>
                <div className="space-y-2">
                  <Button
                    variant="light"
                    startContent={<Icon icon="lucide:globe" />}
                    className="w-full justify-start"
                    size="sm"
                    onPress={async () => {
                      if (!chatSettings.translation) {
                        showToast('번역 기능을 먼저 활성화해주세요.', 'warning');
                        return;
                      }
                      
                      try {
                        const testText = '안녕하세요! 번역 테스트입니다.';
                        let testLang = selectedLanguage;
                        
                        // 한국어가 선택된 경우 영어로 테스트
                        if (selectedLanguage === 'ko') {
                          testLang = 'en';
                        }
                        
                        console.log('🧪 번역 테스트 시작');
                        console.log('원문:', testText);
                        console.log('대상 언어:', testLang);
                        
                        showToast('번역 테스트 중...', 'info');
                        
                        // 테스트 번역 수행
                        const result = await translateMessage(99999, testText, testLang);
                        
                        console.log('번역 결과:', result);
                        
                        // 번역 결과가 원본과 다르고 오류 메시지가 아닌지 확인
                        if (result !== testText && !result.includes('[번역 실패') && !result.includes('[번역 오류')) {
                          showToast(`✅ 번역 성공: "${result}"`, 'success');
                          console.log('✅ 번역 테스트 성공');
                        } else {
                          showToast('⚠️ 번역 서비스를 사용할 수 없습니다. 콘솔을 확인해주세요.', 'warning');
                          console.log('⚠️ 번역 결과가 원본과 동일하거나 오류 메시지');
                        }
                      } catch (error) {
                        showToast('❌ 번역 테스트 실패. 콘솔을 확인해주세요.', 'error');
                        console.error('❌ 번역 테스트 실패:', error);
                      }
                    }}
                  >
                    <span className="text-xs">번역 기능 테스트</span>
                  </Button>

                  <Button
                    variant="light"
                    startContent={<Icon icon="lucide:cpu" />}
                    className="w-full justify-start"
                    size="sm"
                    onPress={() => {
                      console.log('=== Browser AI 디버그 정보 ===');
                      console.log('User Agent:', navigator.userAgent);
                      console.log('Is Chrome:', navigator.userAgent.includes('Chrome'));
                      console.log('window.ai exists:', 'ai' in window);
                      
                      // @ts-ignore
                      if ('ai' in window) {
                        // @ts-ignore
                        console.log('window.ai:', window.ai);
                        // @ts-ignore
                        console.log('window.ai.translation exists:', window.ai && 'translation' in window.ai);
                      }
                      
                      const available = checkBrowserAIAvailable();
                      console.log('checkBrowserAIAvailable():', available);
                      
                      showToast(
                        `Browser AI: ${available ? '사용 가능' : '사용 불가'} (콘솔 확인)`, 
                        available ? 'success' : 'warning'
                      );
                    }}
                  >
                    <span className="text-xs">Browser AI 디버그</span>
                  </Button>
                  
                  <Button
                    variant="light"
                    startContent={<Icon icon="lucide:download" />}
                    className="w-full justify-start"
                    size="sm"
                    onPress={() => {
                      // 채팅 데이터 백업 기능
                      const chatData = {
                        settings: chatSettings,
                        language: selectedLanguage,
                        userInfo: currentUserInfo,
                        exportDate: new Date().toISOString()
                      };
                      
                      const blob = new Blob([JSON.stringify(chatData, null, 2)], {
                        type: 'application/json'
                      });
                      
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `플탐_채팅설정_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      
                      showToast('채팅 설정이 백업되었습니다.', 'success');
                    }}
                  >
                    <span className="text-xs">설정 백업</span>
                  </Button>
                  <Button
                    variant="light"
                    startContent={<Icon icon="lucide:refresh-cw" />}
                    className="w-full justify-start"
                    size="sm"
                    onPress={resetChatSettings}
                  >
                    <span className="text-xs">설정 초기화</span>
                  </Button>
                </div>
              </div>

              <Divider />

              <div className="text-center text-xs text-foreground-400">
                플탐 채팅 v1.0.0
              </div>
            </div>
          )}
        </div>

        {/* 네비게이션 바 */}
        <nav className="flex border-t border-divider bg-white py-1">
          <button
            onClick={() => handleTabChange('chatbot')}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs transition-colors ${
              chatSelectedTab === 'chatbot' 
                ? 'text-primary bg-primary/5' 
                : 'text-foreground-500 hover:text-foreground'
            }`}
          >
            <Icon icon="lucide:bot" className="text-xl mb-1" />
            <span>챗봇</span>
          </button>
          <button
            onClick={() => handleTabChange('chat-rooms')}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs transition-colors ${
              chatSelectedTab === 'chat-rooms' 
                ? 'text-primary bg-primary/5' 
                : 'text-foreground-500 hover:text-foreground'
            }`}
          >
            <Icon icon="lucide:messages-square" className="text-xl mb-1" />
            <span>채팅</span>
          </button>
          <button
            onClick={() => handleTabChange('settings')}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs transition-colors ${
              chatSelectedTab === 'settings' 
                ? 'text-primary bg-primary/5' 
                : 'text-foreground-500 hover:text-foreground'
            }`}
          >
            <Icon icon="lucide:settings" className="text-xl mb-1" />
            <span>설정</span>
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="fixed sm:bottom-24 sm:right-5 sm:w-96 sm:h-[690px] sm:rounded-xl max-sm:bottom-0 max-sm:right-0 max-sm:left-0 max-sm:top-0 max-sm:w-full max-sm:h-full max-sm:rounded-none bg-white shadow-2xl z-[9998] flex flex-col overflow-hidden">
      {renderChatContent()}
      
      {/* 프로필 모달 */}
      <UserProfileModal
        user={profileModalState.user}
        isOpen={profileModalState.isOpen}
        onClose={closeProfileModal}
        onStartChat={handleStartChatFromProfile}
        onReport={handleReportFromProfile}
        currentUserId={1} // 현재 사용자 ID
        onViewNestedProfile={(user) => {
          setProfileModalState({
            isOpen: true,
            user
          });
        }}
      />

      {/* 신고 모달 */}
      <ReportModal
        user={reportModalState.user}
        isOpen={reportModalState.isOpen}
        onClose={closeReportModal}
        onReport={handleReport}
      />

      {/* 사용자 정보 수정 모달 */}
      <ProfileEditModal
        isOpen={userInfoEditModal}
        onClose={() => setUserInfoEditModal(false)}
        onSave={handleUserInfoSave}
        currentProfile={{
          name: currentUserInfo.name,
          email: currentUserInfo.email,
          bio: currentUserInfo.bio,
          location: '서울', // 기본값 또는 사용자 위치
          avatar: currentUserInfo.avatar,
          phone: currentUserInfo.phone
        }}
      />

      {/* 언어 선택 모달 */}
      <LanguageSelectModal
        isOpen={languageSelectModal}
        onClose={() => setLanguageSelectModal(false)}
        onSelect={handleLanguageSelect}
        currentLanguage={selectedLanguage}
      />

      {/* 확인 모달 */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />

      {/* 토스트 알림 */}
      <ToastNotification
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

// 번역된 메시지 표시 컴포넌트
interface TranslatedMessageProps {
  messageId: number;
  originalText: string;
  targetLanguage: string;
  onTranslate: (messageId: number, text: string, targetLanguage: string) => Promise<string>;
}

const TranslatedMessage: React.FC<TranslatedMessageProps> = ({ 
  messageId, 
  originalText, 
  targetLanguage, 
  onTranslate 
}) => {
  const [translatedText, setTranslatedText] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    const translate = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const result = await onTranslate(messageId, originalText, targetLanguage);
        setTranslatedText(result);
      } catch (error) {
        console.error('번역 실패:', error);
        setError('번역 실패');
        setTranslatedText('번역을 사용할 수 없습니다');
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [messageId, originalText, targetLanguage, onTranslate]);

  if (isLoading) {
    return (
      <span className="flex items-center gap-1">
        <Icon icon="lucide:loader-2" className="animate-spin text-xs" />
        번역 중...
      </span>
    );
  }

  if (error) {
    return <span className="text-red-500">{error}</span>;
  }

  return (
    <span className="break-words">
      🌐 {translatedText}
    </span>
  );
};

export default ChatWindow;