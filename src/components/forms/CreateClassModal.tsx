import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem, Checkbox, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAppContext } from '../../context/AppContext';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({ isOpen, onClose }) => {
  const { categories } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    subCategoryId: '',
    price: '',
    duration: '',
    location: '',
    isOnline: false,
    isGroup: true,
    isOneDay: false,
    maxStudents: '',
    requirements: '',
    materials: '',
    schedule: ''
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const selectedCategory = categories.find(cat => cat.id.toString() === formData.categoryId);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...files].slice(0, 5)); // 최대 5개
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // 폼 유효성 검사
    if (!formData.title || !formData.description || !formData.categoryId || !formData.price) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 여기에 실제 API 호출 로직 추가
    console.log('수업 생성 데이터:', formData);
    console.log('업로드할 이미지:', selectedImages);
    
    alert('수업이 성공적으로 등록되었습니다!');
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      categoryId: '',
      subCategoryId: '',
      price: '',
      duration: '',
      location: '',
      isOnline: false,
      isGroup: true,
      isOneDay: false,
      maxStudents: '',
      requirements: '',
      materials: '',
      schedule: ''
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
              <h3 className="text-xl font-bold">수업 만들기</h3>
              <p className="text-sm text-foreground-500">새로운 수업을 등록해보세요</p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">기본 정보</h4>
                  
                  <Input
                    label="수업 제목"
                    placeholder="수업 제목을 입력하세요"
                    value={formData.title}
                    onValueChange={(value) => handleInputChange('title', value)}
                    isRequired
                  />

                  <Textarea
                    label="수업 설명"
                    placeholder="수업에 대한 자세한 설명을 입력하세요"
                    value={formData.description}
                    onValueChange={(value) => handleInputChange('description', value)}
                    minRows={4}
                    isRequired
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <SelectItem key={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </Select>

                    {selectedCategory && (
                      <Select
                        label="세부 카테고리"
                        placeholder="세부 카테고리 선택"
                        selectedKeys={formData.subCategoryId ? [formData.subCategoryId] : []}
                        onSelectionChange={(keys) => {
                          const subCategoryId = Array.from(keys)[0] as string;
                          handleInputChange('subCategoryId', subCategoryId);
                        }}
                      >
                        {selectedCategory.subCategories.map((subCategory) => (
                          <SelectItem key={subCategory.id.toString()}>
                            {subCategory.name}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  </div>
                </div>

                {/* 수업 옵션 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">수업 옵션</h4>
                  
                  <div className="flex flex-wrap gap-4">
                    <Checkbox
                      isSelected={formData.isOnline}
                      onValueChange={(value) => handleInputChange('isOnline', value)}
                    >
                      온라인 수업
                    </Checkbox>
                    <Checkbox
                      isSelected={formData.isGroup}
                      onValueChange={(value) => handleInputChange('isGroup', value)}
                    >
                      그룹 수업
                    </Checkbox>
                    <Checkbox
                      isSelected={formData.isOneDay}
                      onValueChange={(value) => handleInputChange('isOneDay', value)}
                    >
                      원데이 클래스
                    </Checkbox>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="수업료"
                      placeholder="가격을 입력하세요"
                      value={formData.price}
                      onValueChange={(value) => handleInputChange('price', value)}
                      startContent={<span className="text-foreground-500">₩</span>}
                      type="number"
                      isRequired
                    />
                    <Input
                      label="수업 시간"
                      placeholder="예: 2시간"
                      value={formData.duration}
                      onValueChange={(value) => handleInputChange('duration', value)}
                    />
                    <Input
                      label="최대 수강생"
                      placeholder="인원수"
                      value={formData.maxStudents}
                      onValueChange={(value) => handleInputChange('maxStudents', value)}
                      type="number"
                    />
                  </div>

                  <Input
                    label="수업 장소"
                    placeholder={formData.isOnline ? "온라인 플랫폼 정보" : "오프라인 장소"}
                    value={formData.location}
                    onValueChange={(value) => handleInputChange('location', value)}
                  />
                </div>

                {/* 추가 정보 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">추가 정보</h4>
                  
                  <Textarea
                    label="수업 일정"
                    placeholder="수업 일정을 입력하세요 (예: 매주 토요일 오후 2시-4시)"
                    value={formData.schedule}
                    onValueChange={(value) => handleInputChange('schedule', value)}
                    minRows={2}
                  />

                  <Textarea
                    label="준비물/재료"
                    placeholder="수강생이 준비해야 할 재료나 도구를 입력하세요"
                    value={formData.materials}
                    onValueChange={(value) => handleInputChange('materials', value)}
                    minRows={2}
                  />

                  <Textarea
                    label="수강 요건"
                    placeholder="수강에 필요한 사전 지식이나 요건을 입력하세요"
                    value={formData.requirements}
                    onValueChange={(value) => handleInputChange('requirements', value)}
                    minRows={2}
                  />
                </div>

                {/* 이미지 업로드 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">수업 이미지</h4>
                  
                  <div className="border-2 border-dashed border-divider rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Icon icon="lucide:upload" className="text-4xl text-foreground-400 mb-2 mx-auto" />
                      <p className="text-foreground-500 mb-1">클릭하여 이미지 업로드</p>
                      <p className="text-xs text-foreground-400">최대 5개까지 업로드 가능</p>
                    </label>
                  </div>

                  {selectedImages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedImages.map((file, index) => (
                        <Chip
                          key={index}
                          onClose={() => removeImage(index)}
                          variant="flat"
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
                수업 등록하기
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateClassModal;