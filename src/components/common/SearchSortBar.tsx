import React from 'react';
import { Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAppContext } from '../../context/AppContext';

interface SearchSortBarProps {
  onFilterClick?: () => void;
  type: 'class' | 'moim' | 'community';
  createButtonText?: string;
  onCreateClick?: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const SearchSortBar: React.FC<SearchSortBarProps> = ({ 
  onFilterClick, 
  type, 
  createButtonText = "만들기",
  onCreateClick,
  searchValue,
  onSearchChange
}) => {
  const [sortOption, setSortOption] = React.useState<string>("latest");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Additional search handling if needed
  };

  const handleSortChange = (key: React.Key) => {
    setSortOption(key as string);
  };

  const getSortLabel = () => {
    switch (sortOption) {
      case "latest": return "최신순";
      case "popular": return "인기순";
      case "rating": return "평점순";
      case "lowPrice": return "낮은 가격순";
      case "highPrice": return "높은 가격순";
      default: return "최신순";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 flex gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex">
          <Input
            placeholder={`${type === 'class' ? '수업' : type === 'moim' ? '모임' : '게시글'} 검색`}
            value={searchValue}
            onValueChange={onSearchChange}
            startContent={<Icon icon="lucide:search" className="text-foreground-400" />}
            className="w-full"
            size="sm"
            radius="lg"
          />
        </form>
        {(type === 'class' || type === 'moim') && (
          <Button 
            isIconOnly 
            variant="bordered" 
            onPress={onFilterClick}
            size="sm"
            aria-label="Filter"
          >
            <Icon icon="lucide:filter" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Dropdown>
          <DropdownTrigger>
            <Button 
              variant="bordered" 
              endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
              size="sm"
            >
              {getSortLabel()}
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Sort options" 
            onAction={handleSortChange}
            selectedKeys={[sortOption]}
            selectionMode="single"
          >
            <DropdownItem key="latest">최신순</DropdownItem>
            <DropdownItem key="popular">인기순</DropdownItem>
            {type === 'class' && (
              <>
                <DropdownItem key="rating">평점순</DropdownItem>
                <DropdownItem key="lowPrice">낮은 가격순</DropdownItem>
                <DropdownItem key="highPrice">높은 가격순</DropdownItem>
              </>
            )}
          </DropdownMenu>
        </Dropdown>

        {onCreateClick && (
          <Button 
            color="primary" 
            onPress={onCreateClick}
            size="sm"
          >
            {createButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchSortBar;