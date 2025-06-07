import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Avatar,
  Card,
  CardBody,
  Badge,
  Tabs,
  Tab
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useProfileClick } from './ProfileClickProvider';
import ProfileEditModal from './ProfileEditModal';
import { 
  User, 
  getUserPosts, 
  getUserMoims, 
  getUserClasses,
  getFollowers,
  getFollowing,
  toggleFollow,
  isFollowing,
  getUserById
} from '../../data/mockData';

interface UserProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (userId?: number) => void;
  onReport: () => void;
  currentUserId: number;
  onViewNestedProfile?: (user: User) => void;
  onProfileUpdate?: (updatedUser: User) => void;
}

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  location: string;
  avatar: string;
  phone?: string;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onStartChat,
  onReport,
  currentUserId,
  onViewNestedProfile,
  onProfileUpdate
}) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [following, setFollowing] = useState(user ? isFollowing(currentUserId, user.id) : false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const { onProfileClick } = useProfileClick();
  const navigate = useNavigate();

  // user prop이 변경될 때 currentUser 업데이트
  React.useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  if (!currentUser) return null;

  // 자신의 프로필인지 확인
  const isOwnProfile = currentUser.id === currentUserId;

  // 프로필 모달에 전달할 특별한 프로필 클릭 핸들러
  const handleNestedProfileClick = (userId: number) => {
    // 현재 모달 닫기
    handleClose();
    // 새로운 사용자의 프로필 모달 열기 (부모 컴포넌트에서 처리)
    const clickedUser = getUserById(userId);
    if (clickedUser && onViewNestedProfile) {
      onViewNestedProfile(clickedUser);
    }
  };

  const handleFollowUserClick = (e: React.MouseEvent, userId: number) => {
    e.stopPropagation();
    handleNestedProfileClick(userId);
  };

  const handleFollowToggle = () => {
    const newFollowState = toggleFollow(currentUserId, currentUser.id);
    setFollowing(newFollowState);
  };

  const handleClose = () => {
    setActiveTab('posts');
    setShowFollowers(false);
    setShowFollowing(false);
    setIsProfileEditOpen(false);
    onClose();
  };

  const handleStartChat = () => {
    onStartChat(currentUser.id);
    handleClose();
  };

  const handleReport = () => {
    onReport();
    handleClose();
  };

  const handleProfileSave = (profileData: ProfileData) => {
    const updatedUser = {
      ...currentUser,
      ...profileData
    };
    setCurrentUser(updatedUser);
    
    // 부모 컴포넌트에 업데이트된 사용자 정보 전달
    if (onProfileUpdate) {
      onProfileUpdate(updatedUser);
    }
    
    // 실제로는 API 호출하여 서버에 저장
    console.log('프로필 저장:', profileData);
    
    setIsProfileEditOpen(false);
  };

  // 카드 클릭 핸들러들
  const handlePostClick = (postId: number) => {
    handleClose();
    navigate(`/community-post-detail/${postId}`);
  };

  const handleMoimClick = (moimId: number) => {
    handleClose();
    navigate(`/moim-detail/${moimId}`);
  };

  const handleClassClick = (classId: number) => {
    handleClose();
    navigate(`/class-detail/${classId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 가입`;
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  const userPosts = getUserPosts(currentUser.id, 10);
  const userMoims = getUserMoims(currentUser.id, 12);
  const userClasses = getUserClasses(currentUser.id, 12);

  // 팔로워/팔로잉 목록 표시
  if (showFollowers || showFollowing) {
    const users = showFollowers ? getFollowers(currentUser.id) : getFollowing(currentUser.id);

    return (
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose}
        size="md"
        classNames={{
          base: "max-h-[90vh] z-[10000]",
          backdrop: "z-[10000]",
          wrapper: "z-[10000]",
          body: "p-0"
        }}
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-3 border-b border-divider">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => {
                setShowFollowers(false);
                setShowFollowing(false);
              }}
            >
              <Icon icon="lucide:arrow-left" />
            </Button>
            <span>{showFollowers ? '팔로워' : '팔로잉'} ({users.length})</span>
          </ModalHeader>
          <ModalBody className="max-h-[400px] overflow-y-auto">
            <div className="space-y-3 p-4">
              {users.map((followUser) => (
                <div key={followUser.id} className="flex items-center gap-3">
                  <div 
                    className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                    onClick={(e) => handleFollowUserClick(e, followUser.id)}
                  >
                    <div className="relative">
                      <Avatar src={followUser.avatar} size="md" />
                      {followUser.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{followUser.name}</div>
                      <div className="text-sm text-gray-500">{followUser.location}</div>
                      {followUser.bio && (
                        <div className="text-xs text-gray-400 mt-1 line-clamp-1">{followUser.bio}</div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">팔로워 {followUser.followerCount}</div>
                      <div className="text-xs text-gray-500">★ {followUser.rating}</div>
                    </div>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {showFollowers ? '팔로워가 없습니다' : '팔로잉이 없습니다'}
                </div>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="4xl"
      hideCloseButton={true}
      classNames={{
        base: "max-h-[90vh] w-full max-w-4xl mx-4 z-[10000]",
        backdrop: "z-[10000]",
        wrapper: "z-[10000]",
        body: "p-0"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between border-b border-divider">
          <span className="text-lg font-bold">프로필</span>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={handleClose}
          >
            <Icon icon="lucide:x" />
          </Button>
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col lg:flex-row gap-6 p-6">
            {/* 왼쪽: 프로필 정보 */}
            <div className="lg:w-1/3 space-y-4">
              {/* 기본 정보 카드 */}
              <Card>
                <CardBody className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="relative inline-block">
                      <Avatar src={currentUser.avatar} size="lg" className="w-24 h-24" />
                      {currentUser.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">{currentUser.name}</h2>
                    <p className="text-gray-500 text-sm">{formatDate(currentUser.joinDate)}</p>
                    {currentUser.bio && (
                      <p className="text-sm mt-2 text-gray-600">{currentUser.bio}</p>
                    )}
                  </div>

                  <div className="flex justify-center gap-6">
                    <button 
                      onClick={() => setShowFollowers(true)}
                      className="text-center hover:bg-gray-50 rounded-lg p-2 transition-colors"
                    >
                      <div className="font-bold">{currentUser.followerCount}</div>
                      <div className="text-xs text-gray-500">팔로워</div>
                    </button>
                    <button 
                      onClick={() => setShowFollowing(true)}
                      className="text-center hover:bg-gray-50 rounded-lg p-2 transition-colors"
                    >
                      <div className="font-bold">{currentUser.followingCount}</div>
                      <div className="text-xs text-gray-500">팔로잉</div>
                    </button>
                  </div>

                  <div className="text-sm space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Icon icon="lucide:map-pin" className="text-gray-400" />
                      <span>{currentUser.location}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Icon icon="lucide:star" className="text-yellow-400" />
                      <span>{currentUser.rating} ({currentUser.reviewCount}개 리뷰)</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Icon icon={currentUser.isOnline ? "lucide:circle" : "lucide:clock"} 
                            className={currentUser.isOnline ? "text-green-500" : "text-gray-400"} />
                      <span className="text-sm">
                        {currentUser.isOnline ? '온라인' : currentUser.lastActiveAt ? `마지막 접속: ${getRelativeTime(currentUser.lastActiveAt)}` : '오프라인'}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* 액션 버튼들 */}
              {isOwnProfile ? (
                /* 자신의 프로필일 때 - 프로필 수정 버튼 */
                <div className="space-y-2">
                  <Button
                    color="primary"
                    variant="flat"
                    className="w-full"
                    onPress={() => setIsProfileEditOpen(true)}
                    startContent={<Icon icon="lucide:edit" />}
                  >
                    프로필 수정
                  </Button>
                </div>
              ) : (
                /* 다른 사용자의 프로필일 때 - 팔로우, 채팅, 신고 버튼 */
                <div className="space-y-2">
                  <Button
                    color={following ? "default" : "primary"}
                    variant={following ? "bordered" : "solid"}
                    className="w-full"
                    onPress={handleFollowToggle}
                    startContent={
                      <Icon icon={following ? "lucide:user-minus" : "lucide:user-plus"} />
                    }
                  >
                    {following ? '언팔로우' : '팔로우'}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      color="primary"
                      variant="flat"
                      className="flex-1"
                      onPress={handleStartChat}
                      startContent={<Icon icon="lucide:message-circle" />}
                    >
                      1:1 채팅
                    </Button>
                    <Button
                      color="danger"
                      variant="bordered"
                      className="flex-1"
                      onPress={handleReport}
                      startContent={<Icon icon="lucide:flag" />}
                    >
                      신고하기
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* 오른쪽: 활동 내역 */}
            <div className="lg:w-2/3">
              <Tabs 
                selectedKey={activeTab} 
                onSelectionChange={(key) => setActiveTab(key as string)}
                classNames={{
                  tabList: "w-full",
                  cursor: "bg-primary",
                  tab: "flex-1",
                  tabContent: "text-sm"
                }}
              >
                <Tab key="posts" title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:edit-3" />
                    <span>작성글 ({currentUser.postsCount})</span>
                  </div>
                }>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {userPosts.map((post) => (
                      <Card 
                        key={post.id} 
                        isPressable 
                        className="hover:shadow-md transition-shadow h-36"
                        onPress={() => handlePostClick(post.id)}
                      >
                        <CardBody className="p-4 h-full flex flex-col justify-between">
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold line-clamp-2 flex-1 text-sm">{post.title}</h3>
                              <Badge size="sm" variant="flat" className="ml-2 flex-shrink-0">
                                {post.boardTypeId === 2 ? '자유' : post.boardTypeId === 3 ? '질문' : '노하우'}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2 mb-2">{post.content}</p>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{getRelativeTime(post.createdAt)}</span>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <Icon icon="lucide:heart" className="w-3 h-3" />
                                {post.likeCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon icon="lucide:message-circle" className="w-3 h-3" />
                                {post.commentCount}
                              </span>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                    {userPosts.length === 0 && (
                      <div className="col-span-full text-center py-12 text-gray-500">
                        <Icon icon="lucide:edit-3" className="mx-auto mb-4 text-gray-300 text-5xl" />
                        <p>아직 작성한 글이 없습니다</p>
                      </div>
                    )}
                  </div>
                </Tab>

                <Tab key="moims" title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:users" />
                    <span>가입 모임 ({currentUser.joinedMoimsCount})</span>
                  </div>
                }>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {userMoims.map((moim) => (
                      <Card 
                        key={moim.id} 
                        isPressable 
                        className="hover:shadow-md transition-shadow h-36"
                        onPress={() => handleMoimClick(moim.id)}
                      >
                        <CardBody className="p-4 h-full">
                          <div className="flex items-start gap-3 h-full">
                            <img
                              src={moim.image}
                              alt={moim.title}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                              <div>
                                <h3 className="font-semibold line-clamp-1 mb-1 text-sm">{moim.title}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge size="sm" variant="flat" color="primary" className="text-xs">
                                    {moim.categoryId === 2 ? '아웃도어' : 
                                     moim.categoryId === 8 ? '도서/학습' : 
                                     moim.categoryId === 14 ? '음식' : '기타'}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 space-y-1">
                                <div className="flex items-center gap-1">
                                  <Icon icon="lucide:users" className="w-3 h-3" />
                                  <span>{moim.memberCount}/{moim.maxMembers}명</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Icon icon="lucide:map-pin" className="w-3 h-3" />
                                  <span className="truncate">{moim.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                    {userMoims.length === 0 && (
                      <div className="col-span-full text-center py-12 text-gray-500">
                        <Icon icon="lucide:users" className="mx-auto mb-4 text-gray-300 text-5xl" />
                        <p>참여한 모임이 없습니다</p>
                      </div>
                    )}
                  </div>
                </Tab>

                <Tab key="classes" title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:book-open" />
                    <span>참여 수업 ({currentUser.completedClassesCount})</span>
                  </div>
                }>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {userClasses.map((cls) => (
                      <Card 
                        key={cls.id} 
                        isPressable 
                        className="hover:shadow-md transition-shadow h-36"
                        onPress={() => handleClassClick(cls.id)}
                      >
                        <CardBody className="p-4 h-full">
                          <div className="flex items-start gap-3 h-full">
                            <img
                              src={cls.image}
                              alt={cls.title}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                              <div>
                                <h3 className="font-semibold line-clamp-1 mb-1 text-sm">{cls.title}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge 
                                    size="sm" 
                                    variant="flat" 
                                    color={cls.instructor.id === currentUser.id ? "success" : "default"}
                                    className="text-xs"
                                  >
                                    {cls.instructor.id === currentUser.id ? '강사' : '수강생'}
                                  </Badge>
                                  {cls.isOnline && (
                                    <Badge size="sm" variant="flat" color="secondary" className="text-xs">온라인</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 space-y-1">
                                <div className="flex items-center gap-1">
                                  <Icon icon="lucide:user" className="w-3 h-3" />
                                  <span>{cls.instructor.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Icon icon="lucide:star" className="w-3 h-3" />
                                  <span>{cls.rating} ({cls.reviewCount})</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                    {userClasses.length === 0 && (
                      <div className="col-span-full text-center py-12 text-gray-500">
                        <Icon icon="lucide:book-open" className="mx-auto mb-4 text-gray-300 text-5xl" />
                        <p>참여한 수업이 없습니다</p>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </ModalBody>
      </ModalContent>

      {/* 프로필 수정 모달 */}
      {isOwnProfile && (
        <ProfileEditModal
          isOpen={isProfileEditOpen}
          onClose={() => setIsProfileEditOpen(false)}
          onSave={handleProfileSave}
          currentProfile={{
            name: currentUser.name,
            email: currentUser.email || 'user@example.com',
            bio: currentUser.bio || '',
            location: currentUser.location,
            avatar: currentUser.avatar,
            phone: currentUser.phone || ''
          }}
        />
      )}
    </Modal>
  );
};

export default UserProfileModal;
