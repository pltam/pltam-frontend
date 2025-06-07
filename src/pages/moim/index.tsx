import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardFooter, Button, Chip, Avatar } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import CategoryFilter from '../../components/common/CategoryFilter';
import SearchSortBar from '../../components/common/SearchSortBar';
import FilterModal from '../../components/filter/FilterModal';
import CreateMoimModal from '../../components/forms/CreateMoimModal';
import { mockMoims } from '../../data/mockData';
import { useAppContext } from '../../context/AppContext';
import { useProfileClick } from '../../components/profile/ProfileClickProvider';

const MoimPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCategory, selectedSubCategory, setSelectedCategory, setSelectedSubCategory, setIsFilterModalOpen, isFilterModalOpen, categories } = useAppContext();
  const { onProfileClick } = useProfileClick();
  const [appliedFilters, setAppliedFilters] = React.useState<any>({});
  const [isCreateMoimModalOpen, setIsCreateMoimModalOpen] = React.useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = React.useState<string>("");
  
  const filteredMoims = React.useMemo(() => {
    let filtered = mockMoims;
    
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
          region === '온라인' ? item.location.toLowerCase().includes('온라인') : item.location.includes(region)
        )
      );
    }
    
    // Apply moim type filters (including online/offline)
    if (appliedFilters.moimTypes?.length) {
      filtered = filtered.filter(item => {
        return appliedFilters.moimTypes.some((type: string) => {
          switch(type) {
            case 'online': return item.location.toLowerCase().includes('온라인');
            case 'offline': return !item.location.toLowerCase().includes('온라인');
            case 'regular': return item.isRegular;
            case 'oneDay': return !item.isRegular;
            case 'small': return item.maxMembers <= 20;
            case 'large': return item.maxMembers > 20;
            case 'all': return true;
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
        item.leader.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword)
      );
    }
    
    return filtered;
  }, [selectedCategory, selectedSubCategory, appliedFilters, searchKeyword]);
  
  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
  };
  
  const handleCardClick = (moimId: number) => {
    navigate(`/moim-detail/${moimId}`);
  };

  const handleLeaderClick = (e: React.MouseEvent, leaderId: number) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    onProfileClick(leaderId, e);
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
      case 'ageRange':
        return value && Array.isArray(value) && (value[0] !== 20 || value[1] !== 80) ? `나이: ${value[0]}세 ~ ${value[1]}세` : null;
      case 'memberCount':
        return value && value !== 'all' && value !== '' ? `정원: ${value === '100+' ? '100명 이상' : `${value}명 이하`}` : null;
      case 'moimTypes':
        const moimTypeMap: { [key: string]: string } = {
          'all': '전체',
          'regular': '정기모임',
          'oneDay': '원데이',
          'small': '소규모',
          'large': '대규모',
          'online': '온라인',
          'offline': '오프라인'
        };
        return value && value.length > 0 && !value.includes('all') ? `모임 형태: ${value.map((v: string) => moimTypeMap[v] || v).join(', ')}` : null;
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
        <h1 className="text-2xl font-bold mb-6">모임</h1>
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
          type="moim" 
          onFilterClick={() => setIsFilterModalOpen(true)}
          createButtonText="모임 만들기"
          onCreateClick={() => setIsCreateMoimModalOpen(true)}
          searchValue={searchKeyword}
          onSearchChange={setSearchKeyword}
        />
      </div>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMoims.map((moim) => {
          return (
            <motion.div
              key={moim.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className="border border-divider h-full cursor-pointer w-full"
                isPressable
                onPress={() => handleCardClick(moim.id)}
              >
                <CardBody className="p-0 overflow-hidden">
                  <div className="relative w-full h-48">
                    <img 
                      src={moim.image || "https://lh3.googleusercontent.com/gg-dl/AJfQ9KT-A4RSbVPHZBpdJBmrss_9_QuaY2xVAA7EcGZ4JzqqV2r-6VlcSgAHCzhRP8KhMfB6-7tB6yW0kYbsLLOwYjWntr1HPAIt_FNZeAQUyWntZeCPyraUic6QC2729hSyA6xSSRDlTWurgXNKUUM9yIzt2oEHDYYQf823hmuCqmli-dvnBQ=s1024"} 
                      alt={moim.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[80%]">
                      <Chip 
                        size="sm" 
                        className={moim.location.toLowerCase().includes('온라인') ? "bg-success/90 backdrop-blur-sm text-white font-medium shadow-sm" : "bg-primary/90 backdrop-blur-sm text-white font-medium shadow-sm"}
                        variant="solid"
                      >
                        {moim.location.toLowerCase().includes('온라인') ? "온라인" : "오프라인"}
                      </Chip>
                      <Chip 
                        size="sm" 
                        className={moim.isRegular ? "bg-secondary/90 backdrop-blur-sm text-white font-medium shadow-sm" : "bg-warning/90 backdrop-blur-sm text-white font-medium shadow-sm"}
                        variant="solid"
                      >
                        {moim.isRegular ? "정기모임" : "원데이"}
                      </Chip>
                      <Chip 
                        size="sm" 
                        className="bg-white/90 backdrop-blur-sm text-foreground-600 font-medium shadow-sm"
                        variant="solid"
                      >
                        {getCategoryName(moim.categoryId)}
                      </Chip>
                      {selectedCategory && (
                        <Chip 
                          size="sm" 
                          className="bg-danger/90 backdrop-blur-sm text-white font-medium shadow-sm"
                          variant="solid"
                        >
                          {getSubCategoryName(moim.subCategoryId)}
                        </Chip>
                      )}
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold mb-3 line-clamp-2 min-h-[3rem]">{moim.title}</h3>
                    <div 
                      className="flex items-center mb-3 cursor-pointer hover:bg-gray-50 rounded-lg p-1 -mx-1 transition-colors"
                      onClick={(e) => handleLeaderClick(e, moim.leader.id)}
                    >
                      <Avatar src={moim.leader.avatar} size="sm" className="mr-2" />
                      <span className="text-foreground-600 text-sm">{moim.leader.name}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Icon icon="lucide:map-pin" className="text-foreground-400 mr-1 text-sm" />
                      <span className="text-foreground-500 text-xs">{moim.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Icon icon="lucide:users" className="text-foreground-400 mr-1 text-sm" />
                      <span className="text-foreground-500 text-xs">
                        {moim.memberCount}/{moim.maxMembers}명 참여중
                      </span>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="flex justify-between items-center border-t border-divider">
                  <p className="text-sm text-foreground-500 line-clamp-1">{moim.description}</p>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    
      <FilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
        type="moim"
        onApplyFilters={handleApplyFilters}
        appliedFilters={appliedFilters}
      />
      
      <CreateMoimModal
        isOpen={isCreateMoimModalOpen}
        onClose={() => setIsCreateMoimModalOpen(false)}
      />
    </div>
  );
};

export default MoimPage;