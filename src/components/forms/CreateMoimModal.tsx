import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem, Checkbox, Chip, DatePicker, TimeInput } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAppContext } from '../../context/AppContext';
import { parseDate, Time, today, getLocalTimeZone } from '@internationalized/date';

interface CreateMoimModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateMoimModal: React.FC<CreateMoimModalProps> = ({ isOpen, onClose }) => {
  const { categories } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    subCategoryId: '',
    location: '',
    meetingPoint: '',
    fee: '',
    maxMembers: '',
    minAge: '',
    maxAge: '',
    isRegular: false,
    requirements: '',
    schedule: ''
  });

  const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));
  const [selectedTime, setSelectedTime] = useState(new Time(14, 0)); // 오후 2시
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
    if (!formData.title || !formData.description || !formData.categoryId || !formData.location) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    const submitData = {
      ...formData,
      date: selectedDate.toString(),
      time: `${selectedTime.hour.toString().padStart(2, '0')}:${selectedTime.minute.toString().padStart(2, '0')}`,
      images: selectedImages
    };

    // 여기에 실제 API 호출 로직 추가
    console.log('모임 생성 데이터:', submitData);
    
    alert('모임이 성공적으로 등록되었습니다!');
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      categoryId: '',
      subCategoryId: '',
      location: '',
      meetingPoint: '',
      fee: '',
      maxMembers: '',
      minAge: '',
      maxAge: '',
      isRegular: false,
      requirements: '',
      schedule: ''
    });
    setSelectedDate(today(getLocalTimeZone()));
    setSelectedTime(new Time(14, 0));
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
              <h3 className="text-xl font-bold">모임 만들기</h3>
              <p className="text-sm text-foreground-500">새로운 모임을 만들어보세요</p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">기본 정보</h4>
                  
                  <Input
                    label="모임 제목"
                    placeholder="모임 제목을 입력하세요"
                    value={formData.title}
                    onValueChange={(value) => handleInputChange('title', value)}
                    isRequired
                  />

                  <Textarea
                    label="모임 설명"
                    placeholder="모임에 대한 자세한 설명을 입력하세요"
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

                {/* 일정 및 장소 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">일정 및 장소</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DatePicker
                      label="모임 날짜"
                      value={selectedDate as any}
                      onChange={(date) => {
                        if (date) {
                          setSelectedDate(date as any);
                        }
                      }}
                      isRequired
                    />
                    <TimeInput
                      label="모임 시간"
                      value={selectedTime as any}
                      onChange={(time) => {
                        if (time) {
                          setSelectedTime(time as any);
                        }
                      }}
                      isRequired
                    />
                  </div>

                  <Input
                    label="모임 장소"
                    placeholder="모임이 열릴 장소를 입력하세요"
                    value={formData.location}
                    onValueChange={(value) => handleInputChange('location', value)}
                    isRequired
                  />

                  <Input
                    label="집합 장소"
                    placeholder="구체적인 집합 장소를 입력하세요 (예: 지하철역 3번 출구)"
                    value={formData.meetingPoint}
                    onValueChange={(value) => handleInputChange('meetingPoint', value)}
                  />

                  <Checkbox
                    isSelected={formData.isRegular}
                    onValueChange={(value) => handleInputChange('isRegular', value)}
                  >
                    정기 모임
                  </Checkbox>

                  {formData.isRegular && (
                    <Textarea
                      label="정기 모임 일정"
                      placeholder="정기 모임 일정을 입력하세요 (예: 매주 토요일 오후 2시)"
                      value={formData.schedule}
                      onValueChange={(value) => handleInputChange('schedule', value)}
                      minRows={2}
                    />
                  )}
                </div>

                {/* 모임 조건 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">모임 조건</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="참여비"
                      placeholder="참여비 (선택사항)"
                      value={formData.fee}
                      onValueChange={(value) => handleInputChange('fee', value)}
                      startContent={<span className="text-foreground-500">₩</span>}
                      type="number"
                    />
                    <Input
                      label="최대 인원"
                      placeholder="최대 참여 인원"
                      value={formData.maxMembers}
                      onValueChange={(value) => handleInputChange('maxMembers', value)}
                      type="number"
                    />
                    <div className="flex gap-2">
                      <Input
                        label="최소 나이"
                        placeholder="20"
                        value={formData.minAge}
                        onValueChange={(value) => handleInputChange('minAge', value)}
                        type="number"
                      />
                      <Input
                        label="최대 나이"
                        placeholder="60"
                        value={formData.maxAge}
                        onValueChange={(value) => handleInputChange('maxAge', value)}
                        type="number"
                      />
                    </div>
                  </div>

                  <Textarea
                    label="참여 조건"
                    placeholder="모임 참여에 필요한 조건이나 준비물을 입력하세요"
                    value={formData.requirements}
                    onValueChange={(value) => handleInputChange('requirements', value)}
                    minRows={3}
                  />
                </div>

                {/* 이미지 업로드 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">모임 이미지</h4>
                  
                  <div className="border-2 border-dashed border-divider rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="moim-image-upload"
                    />
                    <label htmlFor="moim-image-upload" className="cursor-pointer">
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
                모임 만들기
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateMoimModal;