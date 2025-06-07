import React from 'react';
import { Chip } from '@heroui/react';
import { useAppContext } from '../../context/AppContext';
import { Category, SubCategory } from '../../types/category';

const CategoryFilter: React.FC = () => {
  const { 
    categories, 
    selectedCategory, 
    selectedSubCategory, 
    setSelectedCategory, 
    setSelectedSubCategory 
  } = useAppContext();

  const handleCategorySelect = (category: Category | null) => {
    if (selectedCategory?.id === category?.id) {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    } else {
      setSelectedCategory(category);
      setSelectedSubCategory(null);
    }
  };

  const handleSubCategorySelect = (subCategory: SubCategory | null) => {
    if (selectedSubCategory?.id === subCategory?.id) {
      setSelectedSubCategory(null);
    } else {
      setSelectedSubCategory(subCategory);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto category-scroll pb-2">
        <div className="flex space-x-2 min-w-max">
          <Chip
            variant={selectedCategory === null ? "solid" : "bordered"}
            color={selectedCategory === null ? "primary" : "default"}
            onClick={() => handleCategorySelect(null)}
            className="cursor-pointer"
          >
            전체
          </Chip>
          {categories.map((category) => (
            <Chip
              key={category.id}
              variant={selectedCategory?.id === category.id ? "solid" : "bordered"}
              color={selectedCategory?.id === category.id ? "primary" : "default"}
              onClick={() => handleCategorySelect(category)}
              className="cursor-pointer"
            >
              {category.name}
            </Chip>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div className="overflow-x-auto category-scroll pb-2">
          <div className="flex space-x-2 min-w-max">
            <Chip
              variant={selectedSubCategory === null ? "solid" : "bordered"}
              color={selectedSubCategory === null ? "primary" : "default"}
              onClick={() => handleSubCategorySelect(null)}
              className="cursor-pointer"
            >
              전체
            </Chip>
            {selectedCategory?.subCategories.map((subCategory) => (
              <Chip
                key={subCategory.id}
                variant={selectedSubCategory?.id === subCategory.id ? "solid" : "bordered"}
                color={selectedSubCategory?.id === subCategory.id ? "primary" : "default"}
                onClick={() => handleSubCategorySelect(subCategory)}
                className="cursor-pointer"
              >
                {subCategory.name}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;