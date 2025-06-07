import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAppContext } from '../../context/AppContext';
import SearchModal from '../search/SearchModal';
import LoginModal from '../auth/LoginModal';
import UserProfileSystem from '../profile/UserProfileSystem';
import UserProfileModal from '../profile/UserProfileModal';
import { getUserById } from '../../data/mockData';

const Header: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, setIsAuthenticated, setIsSearchModalOpen } = useAppContext();
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchUserProfileModal, setSearchUserProfileModal] = React.useState<{
    isOpen: boolean;
    user: any;
  }>({
    isOpen: false,
    user: null
  });

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
  };

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSearchUserClick = (userId: number): void => {
    const user = getUserById(userId);
    if (user) {
      setSearchUserProfileModal({
        isOpen: true,
        user: user
      });
    }
  };

  const handleCloseSearchUserProfile = () => {
    setSearchUserProfileModal({
      isOpen: false,
      user: null
    });
  };

  const handleMyProfileClick = () => {
    // 현재 로그인한 사용자의 프로필 모달 열기
    const currentUser = getUserById(1); // 실제로는 로그인한 사용자 ID 사용
    if (currentUser) {
      setSearchUserProfileModal({
        isOpen: true,
        user: currentUser
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // 페이지 변경 시 모바일 메뉴 닫기
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <UserProfileSystem 
        currentUserId={1} // 현재 로그인한 사용자 ID
        onStartChat={(userId) => console.log('Start chat with user:', userId)}
      >
        <Navbar maxWidth="xl" className="shadow-sm">
          <NavbarBrand>
            <Link to="/" className="flex items-center">
              <Icon icon="lucide:compass" className="text-primary text-2xl mr-2" />
              <span className="font-bold text-xl text-foreground">플탐</span>
            </Link>
          </NavbarBrand>

          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem isActive={isActive('/classes')}>
              <Link to="/classes" className={`text-sm ${isActive('/classes') ? 'text-primary font-medium' : 'text-foreground-600'}`}>
                수업
              </Link>
            </NavbarItem>
            <NavbarItem isActive={isActive('/moim')}>
              <Link to="/moim" className={`text-sm ${isActive('/moim') ? 'text-primary font-medium' : 'text-foreground-600'}`}>
                모임
              </Link>
            </NavbarItem>
            <NavbarItem isActive={isActive('/community')}>
              <Link to="/community" className={`text-sm ${isActive('/community') ? 'text-primary font-medium' : 'text-foreground-600'}`}>
                커뮤니티
              </Link>
            </NavbarItem>
            <NavbarItem isActive={isActive('/schedule')}>
              <Link to="/schedule" className={`text-sm ${isActive('/schedule') ? 'text-primary font-medium' : 'text-foreground-600'}`}>
                일정
              </Link>
            </NavbarItem>
          </NavbarContent>

          <NavbarContent justify="end">
            {/* 모바일 햄버거 메뉴 */}
            <NavbarItem className="sm:hidden">
              <Button 
                isIconOnly 
                variant="light" 
                aria-label="Menu" 
                onPress={handleMobileMenuToggle}
                className="text-foreground-600"
              >
                <Icon icon={isMobileMenuOpen ? "lucide:x" : "lucide:menu"} className="text-xl" />
              </Button>
            </NavbarItem>

            <NavbarItem>
              <Button 
                isIconOnly 
                variant="light" 
                aria-label="Search" 
                onPress={handleSearchClick}
                className="text-foreground-600"
              >
                <Icon icon="lucide:search" className="text-xl" />
              </Button>
            </NavbarItem>

            {isAuthenticated ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="primary"
                    name="김철수"
                    size="sm"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">김철수</p>
                    <p className="font-normal text-foreground-500">user@example.com</p>
                  </DropdownItem>
                  <DropdownItem key="profile_page" onPress={handleMyProfileClick}>
                    프로필 관리
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger" onPress={() => setIsAuthenticated(false)}>
                    로그아웃
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <NavbarItem>
                <Button 
                  color="primary" 
                  variant="flat" 
                  onPress={handleLoginClick}
                  className="font-medium"
                  size="sm"
                >
                  로그인
                </Button>
              </NavbarItem>
            )}
          </NavbarContent>

          {/* 모바일 메뉴 오버레이 */}
          {isMobileMenuOpen && (
            <div className="sm:hidden">
              <div 
                className="fixed inset-0 bg-black/50 z-40"
                onClick={handleMobileMenuClose}
              />
              <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
                <div className="py-4">
                  <Link 
                    to="/classes" 
                    className={`block px-6 py-3 text-sm transition-colors ${
                      isActive('/classes') 
                        ? 'text-primary font-medium bg-primary/5' 
                        : 'text-foreground-600 hover:bg-gray-50'
                    }`}
                    onClick={handleMobileMenuClose}
                  >
                    수업
                  </Link>
                  <Link 
                    to="/moim" 
                    className={`block px-6 py-3 text-sm transition-colors ${
                      isActive('/moim') 
                        ? 'text-primary font-medium bg-primary/5' 
                        : 'text-foreground-600 hover:bg-gray-50'
                    }`}
                    onClick={handleMobileMenuClose}
                  >
                    모임
                  </Link>
                  <Link 
                    to="/community" 
                    className={`block px-6 py-3 text-sm transition-colors ${
                      isActive('/community') 
                        ? 'text-primary font-medium bg-primary/5' 
                        : 'text-foreground-600 hover:bg-gray-50'
                    }`}
                    onClick={handleMobileMenuClose}
                  >
                    커뮤니티
                  </Link>
                  <Link 
                    to="/schedule" 
                    className={`block px-6 py-3 text-sm transition-colors ${
                      isActive('/schedule') 
                        ? 'text-primary font-medium bg-primary/5' 
                        : 'text-foreground-600 hover:bg-gray-50'
                    }`}
                    onClick={handleMobileMenuClose}
                  >
                    일정
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Navbar>
      </UserProfileSystem>

      <SearchModal onUserClick={handleSearchUserClick} />

      {/* 검색에서 클릭한 사용자 프로필 모달 */}
      <UserProfileModal
        user={searchUserProfileModal.user}
        isOpen={searchUserProfileModal.isOpen}
        onClose={handleCloseSearchUserProfile}
        onStartChat={(userId) => console.log('Start chat with user:', userId)}
        onReport={() => console.log('Report user')}
        currentUserId={1}
        onViewNestedProfile={(user) => {
          setSearchUserProfileModal({
            isOpen: true,
            user: user
          });
        }}
      />

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
};

export default Header;
