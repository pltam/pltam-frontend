import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Chip, Avatar, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import CategoryFilter from '../../components/common/CategoryFilter';
import BoardTypeFilter from '../../components/common/BoardTypeFilter';
import SearchSortBar from '../../components/common/SearchSortBar';
import CreatePostModal from '../../components/forms/CreatePostModal';
import { mockPosts } from '../../data/mockData';
import { useAppContext } from '../../context/AppContext';
import { useProfileClick } from '../../components/profile/ProfileClickProvider';

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCategory, selectedSubCategory, selectedBoardType, categories, boardTypes, setSelectedCategory, setSelectedSubCategory, setSelectedBoardType } = useAppContext();
  const { onProfileClick } = useProfileClick();
  const [isWritePostModalOpen, setIsWritePostModalOpen] = React.useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = React.useState<string>("");
  
  const filteredPosts = React.useMemo(() => {
    let filtered = mockPosts;
    
    if (selectedCategory) {
      filtered = filtered.filter(item => item.categoryId === selectedCategory.id);
    }
    
    if (selectedSubCategory) {
      filtered = filtered.filter(item => item.subCategoryId === selectedSubCategory.id);
    }
    
    if (selectedBoardType && selectedBoardType.id !== 1) {
      filtered = filtered.filter(item => item.boardTypeId === selectedBoardType.id);
    }
    
    // Search by keyword
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword) ||
        item.author.name.toLowerCase().includes(keyword)
      );
    }
    
    return filtered;
  }, [selectedCategory, selectedSubCategory, selectedBoardType, searchKeyword]);
  
  const handleCardClick = (postId: number) => {
    navigate(`/community-post-detail/${postId}`);
  };

  const handleAuthorClick = (e: React.MouseEvent, authorId: number) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    onProfileClick(authorId, e);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else {
      return `${diffDays}일 전`;
    }
  };

  const getBoardTypeName = (boardTypeId: number) => {
    switch (boardTypeId) {
      case 2: return "자유";
      case 3: return "질문";
      case 4: return "모임홍보";
      case 5: return "노하우";
      case 6: return "작품공유";
      default: return "전체";
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

  const removeFilter = (filterType: string) => {
    if (filterType === 'category') {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    } else if (filterType === 'subcategory') {
      setSelectedSubCategory(null);
    } else if (filterType === 'boardType') {
      setSelectedBoardType(boardTypes[0]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">커뮤니티</h1>
        <CategoryFilter />
      </div>

      <div className="mb-4">
        <BoardTypeFilter />
      </div>
      
      {/* Selected Filters */}
      {(selectedCategory || selectedSubCategory || (selectedBoardType && selectedBoardType.id !== 1) || searchKeyword) && (
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
          {selectedBoardType && selectedBoardType.id !== 1 && (
            <div className="filter-tag">
              {selectedBoardType.name}
              <button onClick={() => removeFilter('boardType')}>×</button>
            </div>
          )}
        </div>
      )}
    
      <div className="mb-6">
        <SearchSortBar 
          type="community" 
          createButtonText="글쓰기"
          onCreateClick={() => setIsWritePostModalOpen(true)}
          searchValue={searchKeyword}
          onSearchChange={setSearchKeyword}
        />
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => {
          return (
            <motion.div
              key={post.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className="border border-divider cursor-pointer w-full min-h-[120px]"
                isPressable
                onPress={() => handleCardClick(post.id)}
              >
                <CardBody className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div 
                      className="flex items-center cursor-pointer hover:bg-gray-50 rounded-lg p-1 -mx-1 transition-colors"
                      onClick={(e) => handleAuthorClick(e, post.author.id)}
                    >
                      <Avatar 
                        src={post.author.avatar} 
                        alt={post.author.name} 
                        size="sm"
                        className="mr-2"
                      />
                      <div>
                        <p className="font-medium text-sm">{post.author.name}</p>
                        <p className="text-foreground-400 text-xs">{formatDate(post.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end">
                      <Chip size="sm" variant="flat" color="default">
                        {getBoardTypeName(post.boardTypeId)}
                      </Chip>
                      <Chip size="sm" variant="flat" color="secondary">
                        {getCategoryName(post.categoryId)}
                      </Chip>
                      {selectedCategory && (
                        <Chip size="sm" variant="flat" color="secondary">
                          {getSubCategoryName(post.subCategoryId)}
                        </Chip>
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{post.title}</h3>
                  <p className="text-foreground-600 text-sm mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-foreground-500 text-sm">
                      <div className="flex items-center mr-4">
                        <Icon icon="lucide:heart" className="mr-1 text-danger" />
                        <span>{post.likeCount}</span>
                      </div>
                      <div className="flex items-center">
                        <Icon icon="lucide:message-circle" className="mr-1" />
                        <span>{post.commentCount}</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      <CreatePostModal
        isOpen={isWritePostModalOpen}
        onClose={() => setIsWritePostModalOpen(false)}
      />
    </div>
  );
};

export default CommunityPage;