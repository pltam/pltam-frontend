import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, Chip, Avatar, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { mockSchedules, mockClasses, mockMoims } from '../../data/mockData';
import { Schedule } from '../../types/category';
import { useAppContext } from '../../context/AppContext';

const ScheduleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories } = useAppContext();

  const scheduleData: Schedule | undefined = mockSchedules.find(s => s.id === parseInt(id || '0'));

  if (!scheduleData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <Icon icon="lucide:calendar-x" className="text-foreground-300 text-5xl mb-4" />
            <p className="text-foreground-600 mb-4">일정을 찾을 수 없습니다</p>
            <Button color="primary" onPress={() => navigate('/schedule')}>
              일정 목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      weekday: 'long',
      year: 'numeric'
    };
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    // 일정 수정 기능 (향후 구현)
    console.log('일정 수정');
  };

  const handleDelete = () => {
    // 일정 삭제 기능 (향후 구현)
    console.log('일정 삭제');
    navigate('/schedule');
  };

  const getRelatedData = () => {
    if (scheduleData.type === 'class') {
      return mockClasses.find(cls => cls.title === scheduleData.title);
    } else if (scheduleData.type === 'moim') {
      return mockMoims.find(moim => moim.title === scheduleData.title);
    }
    return null;
  };

  const relatedData = getRelatedData();

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
                {scheduleData.image && (
                  <img 
                    src={scheduleData.image} 
                    alt={scheduleData.title}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Chip 
                      size="sm" 
                      variant="flat" 
                      color={
                        scheduleData.type === 'class' 
                          ? "primary" 
                          : scheduleData.type === 'moim'
                          ? "secondary"
                          : "default"
                      }
                    >
                      {scheduleData.type === 'class' ? '수업' : scheduleData.type === 'moim' ? '모임' : '개인 일정'}
                    </Chip>
                    {scheduleData.categoryId && (
                      <Chip size="sm" variant="flat" color="warning">
                        {getCategoryName(scheduleData.categoryId)}
                      </Chip>
                    )}
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {scheduleData.title}
                  </h1>
                  
                  {(scheduleData.instructor || scheduleData.leader) && (
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar 
                        src={scheduleData.instructor?.avatar || scheduleData.leader?.avatar} 
                        size="sm" 
                      />
                      <span className="font-medium">
                        {scheduleData.instructor?.name || scheduleData.leader?.name}
                      </span>
                      <Chip size="sm" variant="flat" color="primary">
                        {scheduleData.instructor ? '강사' : '모임장'}
                      </Chip>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-default-50 rounded-lg">
                      <Icon icon="lucide:calendar" className="text-2xl text-primary mx-auto mb-2" />
                      <p className="text-sm text-foreground-600">일시</p>
                      <p className="font-medium text-sm">{formatDate(scheduleData.date)}</p>
                    </div>
                    <div className="text-center p-4 bg-default-50 rounded-lg">
                      <Icon icon="lucide:map-pin" className="text-2xl text-primary mx-auto mb-2" />
                      <p className="text-sm text-foreground-600">장소</p>
                      <p className="font-medium">{scheduleData.location}</p>
                    </div>
                    <div className="text-center p-4 bg-default-50 rounded-lg">
                      <Icon icon="lucide:clock" className="text-2xl text-primary mx-auto mb-2" />
                      <p className="text-sm text-foreground-600">상태</p>
                      <p className="font-medium">
                        {new Date(scheduleData.date) > new Date() ? '예정' : '완료'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {relatedData && (
              <Card className="mb-6">
                <CardBody className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    {scheduleData.type === 'class' ? '수업' : '모임'} 정보
                  </h2>
                  <div className="text-foreground-600 whitespace-pre-line">
                    {relatedData.description}
                  </div>
                  
                  {scheduleData.type === 'class' && relatedData && 'price' in relatedData && (
                    <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground-600">수업료</span>
                        <span className="font-bold text-lg text-primary">
                          {relatedData.price.toLocaleString()}원
                        </span>
                      </div>
                      {'duration' in relatedData && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-foreground-600">수업 시간</span>
                          <span className="font-medium">{relatedData.duration}분</span>
                        </div>
                      )}
                    </div>
                  )}

                  {scheduleData.type === 'moim' && relatedData && 'memberCount' in relatedData && (
                    <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground-600">참여 인원</span>
                        <span className="font-bold text-lg text-secondary">
                          {relatedData.memberCount}
                          {'maxMembers' in relatedData && `/${relatedData.maxMembers}`}명
                        </span>
                      </div>
                      {'isRegular' in relatedData && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-foreground-600">모임 유형</span>
                          <span className="font-medium">
                            {relatedData.isRegular ? '정기 모임' : '원데이'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            )}

            {/* 개인 일정인 경우에만 수정/삭제 버튼 표시 */}
            {scheduleData.type === 'custom' && (
              <Card>
                <CardBody className="p-6">
                  <h2 className="text-xl font-bold mb-4">일정 관리</h2>
                  <div className="flex gap-4">
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<Icon icon="lucide:edit" />}
                      onPress={handleEdit}
                    >
                      일정 수정
                    </Button>
                    <Button
                      color="danger"
                      variant="flat"
                      startContent={<Icon icon="lucide:trash-2" />}
                      onPress={handleDelete}
                    >
                      일정 삭제
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardBody className="p-6">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-foreground mb-2">
                    일정 정보
                  </div>
                  <p className="text-foreground-500 text-sm">
                    {scheduleData.type === 'class' ? '수업 일정' : 
                     scheduleData.type === 'moim' ? '모임 일정' : '개인 일정'}
                  </p>
                </div>

                <Divider className="my-4" />

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-foreground-600">일시</span>
                    <span className="font-medium text-sm text-right">
                      {new Date(scheduleData.date).toLocaleDateString('ko-KR')}
                      <br />
                      {new Date(scheduleData.date).toLocaleTimeString('ko-KR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-600">장소</span>
                    <span className="font-medium text-sm text-right">{scheduleData.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-600">유형</span>
                    <span className="font-medium">
                      {scheduleData.type === 'class' ? '수업' : 
                       scheduleData.type === 'moim' ? '모임' : '개인 일정'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-600">상태</span>
                    <Chip 
                      size="sm" 
                      color={new Date(scheduleData.date) > new Date() ? "success" : "default"}
                      variant="flat"
                    >
                      {new Date(scheduleData.date) > new Date() ? '예정' : '완료'}
                    </Chip>
                  </div>
                </div>

                {scheduleData.type !== 'custom' && (
                  <Button 
                    color="primary" 
                    size="lg" 
                    className="w-full font-bold"
                    onPress={() => {
                      if (scheduleData.type === 'class') {
                        const relatedClass = mockClasses.find(cls => cls.title === scheduleData.title);
                        if (relatedClass) navigate(`/class-detail/${relatedClass.id}`);
                      } else if (scheduleData.type === 'moim') {
                        const relatedMoim = mockMoims.find(moim => moim.title === scheduleData.title);
                        if (relatedMoim) navigate(`/moim-detail/${relatedMoim.id}`);
                      }
                    }}
                  >
                    {scheduleData.type === 'class' ? '수업 상세보기' : '모임 상세보기'}
                  </Button>
                )}

                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-foreground-500">
                  <div className="flex items-center gap-1">
                    <Icon icon="lucide:calendar" />
                    <span>일정</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon icon="lucide:map-pin" />
                    <span>{scheduleData.location}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailPage;