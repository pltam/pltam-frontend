import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const AppDownload: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            플탐 앱으로 더 편리하게!
          </motion.h2>
          <motion.p 
            className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            언제 어디서나 새로운 취미를 발견하고, 모임에 참여하고, 경험을 공유하세요
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button 
              size="lg"
              className="bg-black text-white hover:bg-gray-800 min-w-[200px]"
              startContent={<Icon icon="lucide:smartphone" className="text-xl" />}
            >
              <div className="text-left">
                <div className="text-xs text-gray-300">Download on the</div>
                <div className="text-base font-semibold">App Store</div>
              </div>
            </Button>
            
            <Button 
              size="lg"
              className="bg-black text-white hover:bg-gray-800 min-w-[200px]"
              startContent={<Icon icon="lucide:play" className="text-xl" />}
            >
              <div className="text-left">
                <div className="text-xs text-gray-300">GET IT ON</div>
                <div className="text-base font-semibold">Google Play</div>
              </div>
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex justify-center items-center gap-8 text-primary-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Icon icon="lucide:users" className="text-xl" />
              <span className="text-sm md:text-base">10만+ 사용자</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:star" className="text-xl fill-current text-warning" />
              <span className="text-sm md:text-base">4.8점 평점</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:award" className="text-xl" />
              <span className="text-sm md:text-base">베스트 앱</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;