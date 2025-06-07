import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, Chip, Avatar, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { mockClasses } from '../../data/mockData';
import { useAppContext } from '../../context/AppContext';
import { useProfileClick } from '../../components/profile/ProfileClickProvider';

const ClassDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories } = useAppContext();
  const { onProfileClick } = useProfileClick();

  // 실제 데이터 가져오기
  const classData = mockClasses.find(cls => cls.id === Number(id));
  
  // 클래스가 없으면 404 처리
  if (!classData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">수업을 찾을 수 없습니다</h1>
          <Button onPress={() => navigate('/classes')}>
            수업 목록으로 돌아가기
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

  const handleInstructorClick = (e: React.MouseEvent, instructorId: number) => {
    e.stopPropagation();
    onProfileClick(instructorId, e);
  };

  const handleApply = () => {
    alert('수업 신청이 완료되었습니다!');
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
                  src={classData.image} 
                  alt={classData.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Chip size="sm" variant="flat" color="primary">
                      {getCategoryName(classData.categoryId)}
                    </Chip>
                    {classData.subCategoryId && (
                      <Chip size="sm" variant="flat" color="secondary">
                        {getSubCategoryName(classData.categoryId, classData.subCategoryId)}
                      </Chip>
                    )}
                    <Chip size="sm" variant="flat" color="default">
                      {classData.isOnline ? "온라인" : "오프라인"}
                    </Chip>
                    <Chip size="sm" variant="flat" color="warning">
                      {classData.isGroup ? "그룹" : "1:1"}
                    </Chip>
                    <Chip size="sm" variant="flat" color="success">
                      {classData.isOneDay ? "원데이" : "정기"}
                    </Chip>
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {classData.title}
                  </h1>
                  
                  <div 
                    className="flex items-center gap-4 mb-6 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                    onClick={(e) => handleInstructorClick(e, classData.instructor.id)}
                  >
                    <Avatar src={classData.instructor.avatar} size="sm" />
                    <span className="font-medium">{classData.instructor.name}</span>
                    <div className="flex items-center gap-1">
                      <Icon icon="lucide:star" className="text-warning fill-current text-sm" />
                      <span className="text-sm font-medium">{classData.rating}</span>
                      <span className="text-foreground-400 text-sm">({classData.reviewCount}개 리뷰)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <Icon icon="lucide:clock" className="text-2xl text-primary mx-auto mb-2" />
                      <p className="text-sm text-foreground-600">수업시간</p>
                      <p className="font-medium">{classData.duration}분</p>
                    </div>
                    <div className="text-center">
                      <Icon icon="lucide:star" className="text-2xl text-primary mx-auto mb-2" />
                      <p className="text-sm text-foreground-600">평점</p>
                      <p className="font-medium">{classData.rating}점</p>
                    </div>
                    <div className="text-center">
                      <Icon icon="lucide:map-pin" className="text-2xl text-primary mx-auto mb-2" />
                      <p className="text-sm text-foreground-600">위치</p>
                      <p className="font-medium text-sm">{classData.location}</p>
                    </div>
                    <div className="text-center">
                      <Icon icon="lucide:users" className="text-2xl text-primary mx-auto mb-2" />
                      <p className="text-sm text-foreground-600">형태</p>
                      <p className="font-medium text-sm">{classData.isGroup ? "그룹" : "1:1"}</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="mb-6">
              <CardBody className="p-6">
                <h2 className="text-xl font-bold mb-4">수업 소개</h2>
                <div className="text-foreground-600 whitespace-pre-line">
                  {classData.description}
                </div>
              </CardBody>
            </Card>

            <Card className="mb-6">
              <CardBody className="p-6">
                <h2 className="text-xl font-bold mb-4">수업 정보</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:globe" className="text-primary text-lg" />
                    <span className="text-foreground-600">
                      {classData.isOnline ? "온라인 수업" : "오프라인 수업"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:users" className="text-primary text-lg" />
                    <span className="text-foreground-600">
                      {classData.isGroup ? "그룹 수업" : "1:1 개인 수업"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:calendar" className="text-primary text-lg" />
                    <span className="text-foreground-600">
                      {classData.isOneDay ? "원데이 클래스" : "정기 수업"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:clock" className="text-primary text-lg" />
                    <span className="text-foreground-600">
                      수업 시간: {classData.duration}분
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-bold mb-4">강사 정보</h2>
                <div 
                  className="flex items-center gap-4 mb-4 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                  onClick={(e) => handleInstructorClick(e, classData.instructor.id)}
                >
                  <Avatar src={classData.instructor.avatar} size="lg" />
                  <div>
                    <h3 className="font-semibold text-lg">{classData.instructor.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Icon icon="lucide:star" className="text-warning fill-current text-sm" />
                      <span className="text-sm font-medium">{classData.rating}</span>
                      <span className="text-foreground-400 text-sm">• {classData.reviewCount}개 리뷰</span>
                    </div>
                  </div>
                </div>
                <p className="text-foreground-600">
                  전문적인 경험과 노하우를 바탕으로 친절하고 체계적인 수업을 진행합니다.
                  학생 개개인의 수준에 맞춰 맞춤형 피드백을 제공하여 실력 향상을 도와드립니다.
                </p>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardBody className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {classData.price.toLocaleString()}원
                  </div>
                  <p className="text-foreground-500 text-sm">5회 수업 기준</p>
                </div>

                <Divider className="my-4" />

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-foreground-600">수업 형태</span>
                    <span className="font-medium text-sm">
                      {classData.isOnline ? "온라인" : "오프라인"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-600">수업 인원</span>
                    <span className="font-medium text-sm">
                      {classData.isGroup ? "그룹" : "1:1"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-600">수업 기간</span>
                    <span className="font-medium text-sm">
                      {classData.isOneDay ? "원데이" : "정기"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-600">수업 시간</span>
                    <span className="font-medium text-sm">{classData.duration}분</span>
                  </div>
                </div>

                <Button
                  color="primary"
                  size="lg"
                  className="w-full font-bold"
                  onPress={handleApply}
                >
                  수업 신청하기
                </Button>

                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-foreground-500">
                  <div className="flex items-center gap-1">
                    <Icon icon="lucide:star" className="text-warning fill-current" />
                    <span>{classData.rating}점</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon icon="lucide:message-circle" />
                    <span>{classData.reviewCount}개 리뷰</span>
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

export default ClassDetailPage;