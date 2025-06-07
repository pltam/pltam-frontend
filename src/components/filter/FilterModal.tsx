import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip, Slider, RadioGroup, Radio, Checkbox } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAppContext } from '../../context/AppContext'; // Fixed import path

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'class' | 'moim';
  onApplyFilters: (filters: any) => void;
  appliedFilters?: any; // 현재 적용된 필터 추가
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, type, onApplyFilters, appliedFilters = {} }) => {
  const { regions } = useAppContext();
  const [selectedRegions, setSelectedRegions] = React.useState<string[]>([]);
  const [priceRange, setPriceRange] = React.useState<number[]>([0, 100000]);
  const [rating, setRating] = React.useState<string>("");
  const [classTypes, setClassTypes] = React.useState<string[]>([]);
  const [ageRange, setAgeRange] = React.useState<number[]>([20, 80]);
  const [memberCount, setMemberCount] = React.useState<string>("");
  const [moimTypes, setMoimTypes] = React.useState<string[]>([]);

  // 모달이 열릴 때마다 현재 적용된 필터로 상태 동기화
  React.useEffect(() => {
    if (isOpen && appliedFilters) {
      setSelectedRegions(appliedFilters.regions || []);
      setPriceRange(appliedFilters.priceRange || [0, 100000]);
      setRating(appliedFilters.rating || "");
      setClassTypes(appliedFilters.classTypes || []);
      setAgeRange(appliedFilters.ageRange || [20, 80]);
      setMemberCount(appliedFilters.memberCount || "");
      setMoimTypes(appliedFilters.moimTypes || []);
    }
  }, [isOpen, appliedFilters]);

  const handleRegionToggle = (region: string) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };

  const handleClassTypeToggle = (type: string) => {
    if (classTypes.includes(type)) {
      setClassTypes(classTypes.filter(t => t !== type));
    } else {
      setClassTypes([...classTypes, type]);
    }
  };

  const handleMoimTypeToggle = (type: string) => {
    if (moimTypes.includes(type)) {
      setMoimTypes(moimTypes.filter(t => t !== type));
    } else {
      setMoimTypes([...moimTypes, type]);
    }
  };

  const resetFilters = () => {
    setSelectedRegions([]);
    setPriceRange([0, 100000]);
    setRating("");
    setClassTypes([]);
    setAgeRange([20, 80]);
    setMemberCount("");
    setMoimTypes([]);
  };

  const applyFilters = () => {
    const filters = {
      regions: selectedRegions,
      priceRange: type === 'class' ? priceRange : undefined,
      rating: type === 'class' ? rating : undefined,
      classTypes: type === 'class' ? classTypes : undefined,
      ageRange: type === 'moim' ? ageRange : undefined,
      memberCount: type === 'moim' ? memberCount : undefined,
      moimTypes: type === 'moim' ? moimTypes : undefined,
    };
    
    onApplyFilters(filters);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      placement="bottom"
      size="full"
      className="filter-modal !rounded-3xl"
      scrollBehavior="inside"
      hideCloseButton={true}
      classNames={{
        base: "filter-modal !rounded-3xl",
        backdrop: "bg-black/50",
        wrapper: "items-center justify-center !rounded-3xl",
        body: "modal-body",
        header: "border-b border-gray-200 !rounded-t-3xl",
        footer: "border-t border-gray-200 !rounded-b-3xl"
      }}
    >
      <ModalContent 
        className="!rounded-3xl overflow-hidden"
        style={{
          overflow: 'hidden !important'
        }}
      >
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">필터</h3>
              <Button isIconOnly variant="light" onPress={onClose}>
                <Icon icon="lucide:x" />
              </Button>
            </ModalHeader>
            <ModalBody className="modal-body">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">지역 선택</h4>
                  <div className="flex flex-wrap gap-2">
                    {regions.map((region) => (
                      <Chip
                        key={region}
                        variant={selectedRegions.includes(region) ? "solid" : "bordered"}
                        color={selectedRegions.includes(region) ? "primary" : "default"}
                        onClick={() => handleRegionToggle(region)}
                        className="cursor-pointer"
                      >
                        {region}
                      </Chip>
                    ))}
                  </div>
                </div>

                {type === 'class' ? (
                  <>
                    <div>
                      <h4 className="font-medium mb-3">가격 범위</h4>
                      <div className="px-2">
                        <Slider
                          label="가격"
                          step={5000}
                          minValue={0}
                          maxValue={100000}
                          value={priceRange}
                          onChange={setPriceRange as any}
                          formatOptions={{ style: 'currency', currency: 'KRW' }}
                          showTooltip
                          className="max-w-md"
                        />
                        <div className="flex justify-between mt-2 text-sm text-foreground-500">
                          <span>₩0</span>
                          <span>₩100,000+</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">평점</h4>
                      <RadioGroup value={rating} onValueChange={setRating}>
                        <div className="flex flex-wrap gap-4">
                          <Radio value="5">5점 이상</Radio>
                          <Radio value="4">4점 이상</Radio>
                          <Radio value="3">3점 이상</Radio>
                          <Radio value="2">2점 이상</Radio>
                          <Radio value="1">1점 이상</Radio>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">수업 형태</h4>
                      <div className="flex flex-wrap gap-4">
                        <Checkbox
                          isSelected={classTypes.includes('offline')}
                          onValueChange={() => handleClassTypeToggle('offline')}
                        >
                          오프라인
                        </Checkbox>
                        <Checkbox
                          isSelected={classTypes.includes('online')}
                          onValueChange={() => handleClassTypeToggle('online')}
                        >
                          온라인
                        </Checkbox>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">수업 옵션</h4>
                      <div className="flex flex-wrap gap-4">
                        <Checkbox
                          isSelected={classTypes.includes('group')}
                          onValueChange={() => handleClassTypeToggle('group')}
                        >
                          그룹 레슨
                        </Checkbox>
                        <Checkbox
                          isSelected={classTypes.includes('oneToOne')}
                          onValueChange={() => handleClassTypeToggle('oneToOne')}
                        >
                          1:1 레슨
                        </Checkbox>
                        <Checkbox
                          isSelected={classTypes.includes('oneDay')}
                          onValueChange={() => handleClassTypeToggle('oneDay')}
                        >
                          원데이 클래스
                        </Checkbox>
                        <Checkbox
                          isSelected={classTypes.includes('regular')}
                          onValueChange={() => handleClassTypeToggle('regular')}
                        >
                          정기 클래스
                        </Checkbox>
                        <Checkbox
                          isSelected={classTypes.includes('beginner')}
                          onValueChange={() => handleClassTypeToggle('beginner')}
                        >
                          초보자 환영
                        </Checkbox>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="font-medium mb-3">나이 범위</h4>
                      <div className="px-2">
                        <Slider
                          label="나이"
                          step={1}
                          minValue={20}
                          maxValue={80}
                          value={ageRange}
                          onChange={setAgeRange as any}
                          showTooltip
                          className="max-w-md"
                        />
                        <div className="flex justify-between mt-2 text-sm text-foreground-500">
                          <span>20세</span>
                          <span>80세</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">정원</h4>
                      <RadioGroup value={memberCount} onValueChange={setMemberCount}>
                        <div className="grid grid-cols-3 gap-4">
                          <Radio value="all">전체</Radio>
                          <Radio value="10">~10명</Radio>
                          <Radio value="30">~30명</Radio>
                          <Radio value="50">~50명</Radio>
                          <Radio value="100">~100명</Radio>
                          <Radio value="100+">100명+</Radio>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">모임 형태</h4>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <Checkbox
                          isSelected={moimTypes.includes('offline')}
                          onValueChange={() => handleMoimTypeToggle('offline')}
                        >
                          오프라인
                        </Checkbox>
                        <Checkbox
                          isSelected={moimTypes.includes('online')}
                          onValueChange={() => handleMoimTypeToggle('online')}
                        >
                          온라인
                        </Checkbox>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">모임 타입</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <Chip
                          variant={moimTypes.includes('all') ? "solid" : "bordered"}
                          color={moimTypes.includes('all') ? "primary" : "default"}
                          onClick={() => handleMoimTypeToggle('all')}
                          className="cursor-pointer"
                        >
                          전체
                        </Chip>
                        <Chip
                          variant={moimTypes.includes('regular') ? "solid" : "bordered"}
                          color={moimTypes.includes('regular') ? "primary" : "default"}
                          onClick={() => handleMoimTypeToggle('regular')}
                          className="cursor-pointer"
                        >
                          정기모임
                        </Chip>
                        <Chip
                          variant={moimTypes.includes('oneDay') ? "solid" : "bordered"}
                          color={moimTypes.includes('oneDay') ? "primary" : "default"}
                          onClick={() => handleMoimTypeToggle('oneDay')}
                          className="cursor-pointer"
                        >
                          원데이
                        </Chip>
                        <Chip
                          variant={moimTypes.includes('small') ? "solid" : "bordered"}
                          color={moimTypes.includes('small') ? "primary" : "default"}
                          onClick={() => handleMoimTypeToggle('small')}
                          className="cursor-pointer"
                        >
                          소규모
                        </Chip>
                        <Chip
                          variant={moimTypes.includes('large') ? "solid" : "bordered"}
                          color={moimTypes.includes('large') ? "primary" : "default"}
                          onClick={() => handleMoimTypeToggle('large')}
                          className="cursor-pointer"
                        >
                          대규모
                        </Chip>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={resetFilters}>
                초기화
              </Button>
              <Button color="primary" onPress={applyFilters}>
                적용하기
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FilterModal;