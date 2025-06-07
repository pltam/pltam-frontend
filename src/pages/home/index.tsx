import React from 'react';
import HeroCarousel from '../../components/home/HeroCarousel';
import CategorySection from '../../components/home/CategorySection';
import ClassesCarousel from '../../components/home/ClassesCarousel';
import MoimCarousel from '../../components/home/MoimCarousel';
import CommunitySection from '../../components/home/CommunitySection';

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroCarousel />
      <CategorySection />
      <ClassesCarousel />
      <MoimCarousel />
      <CommunitySection />
    </div>
  );
};

export default HomePage;