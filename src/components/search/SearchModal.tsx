import React from 'react';
import { Modal, ModalContent, Input, Chip, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { mockClasses, mockMoims, mockPosts, mockUsers, mockUser, getUserById } from '../../data/mockData';

interface SearchModalProps {
  onUserClick?: (userId: number) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onUserClick }) => {
  const { isSearchModalOpen, setIsSearchModalOpen } = useAppContext();
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const popularSearches = [
    "요가", "기타 레슨", "등산", "독서 모임", "영어 회화", "베이킹", "러닝", "보드게임"
  ];

  const handleSearch = () => {
    if (searchQuery.trim().length > 1) {
      setIsLoading(true);
      // 실제 구현에서는 API 호출 등을 통해 검색 처리
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsSearchModalOpen(false);
    }
  };

  const handleClose = () => {
    setIsSearchModalOpen(false);
    setSearchQuery("");
    setActiveTab("all");
  };

  // 클릭 핸들러들
  const handleClassClick = (classId: number) => {
    handleClose();
    navigate(`/class-detail/${classId}`);
  };

  const handleMoimClick = (moimId: number) => {
    handleClose();
    navigate(`/moim-detail/${moimId}`);
  };

  const handlePostClick = (postId: number) => {
    handleClose();
    navigate(`/community-post-detail/${postId}`);
  };

  const handleUserClick = (userId: number) => {
    handleClose();
    if (onUserClick) {
      onUserClick(userId);
    }
  };

  React.useEffect(() => {
    if (isSearchModalOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isSearchModalOpen]);

  const filteredClasses = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    return mockClasses.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3);
  }, [searchQuery]);

  const filteredMoims = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    return mockMoims.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.leader.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3);
  }, [searchQuery]);

  const filteredPosts = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    return mockPosts.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3);
  }, [searchQuery]);

  const filteredUsers = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const allUsers = [mockUser, ...mockUsers];
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3);
  }, [searchQuery]);

  const hasResults = searchQuery.trim().length > 1 && (
    filteredClasses.length > 0 || filteredMoims.length > 0 || filteredPosts.length > 0 || filteredUsers.length > 0
  );

  return (
    <Modal 
      isOpen={isSearchModalOpen} 
      onClose={handleClose}
      backdrop="blur"
      placement="top"
      hideCloseButton
      className="pt-0"
    >
      <ModalContent>
        {() => (
          <div className="max-w-3xl mx-auto w-full">
            <div className="bg-content1 rounded-lg shadow-lg overflow-hidden">
              <div className="p-3">
                <Input
                  ref={inputRef}
                  placeholder="전체 검색 (수업, 모임, 커뮤니티, 사용자)"
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  onKeyDown={handleKeyDown}
                  startContent={<Icon icon="lucide:search" className="text-foreground-400" />}
                  endContent={
                    <div className="flex items-center">
                      {isLoading && <Icon icon="lucide:loader-2" className="text-foreground-400 animate-spin mr-2" />}
                      <span className="text-foreground-400 text-xs border border-foreground-200 rounded px-1 py-0.5">ESC</span>
                    </div>
                  }
                  size="lg"
                  radius="lg"
                  variant="bordered"
                  className="w-full"
                />
              </div>

              <div className="max-h-[70vh] overflow-y-auto">
                {searchQuery.trim().length <= 1 ? (
                  <div className="p-4 pt-0">
                    <h3 className="text-sm font-medium text-foreground-600 mb-3">인기 검색어</h3>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term, index) => (
                        <Chip 
                          key={index} 
                          variant="flat" 
                          color="default" 
                          className="cursor-pointer"
                          onClick={() => setSearchQuery(term)}
                        >
                          {term}
                        </Chip>
                      ))}
                    </div>
                  </div>
                ) : !hasResults ? (
                  <div className="p-8 text-center">
                    <Icon icon="lucide:search-x" className="text-foreground-300 text-4xl mx-auto mb-2" />
                    <p className="text-foreground-500">검색 결과가 없습니다</p>
                    <p className="text-foreground-400 text-sm">다른 검색어를 입력해보세요</p>
                  </div>
                ) : (
                  <div className="pb-2">
                    <div className="border-b border-divider">
                      <div className="flex px-4 py-2 space-x-4 overflow-x-auto category-scroll">
                        <Button 
                          variant={activeTab === "all" ? "solid" : "light"} 
                          color={activeTab === "all" ? "primary" : "default"}
                          size="sm"
                          onPress={() => setActiveTab("all")}
                          className="whitespace-nowrap"
                        >
                          전체
                        </Button>
                        {filteredUsers.length > 0 && (
                          <Button 
                            variant={activeTab === "users" ? "solid" : "light"} 
                            color={activeTab === "users" ? "primary" : "default"}
                            size="sm"
                            onPress={() => setActiveTab("users")}
                            className="whitespace-nowrap"
                          >
                            사용자 ({filteredUsers.length})
                          </Button>
                        )}
                        {filteredClasses.length > 0 && (
                          <Button 
                            variant={activeTab === "classes" ? "solid" : "light"} 
                            color={activeTab === "classes" ? "primary" : "default"}
                            size="sm"
                            onPress={() => setActiveTab("classes")}
                            className="whitespace-nowrap"
                          >
                            수업 ({filteredClasses.length})
                          </Button>
                        )}
                        {filteredMoims.length > 0 && (
                          <Button 
                            variant={activeTab === "moims" ? "solid" : "light"} 
                            color={activeTab === "moims" ? "primary" : "default"}
                            size="sm"
                            onPress={() => setActiveTab("moims")}
                            className="whitespace-nowrap"
                          >
                            모임 ({filteredMoims.length})
                          </Button>
                        )}
                        {filteredPosts.length > 0 && (
                          <Button 
                            variant={activeTab === "posts" ? "solid" : "light"} 
                            color={activeTab === "posts" ? "primary" : "default"}
                            size="sm"
                            onPress={() => setActiveTab("posts")}
                            className="whitespace-nowrap"
                          >
                            커뮤니티 ({filteredPosts.length})
                          </Button>
                        )}
                      </div>
                    </div>

                    {(activeTab === "all" || activeTab === "users") && filteredUsers.length > 0 && (
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-foreground-600 mb-3">사용자</h3>
                        <div className="space-y-2">
                          {filteredUsers.map(user => (
                            <div 
                              key={user.id} 
                              className="flex items-center gap-3 p-2 hover:bg-content2 rounded-lg cursor-pointer transition-colors"
                              onClick={() => handleUserClick(user.id)}
                            >
                              <div className="relative">
                                <img 
                                  src={user.avatar} 
                                  alt={user.name} 
                                  className="w-10 h-10 object-cover rounded-full" 
                                />
                                {user.isOnline && (
                                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{user.name}</p>
                                <p className="text-xs text-foreground-500 truncate">
                                  {user.location} | 팔로워 {user.followerCount || 0}
                                </p>
                                {user.bio && (
                                  <p className="text-xs text-foreground-400 truncate mt-0.5">{user.bio}</p>
                                )}
                              </div>
                              <div className="flex items-center text-xs text-foreground-500">
                                <Icon icon="lucide:star" className="text-secondary mr-1" />
                                {user.rating}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(activeTab === "all" || activeTab === "classes") && filteredClasses.length > 0 && (
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-foreground-600 mb-3">수업</h3>
                        <div className="space-y-2">
                          {filteredClasses.map(item => (
                            <div 
                              key={item.id} 
                              className="flex items-center gap-3 p-2 hover:bg-content2 rounded-lg cursor-pointer transition-colors"
                              onClick={() => handleClassClick(item.id)}
                            >
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-12 h-12 object-cover rounded-md" 
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.title}</p>
                                <p className="text-xs text-foreground-500 truncate">
                                  {item.instructor.name} | ₩{item.price.toLocaleString()}
                                </p>
                              </div>
                              <div className="flex items-center text-xs text-foreground-500">
                                <Icon icon="lucide:star" className="text-secondary mr-1" />
                                {item.rating}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(activeTab === "all" || activeTab === "moims") && filteredMoims.length > 0 && (
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-foreground-600 mb-3">모임</h3>
                        <div className="space-y-2">
                          {filteredMoims.map(item => (
                            <div 
                              key={item.id} 
                              className="flex items-center gap-3 p-2 hover:bg-content2 rounded-lg cursor-pointer transition-colors"
                              onClick={() => handleMoimClick(item.id)}
                            >
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-12 h-12 object-cover rounded-md" 
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.title}</p>
                                <p className="text-xs text-foreground-500 truncate">
                                  {item.location} | {item.memberCount}/{item.maxMembers}명
                                </p>
                              </div>
                              <div className="flex items-center text-xs">
                                <Chip size="sm" variant="flat" color="primary">
                                  {item.isRegular ? "정기모임" : "원데이"}
                                </Chip>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(activeTab === "all" || activeTab === "posts") && filteredPosts.length > 0 && (
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-foreground-600 mb-3">커뮤니티</h3>
                        <div className="space-y-2">
                          {filteredPosts.map(item => (
                            <div 
                              key={item.id} 
                              className="flex items-center gap-3 p-2 hover:bg-content2 rounded-lg cursor-pointer transition-colors"
                              onClick={() => handlePostClick(item.id)}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.title}</p>
                                <p className="text-xs text-foreground-500 truncate">
                                  {item.author.name} | 좋아요 {item.likeCount} | 댓글 {item.commentCount}
                                </p>
                              </div>
                              <div className="text-xs">
                                <Chip size="sm" variant="flat" color="default">
                                  {item.boardTypeId === 2 ? "자유" : 
                                   item.boardTypeId === 3 ? "질문" : 
                                   item.boardTypeId === 4 ? "모임홍보" : 
                                   item.boardTypeId === 5 ? "노하우" : "작품공유"}
                                </Chip>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-divider flex justify-end">
                <Button 
                  variant="light" 
                  onPress={handleClose}
                  size="sm"
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SearchModal;