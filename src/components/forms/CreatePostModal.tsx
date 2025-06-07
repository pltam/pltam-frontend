import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAppContext } from '../../context/AppContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { categories, boardTypes } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    subCategoryId: '',
    boardTypeId: '2' // 기본값: 자유게시판
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const selectedCategory = categories.find(cat => cat.id === parseInt(formData.categoryId));

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...files].slice(0, 10)); // 최대 10개
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // 폼 유효성 검사
    if (!formData.title || !formData.content || !formData.categoryId || !formData.boardTypeId) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    const submitData = {
      ...formData,
      images: selectedImages,
      createdAt: new Date().toISOString()
    };

    // 여기에 실제 API 호출 로직 추가
    console.log('게시글 생성 데이터:', submitData);
    
    alert('게시글이 성공적으로 등록되었습니다!');
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      categoryId: '',
      subCategoryId: '',
      boardTypeId: '2'
    });
    setSelectedImages([]);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "py-6",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">글쓰기</h3>
              <p className="text-sm text-foreground-500">새로운 게시글을 작성해보세요</p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* 게시판 및 카테고리 선택 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">게시판 선택</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="게시판 유형"
                      placeholder="게시판을 선택하세요"
                      selectedKeys={formData.boardTypeId ? [formData.boardTypeId] : []}
                      onSelectionChange={(keys) => {
                        const boardTypeId = Array.from(keys)[0] as string;
                        handleInputChange('boardTypeId', boardTypeId);
                      }}
                      isRequired
                    >
                      {boardTypes.filter(type => type.id !== 1).map((boardType) => (
                        <SelectItem key={boardType.id}>
                          {boardType.name}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="카테고리"
                      placeholder="카테고리 선택"
                      selectedKeys={formData.categoryId ? [formData.categoryId] : []}
                      onSelectionChange={(keys) => {
                        const categoryId = Array.from(keys)[0] as string;
                        handleInputChange('categoryId', categoryId);
                        handleInputChange('subCategoryId', ''); // 서브카테고리 초기화
                      }}
                      isRequired
                    >
                      {categories.map((category) => (
                        <SelectItem key={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  {selectedCategory && (
                    <Select
                      label="세부 카테고리"
                      placeholder="세부 카테고리 선택 (선택사항)"
                      selectedKeys={formData.subCategoryId ? [formData.subCategoryId] : []}
                      onSelectionChange={(keys) => {
                        const subCategoryId = Array.from(keys)[0] as string;
                        handleInputChange('subCategoryId', subCategoryId);
                      }}
                    >
                      {selectedCategory.subCategories.map((subCategory) => (
                        <SelectItem key={subCategory.id}>
                          {subCategory.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                </div>

                {/* 게시글 내용 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">게시글 작성</h4>
                  
                  <Input
                    label="제목"
                    placeholder="게시글 제목을 입력하세요"
                    value={formData.title}
                    onValueChange={(value) => handleInputChange('title', value)}
                    isRequired
                  />

                  <Textarea
                    label="내용"
                    placeholder="게시글 내용을 입력하세요"
                    value={formData.content}
                    onValueChange={(value) => handleInputChange('content', value)}
                    minRows={8}
                    isRequired
                  />
                </div>

                {/* 이미지 업로드 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">이미지 첨부</h4>
                  
                  <div className="border-2 border-dashed border-divider rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="post-image-upload"
                    />
                    <label htmlFor="post-image-upload" className="cursor-pointer">
                      <Icon icon="lucide:image-plus" className="text-4xl text-foreground-400 mb-2 mx-auto" />
                      <p className="text-foreground-500 mb-1">클릭하여 이미지 업로드</p>
                      <p className="text-xs text-foreground-400">최대 10개까지 업로드 가능</p>
                    </label>
                  </div>

                  {selectedImages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedImages.map((file, index) => (
                        <Chip
                          key={index}
                          onClose={() => removeImage(index)}
                          variant="flat"
                          color="primary"
                        >
                          {file.name}
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                취소
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                게시글 등록
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreatePostModal;