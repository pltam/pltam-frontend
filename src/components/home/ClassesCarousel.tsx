import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardFooter, Button, Chip, Avatar } from '@heroui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { useProfileClick } from '../profile/ProfileClickProvider';
import { mockClasses, getUserById } from '../../data/mockData';

// Import Swiper styles
import 'swiper/css';

const ClassesCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCategory, categories } = useAppContext();
  const { onProfileClick } = useProfileClick();

  // 카테고리에 따라 필터링
  const filteredClasses = React.useMemo(() => {
    if (!selectedCategory) {
      return mockClasses;
    }
    return mockClasses.filter(classItem => classItem.categoryId === selectedCategory.id);
  }, [selectedCategory]);

  const handleCardClick = (classId: number) => {
    navigate(`/class-detail/${classId}`);
  };

  const handleInstructorClick = (e: React.MouseEvent<HTMLDivElement>, instructorId: number) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    const syntheticEvent = e as any; // PressEvent와 MouseEvent 호환성을 위한 타입 캐스팅
    onProfileClick(instructorId, syntheticEvent);
  };

  if (filteredClasses.length === 0) {
    return (
      <section className="py-10 bg-foreground-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">인기 수업</h2>
            <Button 
              as={Link}
              to="/classes"
              variant="light"
              color="primary"
              endContent={<Icon icon="lucide:arrow-right" />}
            >
              더보기
            </Button>
          </div>
          <div className="text-center py-8 text-foreground-500">
            선택한 카테고리에 해당하는 수업이 없습니다.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-foreground-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">인기 수업</h2>
          <Button 
            as={Link}
            to="/classes"
            variant="light"
            color="primary"
            endContent={<Icon icon="lucide:arrow-right" />}
          >
            더보기
          </Button>
        </div>
        
        <div className="relative">
          <Swiper
            modules={[]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            className="overflow-visible"
          >
            {filteredClasses.map((classItem) => {
              return (
                <SwiperSlide key={classItem.id}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <Card 
                      className="h-full cursor-pointer w-full hover:shadow-lg transition-shadow duration-200"
                      isPressable
                      onPress={() => handleCardClick(classItem.id)}
                    >
                      <CardBody className="p-0">
                        <div className="relative w-full h-48">
                          <img 
                            src={classItem.image || "https://lh3.googleusercontent.com/gg-dl/AJfQ9KS8R_vEePPHU-_TEQ8TjwGEkMWYWQxqGaynFPX5AwBYchP1B0W1aZ8WKojvxkL_VCw0rPRPVesJy1CTb-ozlFlMCVV8x6eMaXq99HC3PS41GVG9XBd9azLKlc546Xk_RGRdqlGsat6IZNWeAgoH9wsvSutH4iQD0jgwD3xWMGNCyYjaBA=s1024"} 
                            alt={classItem.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <Chip 
                              size="sm"
                              className="bg-white/90 backdrop-blur-sm text-foreground-600 font-medium shadow-sm"
                              variant="solid"
                            >
                              {categories.find(cat => cat.id === classItem.categoryId)?.name || "카테고리"}
                            </Chip>
                            <Chip 
                              size="sm"
                              className="bg-primary/90 backdrop-blur-sm text-white font-medium shadow-sm"
                              variant="solid"
                            >
                              {classItem.isOnline ? "온라인" : "오프라인"}
                            </Chip>
                          </div>
                        </div>
                        
                        <div className="p-4 flex-1">
                          <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2 min-h-[3.5rem]">
                            {classItem.title}
                          </h3>
                          
                          {/* 강사 프로필 - 클릭 가능 */}
                          <div 
                            className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                            onClick={(e) => handleInstructorClick(e, classItem.instructor.id)}
                          >
                            <Avatar src={classItem.instructor.avatar} size="sm" />
                            <span className="text-foreground-500 text-sm">{classItem.instructor.name}</span>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1">
                              <Icon icon="lucide:star" className="text-warning fill-current text-sm" />
                              <span className="text-sm font-medium">{classItem.rating}</span>
                              <span className="text-foreground-400 text-sm">({classItem.reviewCount})</span>
                            </div>
                            <span className="font-bold text-lg text-foreground">
                              {classItem.price.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ClassesCarousel;
