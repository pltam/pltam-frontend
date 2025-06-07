import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Tabs, Tab, Chip, Avatar, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { mockClasses, mockMoims, mockSchedules } from '../../data/mockData';
import { useAppContext } from '../../context/AppContext';
import { Schedule } from '../../types/category';
import Calendar from '../../components/schedule/Calendar';
import CreateScheduleModal from '../../components/schedule/CreateScheduleModal';

const SchedulePage: React.FC = () => {
  const [selected, setSelected] = React.useState<string>("calendar");
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [schedules, setSchedules] = React.useState<Schedule[]>(mockSchedules);
  const { categories } = useAppContext();
  const navigate = useNavigate();

  const upcomingEvents = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.date);
    const now = new Date();
    return scheduleDate >= now;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.date);
    const now = new Date();
    return scheduleDate < now;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      weekday: 'long'
    };
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
  };

  const getSubCategoryName = (categoryId: number, subCategoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return "";
    
    const subCategory = category.subCategories.find(sub => sub.id === subCategoryId);
    return subCategory ? subCategory.name : "";
  };
  
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "";
  };

  const handleScheduleClick = (schedule: Schedule) => {
    navigate(`/schedule-detail/${schedule.id}`);
  };

  const handleItemClick = (type: 'class' | 'moim', id: number) => {
    if (type === 'class') {
      navigate(`/class-detail/${id}`);
    } else {
      navigate(`/moim-detail/${id}`);
    }
  };

  const handleCreateSchedule = (scheduleData: any) => {
    const newSchedule: Schedule = {
      ...scheduleData,
      id: Date.now()
    };
    setSchedules([...schedules, newSchedule]);
  };

  const renderEventCard = (event: any, isSchedule = false) => (
    <Card 
      key={event.id} 
      className="border border-divider cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => isSchedule ? handleScheduleClick(event) : handleItemClick(event.type, event.id)}
    >
      <CardBody className="p-4">
        <div className="flex">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-20 h-20 object-cover rounded-lg mr-4"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold hover:text-primary-600 transition-colors">{event.title}</h3>
              <div className="flex flex-wrap gap-1">
                <Chip 
                  size="sm" 
                  color={
                    event.type === 'class' 
                      ? "primary" 
                      : event.type === 'moim'
                      ? "secondary"
                      : "default"
                  } 
                  variant="flat"
                >
                  {event.type === 'class' ? '수업' : event.type === 'moim' ? '모임' : '개인 일정'}
                </Chip>
                {event.categoryId && (
                  <Chip size="sm" variant="flat" color="default">
                    {getCategoryName(event.categoryId)}
                  </Chip>
                )}
                {event.categoryId && event.subCategoryId && (
                  <Chip size="sm" variant="flat" color="default">
                    {getSubCategoryName(event.categoryId, event.subCategoryId)}
                  </Chip>
                )}
              </div>
            </div>
            <div className="flex items-center mb-1">
              <Icon icon="lucide:calendar" className="text-foreground-400 mr-1 text-sm" />
              <span className="text-foreground-600 text-sm">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center mb-2">
              <Icon icon="lucide:map-pin" className="text-foreground-400 mr-1 text-sm" />
              <span className="text-foreground-600 text-sm">{event.location}</span>
            </div>
            <div className="flex items-center">
              <Avatar 
                src={event.instructor?.avatar || event.leader?.avatar || 'https://img.heroui.chat/image/avatar?w=200&h=200&u=default'} 
                size="sm"
                className="mr-2"
              />
              <span className="text-foreground-600 text-sm">
                {event.instructor?.name || event.leader?.name || '개인 일정'}
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">일정 관리</h1>
        <Button 
          color="primary" 
          startContent={<Icon icon="lucide:plus" />}
          onPress={() => setIsCreateModalOpen(true)}
        >
          일정 추가
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="px-6 py-4">
          <h2 className="text-lg font-semibold">내 일정</h2>
        </CardHeader>
        <CardBody className="px-0">
          <Tabs 
            aria-label="Schedule options" 
            selectedKey={selected} 
            onSelectionChange={setSelected as any}
            className="w-full"
            variant="underlined"
            color="primary"
            classNames={{
              tabList: "px-6",
              panel: "px-6 py-4"
            }}
          >
            <Tab key="calendar" title="달력">
              <Calendar 
                schedules={schedules}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onScheduleClick={handleScheduleClick}
              />
            </Tab>
            <Tab key="upcoming" title="예정된 일정">
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => renderEventCard(event, true))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Icon icon="lucide:calendar-x" className="text-foreground-300 text-5xl mb-4" />
                  <p className="text-foreground-600 mb-2">예정된 일정이 없습니다</p>
                  <p className="text-foreground-400 text-sm">수업이나 모임에 참여하여 일정을 추가해보세요</p>
                </div>
              )}
            </Tab>
            <Tab key="past" title="지난 일정">
              {pastEvents.length > 0 ? (
                <div className="space-y-4">
                  {pastEvents.map((event) => renderEventCard(event, true))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Icon icon="lucide:calendar-x" className="text-foreground-300 text-5xl mb-4" />
                  <p className="text-foreground-600 mb-2">지난 일정이 없습니다</p>
                  <p className="text-foreground-400 text-sm">아직 참여한 수업이나 모임이 없습니다</p>
                </div>
              )}
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="px-6 py-4">
            <h2 className="text-lg font-semibold">내 수업</h2>
          </CardHeader>
          <CardBody className="px-6 py-4">
            {mockClasses.slice(0, 3).map((classItem) => (
              <div 
                key={classItem.id} 
                className="flex items-center mb-4 last:mb-0 cursor-pointer hover:bg-hover rounded-lg p-2 -m-2 transition-colors"
                onClick={() => handleItemClick('class', classItem.id)}
              >
                <img 
                  src={classItem.image} 
                  alt={classItem.title} 
                  className="w-12 h-12 object-cover rounded-md mr-3"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate hover:text-primary-600 transition-colors">
                    {classItem.title}
                  </h3>
                  <p className="text-xs text-foreground-500">
                    {classItem.instructor.name} | {classItem.location}
                  </p>
                </div>
                <Icon icon="lucide:chevron-right" className="text-foreground-400" />
              </div>
            ))}
          </CardBody>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="px-6 py-4">
            <h2 className="text-lg font-semibold">내 모임</h2>
          </CardHeader>
          <CardBody className="px-6 py-4">
            {mockMoims.slice(0, 3).map((moim) => (
              <div 
                key={moim.id} 
                className="flex items-center mb-4 last:mb-0 cursor-pointer hover:bg-hover rounded-lg p-2 -m-2 transition-colors"
                onClick={() => handleItemClick('moim', moim.id)}
              >
                <img 
                  src={moim.image} 
                  alt={moim.title} 
                  className="w-12 h-12 object-cover rounded-md mr-3"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate hover:text-secondary-600 transition-colors">
                    {moim.title}
                  </h3>
                  <p className="text-xs text-foreground-500">
                    {moim.location} | {moim.memberCount}/{moim.maxMembers}명
                  </p>
                </div>
                <Icon icon="lucide:chevron-right" className="text-foreground-400" />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <CreateScheduleModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSchedule}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default SchedulePage;