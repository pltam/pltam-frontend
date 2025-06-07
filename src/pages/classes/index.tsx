import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardFooter, Button, Chip, Avatar } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import CategoryFilter from '../../components/common/CategoryFilter';
import SearchSortBar from '../../components/common/SearchSortBar';
import FilterModal from '../../components/filter/FilterModal';
import CreateClassModal from '../../components/forms/CreateClassModal';
import { mockClasses } from '../../data/mockData';
import { useAppContext } from '../../context/AppContext';
import { useProfileClick } from '../../components/profile/ProfileClickProvider';

const ClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCategory, selectedSubCategory, setSelectedCategory, setSelectedSubCategory, setIsFilterModalOpen, isFilterModalOpen, categories } = useAppContext();
  const { onProfileClick } = useProfileClick();
  const [appliedFilters, setAppliedFilters] = React.useState<any>({});
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = React.useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = React.useState<string>("");
  
  const filteredClasses = React.useMemo(() => {
    let filtered = mockClasses;
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(item => item.categoryId === selectedCategory.id);
    }
    
    // Filter by subcategory
    if (selectedSubCategory) {
      filtered = filtered.filter(item => item.subCategoryId === selectedSubCategory.id);
    }
    
    // Apply modal filters
    if (appliedFilters.regions?.length) {
      filtered = filtered.filter(item => 
        appliedFilters.regions.some((region: string) => 
          region === '온라인' ? item.isOnline : item.location.includes(region)
        )
      );
    }
    
    if (appliedFilters.priceRange) {
      const [min, max] = appliedFilters.priceRange;
      filtered = filtered.filter(item => item.price >= min && item.price <= max);
    }
    
    if (appliedFilters.rating) {
      filtered = filtered.filter(item => item.rating >= parseInt(appliedFilters.rating));
    }
    
    if (appliedFilters.classTypes?.length) {
      filtered = filtered.filter(item => {
        return appliedFilters.classTypes.some((type: string) => {
          switch(type) {
            case 'online': return item.isOnline;
            case 'offline': return !item.isOnline;
            case 'group': return item.isGroup;
            case 'oneToOne': return !item.isGroup;
            case 'oneDay': return item.isOneDay;
            case 'regular': return !item.isOneDay;
            default: return false;
          }
        });
      });
    }
    
    // Search by keyword
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(keyword) ||
        item.instructor.name.toLowerCase().includes(keyword)
      );
    }
    
    return filtered;
  }, [selectedCategory, selectedSubCategory, appliedFilters, searchKeyword]);
  
  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
  };
  
  const handleCardClick = (classId: number) => {
    navigate(`/class-detail/${classId}`);
  };

  const handleInstructorClick = (e: React.MouseEvent, instructorId: number) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    onProfileClick(instructorId, e);
  };
  
  const removeFilter = (filterType: string) => {
    if (filterType === 'category') {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    } else if (filterType === 'subcategory') {
      setSelectedSubCategory(null);
    } else {
      // appliedFilters에서 해당 필터 제거
      const newAppliedFilters = {
        ...appliedFilters,
        [filterType]: undefined
      };
      setAppliedFilters(newAppliedFilters);
    }
  };
  
  const getFilterLabel = (key: string, value: any) => {
    switch(key) {
      case 'regions':
        return value && value.length > 0 ? `지역: ${value.join(', ')}` : null;
      case 'priceRange':
        return value && Array.isArray(value) && (value[0] !== 0 || value[1] !== 100000) ? `가격: ₩${value[0].toLocaleString()} ~ ₩${value[1].toLocaleString()}` : null;
      case 'rating':
        return value && value !== '' ? `평점: ${value}점 이상` : null;
      case 'classTypes':
        const classTypeMap: { [key: string]: string } = {
          'online': '온라인',
          'offline': '오프라인', 
          'group': '그룹',
          'oneToOne': '1:1',
          'oneDay': '원데이',
          'regular': '정기',
          'beginner': '초보자'
        };
        return value && value.length > 0 ? `수업 형태: ${value.map((v: string) => classTypeMap[v] || v).join(', ')}` : null;
      default:
        return null;
    }
  };
  
  const getSubCategoryName = (subCategoryId: number) => {
    if (!selectedCategory) return "";
    const subCategory = selectedCategory.subCategories.find(sub => sub.id === subCategoryId);
    return subCategory ? subCategory.name : "";
  };
  
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "";
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">수업</h1>
        <CategoryFilter />
      </div>
      
      {/* Selected Filters */}
      {(selectedCategory || selectedSubCategory || Object.values(appliedFilters).some(v => v) || searchKeyword) && (
        <div className="selected-filters-container mb-4">
          {searchKeyword && (
            <div className="filter-tag">
              검색: "{searchKeyword}"
              <button onClick={() => setSearchKeyword("")}>×</button>
            </div>
          )}
          {selectedCategory && (
            <div className="filter-tag">
              카테고리: {selectedCategory.name}
              <button onClick={() => removeFilter('category')}>×</button>
            </div>
          )}
          {selectedSubCategory && (
            <div className="filter-tag">
              {selectedSubCategory.name}
              <button onClick={() => removeFilter('subcategory')}>×</button>
            </div>
          )}
          {Object.entries(appliedFilters).map(([key, value]) => {
            if (!value) return null;
            const label = getFilterLabel(key, value);
            if (!label) return null;
            return (
              <div key={key} className="filter-tag">
                {label}
                <button onClick={() => removeFilter(key)}>×</button>
              </div>
            );
          })}
        </div>
      )}
    
      <div className="mb-6">
        <SearchSortBar 
          type="class" 
          onFilterClick={() => setIsFilterModalOpen(true)}
          createButtonText="수업 만들기"
          onCreateClick={() => setIsCreateClassModalOpen(true)}
          searchValue={searchKeyword}
          onSearchChange={setSearchKeyword}
        />
      </div>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClasses.map((classItem) => {
          return (
            <motion.div
              key={classItem.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className="border border-divider h-full cursor-pointer w-full"
                isPressable
                onPress={() => handleCardClick(classItem.id)}
              >
                <CardBody className="p-0 overflow-hidden">
                  <div className="relative w-full h-48">
                    <img 
                      src={classItem.image || "https://lh3.googleusercontent.com/gg-dl/AJfQ9KS8R_vEePPHU-_TEQ8TjwGEkMWYWQxqGaynFPX5AwBYchP1B0W1aZ8WKojvxkL_VCw0rPRPVesJy1CTb-ozlFlMCVV8x6eMaXq99HC3PS41GVG9XBd9azLKlc546Xk_RGRdqlGsat6IZNWeAgoH9wsvSutH4iQD0jgwD3xWMGNCyYjaBA=s1024"} 
                      alt={classItem.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[80%]">
                      <Chip 
                        size="sm" 
                        className={classItem.isOnline ? "bg-success/90 backdrop-blur-sm text-white font-medium shadow-sm" : "bg-primary/90 backdrop-blur-sm text-white font-medium shadow-sm"}
                        variant="solid"
                      >
                        {classItem.isOnline ? "온라인" : "오프라인"}
                      </Chip>
                      <Chip 
                        size="sm" 
                        className="bg-white/90 backdrop-blur-sm text-foreground-600 font-medium shadow-sm"
                        variant="solid"
                      >
                        {classItem.isGroup ? "그룹" : "1:1"}
                      </Chip>
                      <Chip 
                        size="sm" 
                        className="bg-secondary/90 backdrop-blur-sm text-white font-medium shadow-sm"
                        variant="solid"
                      >
                        {getCategoryName(classItem.categoryId)}
                      </Chip>
                      {selectedCategory && (
                        <Chip 
                          size="sm" 
                          className="bg-warning/90 backdrop-blur-sm text-white font-medium shadow-sm"
                          variant="solid"
                        >
                          {getSubCategoryName(classItem.subCategoryId)}
                        </Chip>
                      )}
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center text-secondary">
                        <Icon icon="lucide:star" className="mr-1" />
                        <span className="font-medium text-sm">{classItem.rating}</span>
                      </div>
                      <span className="text-foreground-400 text-xs mx-1">|</span>
                      <span className="text-foreground-500 text-xs">리뷰 {classItem.reviewCount}개</span>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2 min-h-[3rem]">{classItem.title}</h3>
                    <div 
                      className="flex items-center mb-2 cursor-pointer hover:bg-gray-50 rounded-lg p-1 -mx-1 transition-colors"
                      onClick={(e) => handleInstructorClick(e, classItem.instructor.id)}
                    >
                      <Avatar src={classItem.instructor.avatar} size="sm" className="mr-2" />
                      <span className="text-foreground-600 text-sm">{classItem.instructor.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Icon icon="lucide:map-pin" className="text-foreground-400 mr-1 text-sm" />
                      <span className="text-foreground-500 text-xs">{classItem.location}</span>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="flex justify-between items-center border-t border-divider">
                  <p className="font-semibold">₩{classItem.price.toLocaleString()}</p>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      <FilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
        type="class"
        onApplyFilters={handleApplyFilters}
        appliedFilters={appliedFilters}
      />
      
      <CreateClassModal
        isOpen={isCreateClassModalOpen}
        onClose={() => setIsCreateClassModalOpen(false)}
      />
    </div>
  );
};

export default ClassesPage;