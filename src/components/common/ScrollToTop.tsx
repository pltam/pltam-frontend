import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 부드러운 스크롤 효과를 원한다면 아래 코드 사용
    // window.scrollTo({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth'
    // });
    
    // 즉시 최상단으로 이동 (권장)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;