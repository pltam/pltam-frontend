import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-content2 py-10 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <Icon icon="lucide:compass" className="text-primary text-2xl mr-2" />
              <span className="font-bold text-xl text-foreground">플탐</span>
            </div>
            <p className="text-foreground-500 text-sm mb-4">
              취미 기반 커뮤니티 및 교육 매칭 플랫폼
            </p>
            <div className="flex space-x-4">
              <button className="text-foreground-400 hover:text-primary transition-colors">
                <Icon icon="lucide:instagram" className="text-xl" />
              </button>
              <button className="text-foreground-400 hover:text-primary transition-colors">
                <Icon icon="lucide:facebook" className="text-xl" />
              </button>
              <button className="text-foreground-400 hover:text-primary transition-colors">
                <Icon icon="lucide:youtube" className="text-xl" />
              </button>
              <button className="text-foreground-400 hover:text-primary transition-colors">
                <Icon icon="lucide:twitter" className="text-xl" />
              </button>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-foreground mb-4">서비스</h3>
            <ul className="space-y-2">
              <li><Link to="/classes" className="text-foreground-500 hover:text-primary text-sm">수업</Link></li>
              <li><Link to="/moim" className="text-foreground-500 hover:text-primary text-sm">모임</Link></li>
              <li><Link to="/community" className="text-foreground-500 hover:text-primary text-sm">커뮤니티</Link></li>
              <li><Link to="/schedule" className="text-foreground-500 hover:text-primary text-sm">일정 관리</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-foreground mb-4">회사</h3>
            <ul className="space-y-2">
              <li><button className="text-foreground-500 hover:text-primary text-sm">회사 소개</button></li>
              <li><button className="text-foreground-500 hover:text-primary text-sm">채용 정보</button></li>
              <li><button className="text-foreground-500 hover:text-primary text-sm">보도자료</button></li>
              <li><button className="text-foreground-500 hover:text-primary text-sm">이용약관</button></li>
              <li><button className="text-foreground-500 hover:text-primary text-sm">개인정보처리방침</button></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-foreground mb-4">고객 지원</h3>
            <ul className="space-y-2">
              <li><button className="text-foreground-500 hover:text-primary text-sm">자주 묻는 질문</button></li>
              <li><button className="text-foreground-500 hover:text-primary text-sm">문의하기</button></li>
              <li><button className="text-foreground-500 hover:text-primary text-sm">피드백</button></li>
              <li><button className="text-foreground-500 hover:text-primary text-sm">공지사항</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-divider mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground-400 text-xs mb-4 md:mb-0">
            © 2024 플탐(PLTAM). All rights reserved.
          </p>
          <div className="flex space-x-6">
            <button className="text-foreground-400 hover:text-primary text-xs">이용약관</button>
            <button className="text-foreground-400 hover:text-primary text-xs">개인정보처리방침</button>
            <button className="text-foreground-400 hover:text-primary text-xs">쿠키 정책</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;