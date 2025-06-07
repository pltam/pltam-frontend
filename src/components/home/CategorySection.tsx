import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAppContext } from '../../context/AppContext';
import { Category } from '../../types/category';
import { motion } from 'framer-motion';

const CategorySection: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useAppContext();

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(selectedCategory?.id === category.id ? null : category);
  };

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">카테고리</h2>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                isPressable 
                onPress={() => handleCategoryClick(category)}
                className={`border w-full h-24 ${selectedCategory?.id === category.id ? 'border-primary bg-primary-50' : 'border-divider'}`}
              >
                <CardBody className="flex flex-col items-center justify-center p-2 text-center h-full">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${selectedCategory?.id === category.id ? 'bg-primary/10' : 'bg-content2'}`}>
                    <Icon 
                      icon={category.icon} 
                      className={`text-lg ${selectedCategory?.id === category.id ? 'text-primary' : 'text-foreground-500'}`} 
                    />
                  </div>
                  <p className={`text-xs font-medium leading-tight ${selectedCategory?.id === category.id ? 'text-primary' : 'text-foreground'}`}>
                    {category.name}
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;