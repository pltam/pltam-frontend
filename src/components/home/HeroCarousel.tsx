import React from 'react';
import { Button } from '@heroui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroCarousel: React.FC = () => {
  const slides = [
    {
      id: 1,
      title: '새로운 취미를 발견하세요',
      description: '다양한 취미 활동과 수업을 탐색하고 새로운 경험을 시작하세요',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop',
      buttonText: '수업 둘러보기',
      buttonLink: '/classes'
    },
    {
      id: 2,
      title: '함께하는 즐거움',
      description: '같은 관심사를 가진 사람들과 모임에 참여하고 친구를 만들어보세요',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=600&fit=crop',
      buttonText: '모임 찾기',
      buttonLink: '/moim'
    },
    {
      id: 3,
      title: '경험을 공유하세요',
      description: '커뮤니티에서 취미 활동에 대한 경험과 노하우를 나누세요',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&h=600&fit=crop',
      buttonText: '커뮤니티 가기',
      buttonLink: '/community'
    }
  ];

  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="rounded-xl overflow-hidden"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[400px] md:h-[500px] w-full">
              <div className="absolute inset-0 z-0">
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
              <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-white mb-8 max-w-2xl">
                  {slide.description}
                </p>
                <Button 
                  color="primary" 
                  size="lg" 
                  radius="full"
                  className="font-medium"
                  as="a"
                  href={slide.buttonLink}
                >
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;