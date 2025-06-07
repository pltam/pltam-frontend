import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, Chip, Avatar, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { mockMoims } from '../../data/mockData';
import { useAppContext } from '../../context/AppContext';
import { useProfileClick } from '../../components/profile/ProfileClickProvider';

const MoimDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories } = useAppContext();
  const { onProfileClick } = useProfileClick();

  // 실제 데이터 가져오기
  const moimData = mockMoims.find(moim => moim.id === Number(id));
  
  // 모임이 없으면 404 처리
  if (!moimData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">모임을 찾을 수 없습니다</h1>
          <Button onPress={() => navigate('/moim')}>
            모임 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "";
  };

  const getSubCategoryName = (categoryId: number, subCategoryId?: number) => {
    if (!subCategoryId) return "";
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return "";
    
    const subCategory = category.subCategories.find(sub => sub.id === subCategoryId);
    return subCategory ? subCategory.name : "";
  };

  const sampleParticipants = [
    { id: 103, name: '이등산', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=103' },
    { id: 104, name: '정독서', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=104' },
    { id: 105, name: '최사진', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=105' },
    { id: 107, name: '김코딩', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=107' },
    { id: 108, name: '박라이더', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=108' }
  ];

  const handleLeaderClick = (e: React.MouseEvent, leaderId: number) => {
    e.stopPropagation();
    onProfileClick(leaderId, e);
  };

  const handleParticipantClick = (e: React.MouseEvent, participantId: number) => {
    e.stopPropagation();
    onProfileClick(participantId, e);
  };

  const handleJoin = () => {
    alert('모임 참여 신청이 완료되었습니다!');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="light"
          startContent={<Icon icon="lucide:arrow-left" />}
          onPress={handleBack}
          className="mb-6"
        >
          뒤로가기
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardBody className="p-0">
                <img 
                  src={moimData.image} 
                  alt={moimData.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Chip size="sm" variant="flat" color="secondary">
                      {getCategoryName(moimData.categoryId)}
                    </Chip>
                    {moimData.subCategoryId && (
                      <Chip size="sm" variant="flat" color="warning">
                        {getSubCategoryName(moimData.categoryId, moimData.subCategoryId)}
                      </Chip>
                    )}
                    <Chip size="sm" variant="flat" color="primary">
                      {moimData.isRegular ? '정기모임' : '원데이'}
                    </Chip>
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {moimData.title}
                  </h1>
                  
                  <div 
                    className="flex items-center gap-4 mb-6 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                    onClick={(e) => handleLeaderClick(e, moimData.leader.id)}
                  >
                    <Avatar src={moimData.leader.avatar} size="sm" />
                    <span className="font-medium">{moimData.leader.name}</span>
                    <Chip size="sm" variant="flat" color="primary">모임장</Chip>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <Icon icon="lucide:users" className="text-2xl text-primary mx-auto mb-2" />
                      <p className="text-sm text-foreground-600">인원</p>
                      <p className="font-medium">{moimData.memberCount}/{moimData.maxMembers}명</p>
                    </div>
                    <div className="text-center">
                      <Icon icon="lucide:calendar" className="text-2xl text-primary mx-auto mb-2" />
                      <p className="text-sm text-foreground-600">모임형태</p>
                      <p className="font-medium">{moimData.isRegular ? "정기" : "원데이"}</p>
                    </div>
                    <div className="text-center">
                      <Icon icon="lucide:map-pin" className="text-2xl text-primary mx-auto mb-2" />
                      <p className="text-sm text-foreground-600">위치</p>
                      <p className="font-medium">{moimData.location}</p>
                    </div>
                    <div className="text-center">
                      <Icon icon="lucide:heart" className="text-2xl text-primary mx-auto mb-2" />
                      <p className="text-sm text-foreground-600">상태</p>
                      <p className="font-medium">{moimData.memberCount < moimData.maxMembers ? "모집중" : "마감"}</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="mb-6">
              <CardBody className="p-6">
                <h2 className="text-xl font-bold mb-4">모임 소개</h2>
                <div className="text-foreground-600 whitespace-pre-line">
                  {moimData.description}
                </div>
              </CardBody>
            </Card>

            <Card className="mb-6">
              <CardBody className="p-6">
                <h2 className="text-xl font-bold mb-4">모임 정보</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:users" className="text-primary text-lg" />
                    <span className="text-foreground-600">
                      현재 {moimData.memberCount}명 참여 중 (최대 {moimData.maxMembers}명)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:calendar-days" className="text-primary text-lg" />
                    <span className="text-foreground-600">
                      {moimData.isRegular ? "정기적으로 진행되는 모임" : "일회성 모임"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:map-pin" className="text-primary text-lg" />
                    <span className="text-foreground-600">
                      활동 장소: {moimData.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:crown" className="text-primary text-lg" />
                    <span className="text-foreground-600">
                      모임장: {moimData.leader.name}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-bold mb-4">참여자 ({sampleParticipants.length}명)</h2>
                <div className="flex flex-wrap gap-4">
                  {sampleParticipants.map((participant) => (
                    <div 
                      key={participant.id} 
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                      onClick={(e) => handleParticipantClick(e, participant.id)}
                    >
                      <Avatar src={participant.avatar} size="sm" />
                      <span className="text-sm font-medium">{participant.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-foreground-500 text-sm mt-4">
                  * 개인정보 보호를 위해 일부 정보만 표시됩니다.
                </p>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardBody className="p-6">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-foreground mb-2">
                    무료 모임
                  </div>
                  <p className="text-foreground-500 text-sm">참여비 없음</p>
                </div>

                <Divider className="my-4" />

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-foreground-600">모임 장소</span>
                    <span className="font-medium text-sm">{moimData.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-600">모임 형태</span>
                    <span className="font-medium">{moimData.isRegular ? "정기모임" : "원데이"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-600">현재 인원</span>
                    <span className="font-medium">{moimData.memberCount}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-600">남은 자리</span>
                    <span className="font-medium text-primary">{moimData.maxMembers - moimData.memberCount}자리</span>
                  </div>
                </div>

                <Button 
                  color="primary" 
                  size="lg" 
                  className="w-full font-bold"
                  onPress={handleJoin}
                  isDisabled={moimData.memberCount >= moimData.maxMembers}
                >
                  {moimData.memberCount >= moimData.maxMembers ? '마감됨' : '모임 참여하기'}
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoimDetailPage;