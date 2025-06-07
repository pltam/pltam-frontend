import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Calendar
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { CalendarDate, Time, today, getLocalTimeZone } from '@internationalized/date';

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (scheduleData: any) => void;
  selectedDate?: Date;
}

const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedDate
}) => {
  const currentDate = new Date();
  const defaultDate = selectedDate || currentDate;
  
  const [formData, setFormData] = React.useState({
    title: '',
    type: 'custom',
    date: today(getLocalTimeZone()),
    time: new Time(12, 0),
    location: '',
    description: ''
  });

  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

  React.useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: today(getLocalTimeZone())
      }));
    }
  }, [selectedDate]);

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    const scheduleDateTime = new Date(
      formData.date.year,
      formData.date.month - 1,
      formData.date.day,
      formData.time.hour,
      formData.time.minute
    );

    const newSchedule = {
      id: Date.now(),
      title: formData.title,
      type: formData.type,
      date: scheduleDateTime.toISOString(),
      location: formData.location,
      description: formData.description
    };

    onSubmit(newSchedule);
    onClose();
    
    // 폼 초기화
    setFormData({
      title: '',
      type: 'custom',
      date: today(getLocalTimeZone()),
      time: new Time(12, 0),
      location: '',
      description: ''
    });
  };

  const scheduleTypes = [
    { key: 'custom', label: '개인 일정' },
    { key: 'meeting', label: '미팅' },
    { key: 'appointment', label: '약속' },
    { key: 'reminder', label: '알림' }
  ];

  // 시간 선택을 위한 옵션들
  const hourOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i === 0 ? 12 : i,
    label: (i === 0 ? 12 : i).toString()
  }));

  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, '0')
  }));

  const periodOptions = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' }
  ];

  const getCurrentHour12 = (time: Time) => {
    return time.hour === 0 ? 12 : time.hour > 12 ? time.hour - 12 : time.hour;
  };

  const getCurrentPeriod = (time: Time) => {
    return time.hour < 12 ? 'AM' : 'PM';
  };

  const convertTo24Hour = (hour12: number, period: string) => {
    if (period === 'AM') {
      return hour12 === 12 ? 0 : hour12;
    } else {
      return hour12 === 12 ? 12 : hour12 + 12;
    }
  };

  const formatDate = (date: CalendarDate) => {
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = new Date(date.year, date.month - 1, date.day).getDay();
    return `${date.year}년 ${months[date.month - 1]} ${date.day}일 (${weekdays[dayOfWeek]})`;
  };

  const formatTime = (time: Time) => {
    const hour = time.hour === 0 ? 12 : time.hour > 12 ? time.hour - 12 : time.hour;
    const period = time.hour < 12 ? 'AM' : 'PM';
    return `${hour}:${time.minute.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <Icon icon="lucide:calendar-plus" className="text-primary-500" />
          일정 추가
        </ModalHeader>
        <ModalBody className="gap-4">
          <Input
            label="일정 제목"
            placeholder="일정 제목을 입력하세요"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            isRequired
          />

          <Select
            label="일정 유형"
            selectedKeys={[formData.type]}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              setFormData({ ...formData, type: selectedKey });
            }}
          >
            {scheduleTypes.map((type) => (
              <SelectItem key={type.key}>
                {type.label}
              </SelectItem>
            ))}
          </Select>

          <div className="flex gap-4">
            {/* 날짜 선택 */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground-700 mb-2">날짜</label>
              <Popover 
                isOpen={isDatePickerOpen} 
                onOpenChange={setIsDatePickerOpen}
                placement="bottom-start"
              >
                <PopoverTrigger>
                  <Button
                    variant="bordered"
                    className="w-full justify-start"
                    startContent={<Icon icon="lucide:calendar" className="text-foreground-400" />}
                  >
                    {formatDate(formData.date)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    value={formData.date as any}
                    onChange={(date) => {
                      if (date) {
                        setFormData({ ...formData, date: date as any });
                        setIsDatePickerOpen(false);
                      }
                    }}
                    minValue={today(getLocalTimeZone())}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 시간 선택 */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground-700 mb-2">시간</label>
              <div className="flex gap-2">
                {/* 시 선택 */}
                <Select
                  placeholder="시"
                  selectedKeys={[getCurrentHour12(formData.time).toString()]}
                  onSelectionChange={(keys) => {
                    const selectedHour = parseInt(Array.from(keys)[0] as string);
                    const currentPeriod = getCurrentPeriod(formData.time);
                    const hour24 = convertTo24Hour(selectedHour, currentPeriod);
                    setFormData({
                      ...formData,
                      time: new Time(hour24, formData.time.minute)
                    });
                  }}
                  className="flex-1"
                  size="sm"
                >
                  {hourOptions.map((option) => (
                    <SelectItem key={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                {/* 분 선택 */}
                <Select
                  placeholder="분"
                  selectedKeys={[formData.time.minute.toString()]}
                  onSelectionChange={(keys) => {
                    const selectedMinute = parseInt(Array.from(keys)[0] as string);
                    setFormData({
                      ...formData,
                      time: new Time(formData.time.hour, selectedMinute)
                    });
                  }}
                  className="flex-1"
                  size="sm"
                >
                  {minuteOptions.map((option) => (
                    <SelectItem key={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                {/* AM/PM 선택 */}
                <Select
                  placeholder="AM/PM"
                  selectedKeys={[getCurrentPeriod(formData.time)]}
                  onSelectionChange={(keys) => {
                    const selectedPeriod = Array.from(keys)[0] as string;
                    const currentHour12 = getCurrentHour12(formData.time);
                    const hour24 = convertTo24Hour(currentHour12, selectedPeriod);
                    setFormData({
                      ...formData,
                      time: new Time(hour24, formData.time.minute)
                    });
                  }}
                  className="w-20"
                  size="sm"
                >
                  {periodOptions.map((option) => (
                    <SelectItem key={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <Input
            label="장소"
            placeholder="장소를 입력하세요"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            startContent={<Icon icon="lucide:map-pin" className="text-foreground-400" />}
          />

          <Textarea
            label="메모"
            placeholder="일정에 대한 추가 정보를 입력하세요"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            minRows={3}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            취소
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isDisabled={!formData.title.trim()}
          >
            추가
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateScheduleModal;