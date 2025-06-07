import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardFooter, Button, Chip, Avatar } from '@heroui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { useProfileClick } from '../profile/ProfileClickProvider';
import { mockMoims } from '../../data/mockData';

// Import Swiper styles
import 'swiper/css';

const MoimCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCategory, categories } = useAppContext();
  const { onProfileClick } = useProfileClick();

  // 카테고리에 따라 필터링
  const filteredMoims = React.useMemo(() => {
    if (!selectedCategory) {
      return mockMoims;
    }
    return mockMoims.filter(moim => moim.categoryId === selectedCategory.id);
  }, [selectedCategory]);

  const handleCardClick = (moimId: number) => {
    navigate(`/moim-detail/${moimId}`);
  };

  const handleLeaderClick = (e: React.MouseEvent<HTMLDivElement>, leaderId: number) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    onProfileClick(leaderId, e);
  };

  if (filteredMoims.length === 0) {
    return (
      <section className="py-10 bg-foreground-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">인기 모임</h2>
            <Button 
              as={Link}
              to="/moim"
              variant="light"
              color="primary"
              endContent={<Icon icon="lucide:arrow-right" />}
            >
              더보기
            </Button>
          </div>
          <div className="text-center py-8 text-foreground-500">
            선택한 카테고리에 해당하는 모임이 없습니다.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-foreground-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">인기 모임</h2>
          <Button 
            as={Link}
            to="/moim"
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
            {filteredMoims.map((moim) => {
              return (
                <SwiperSlide key={moim.id}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <Card 
                      className="h-full cursor-pointer w-full hover:shadow-lg transition-shadow duration-200"
                      isPressable
                      onPress={() => handleCardClick(moim.id)}
                    >
                      <CardBody className="p-0">
                        <div className="relative w-full h-48">
                          <img 
                            src={moim.image || "https://lh3.googleusercontent.com/gg-dl/AJfQ9KT-A4RSbVPHZBpdJBmrss_9_QuaY2xVAA7EcGZ4JzqqV2r-6VlcSgAHCzhRP8KhMfB6-7tB6yW0kYbsLLOwYjWntr1HPAIt_FNZeAQUyWntZeCPyraUic6QC2729hSyA6xSSRDlTWurgXNKUUM9yIzt2oEHDYYQf823hmuCqmli-dvnBQ=s1024"} 
                            alt={moim.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <Chip 
                              size="sm"
                              className="bg-white/90 backdrop-blur-sm text-foreground-600 font-medium shadow-sm"
                              variant="solid"
                            >
                              {categories.find(cat => cat.id === moim.categoryId)?.name || "카테고리"}
                            </Chip>
                            <Chip 
                              size="sm"
                              className="bg-secondary/90 backdrop-blur-sm text-white font-medium shadow-sm"
                              variant="solid"
                            >
                              {moim.isRegular ? "정기모임" : "원데이"}
                            </Chip>
                          </div>
                        </div>
                        
                        <div className="p-4 flex-1">
                          <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2 min-h-[3.5rem]">
                            {moim.title}
                          </h3>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-foreground-600">
                              <Icon icon="lucide:map-pin" className="text-sm" />
                              <span>{moim.location}</span>
                            </div>
                            <div 
                              className="flex items-center gap-2 text-sm text-foreground-600 cursor-pointer hover:bg-gray-50 rounded-lg p-1 -mx-1 transition-colors"
                              onClick={(e) => handleLeaderClick(e, moim.leader.id)}
                            >
                              <Avatar src={moim.leader.avatar} size="sm" />
                              <span>{moim.leader.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground-600">
                              <Icon icon="lucide:users" className="text-sm" />
                              <span>{moim.memberCount}/{moim.maxMembers}명</span>
                            </div>
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

export default MoimCarousel;