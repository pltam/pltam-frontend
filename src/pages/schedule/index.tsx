import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Tabs, Tab, Chip, Avatar, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { mockSchedules, mockClasses, mockMoims } from '../../data/mockData';
import { useAppContext } from '../../context/AppContext';
import Calendar from '../../components/schedule/Calendar';
import CreateScheduleModal from '../../components/schedule/CreateScheduleModal';

const SchedulePage: React.FC = () => {
  const [selected, setSelected] = React.useState<string>("calendar");
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [schedules, setSchedules] = React.useState(mockSchedules);
  const [showAllClasses, setShowAllClasses] = React.useState(false);
  const [showAllMoims, setShowAllMoims] = React.useState(false);
  const navigate = useNavigate();
  const { categories } = useAppContext();

  // mockSchedules를 사용하여 일정 데이터 가져오기
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

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "";
  };

  const handleScheduleClick = (schedule: any) => {
    if (schedule.type === 'class') {
      // 수업 일정인 경우 - moimId나 classId가 있다면 직접 사용하고, 없다면 제목으로 찾기
      if (schedule.classId) {
        navigate(`/class-detail/${schedule.classId}`);
      } else {
        const matchingClass = mockClasses.find(cls => cls.title === schedule.title);
        if (matchingClass) {
          navigate(`/class-detail/${matchingClass.id}`);
        } else {
          navigate(`/schedule-detail/${schedule.id}`);
        }
      }
    } else if (schedule.type === 'moim') {
      // 모임 일정인 경우 - moimId가 있다면 직접 사용하고, 없다면 제목으로 찾기
      if (schedule.moimId) {
        navigate(`/moim-detail/${schedule.moimId}`);
      } else {
        const matchingMoim = mockMoims.find(moim => moim.title === schedule.title);
        if (matchingMoim) {
          navigate(`/moim-detail/${matchingMoim.id}`);
        } else {
          navigate(`/schedule-detail/${schedule.id}`);
        }
      }
    } else {
      // 개인 일정인 경우
      navigate(`/schedule-detail/${schedule.id}`);
    }
  };

  const handleClassClick = (classId: number) => {
    navigate(`/class-detail/${classId}`);
  };

  const handleMoimClick = (moimId: number) => {
    navigate(`/moim-detail/${moimId}`);
  };

  const handleCreateSchedule = (scheduleData: any) => {
    const newSchedule = {
      ...scheduleData,
      id: Date.now(),
      type: 'custom'
    };
    setSchedules([...schedules, newSchedule]);
  };

  const getSelectedDateEvents = () => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date).toISOString().split('T')[0];
      return scheduleDate === selectedDateString;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // 시간순 정렬
  };

  const selectedDateEvents = getSelectedDateEvents();

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
            <Tab key="calendar" title="달력 보기">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Calendar
                    schedules={schedules}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    onScheduleClick={handleScheduleClick}
                  />
                </div>
                <div className="lg:col-span-1">
                  <Card className="sticky top-20 h-fit">
                    <CardHeader className="px-4 py-3">
                      <h3 className="text-lg font-semibold">
                        {selectedDate.toLocaleDateString('ko-KR', { 
                          month: 'long', 
                          day: 'numeric',
                          weekday: 'long'
                        })}
                      </h3>
                    </CardHeader>
                    <CardBody className="px-4 py-4">
                      {selectedDateEvents.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {selectedDateEvents.map((event) => (
                            <Card 
                              key={event.id} 
                              className="border border-divider cursor-pointer hover:shadow-md transition-shadow w-full"
                              isPressable
                              onPress={() => handleScheduleClick(event)}
                            >
                              <CardBody className="p-3">
                                <div className="flex items-start gap-3">
                                  {event.image && (
                                    <img 
                                      src={event.image} 
                                      alt={event.title} 
                                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1 gap-2">
                                      <h4 className="font-medium text-sm truncate flex-1">
                                        {event.title}
                                      </h4>
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
                                        className="flex-shrink-0 min-w-fit"
                                      >
                                        {event.type === 'class' ? '수업' : event.type === 'moim' ? '모임' : '개인'}
                                      </Chip>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center text-xs text-foreground-500">
                                        <Icon icon="lucide:clock" className="mr-1 flex-shrink-0" />
                                        <span>
                                          {new Date(event.date).toLocaleTimeString('ko-KR', { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                          })}
                                        </span>
                                      </div>
                                      <div className="flex items-center text-xs text-foreground-500">
                                        <Icon icon="lucide:map-pin" className="mr-1 flex-shrink-0" />
                                        <span className="truncate">{event.location}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <Icon icon="lucide:calendar-x" className="text-foreground-300 text-3xl mb-2" />
                          <p className="text-foreground-500 text-sm text-center">
                            선택한 날짜에<br />일정이 없습니다
                          </p>
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            className="mt-3"
                            onPress={() => setIsCreateModalOpen(true)}
                          >
                            일정 추가
                          </Button>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </div>
              </div>
            </Tab>

            <Tab key="upcoming" title="예정된 일정">
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => {
                    return (
                      <Card 
                        key={event.id} 
                        className="border border-divider cursor-pointer hover:shadow-md transition-shadow w-full"
                        isPressable
                        onPress={() => handleScheduleClick(event)}
                      >
                        <CardBody className="p-4">
                          <div className="flex gap-4">
                            {event.image && (
                              <div className="flex-shrink-0">
                                <img 
                                  src={event.image} 
                                  alt={event.title} 
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-base truncate flex-1 mr-2">{event.title}</h3>
                                <div className="flex flex-wrap gap-1 flex-shrink-0">
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
                                </div>
                              </div>
                              <div className="space-y-1 mb-3">
                                <div className="flex items-center">
                                  <Icon icon="lucide:calendar" className="text-foreground-400 mr-2 text-sm flex-shrink-0" />
                                  <span className="text-foreground-600 text-sm truncate">{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center">
                                  <Icon icon="lucide:map-pin" className="text-foreground-400 mr-2 text-sm flex-shrink-0" />
                                  <span className="text-foreground-600 text-sm truncate">{event.location}</span>
                                </div>
                              </div>
                              {(event.instructor || event.leader) && (
                                <div className="flex items-center">
                                  <Avatar 
                                    src={event.instructor?.avatar || event.leader?.avatar} 
                                    size="sm"
                                    className="mr-2 flex-shrink-0"
                                  />
                                  <span className="text-foreground-600 text-sm truncate">
                                    {event.instructor?.name || event.leader?.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Icon icon="lucide:calendar-x" className="text-foreground-300 text-5xl mb-4" />
                  <p className="text-foreground-600 mb-2">예정된 일정이 없습니다</p>
                  <p className="text-foreground-400 text-sm">수업이나 모임에 참여하거나 새로운 일정을 추가해보세요</p>
                </div>
              )}
            </Tab>
            
            <Tab key="past" title="지난 일정">
              {pastEvents.length > 0 ? (
                <div className="space-y-4">
                  {pastEvents.map((event) => {
                    return (
                      <Card 
                        key={event.id} 
                        className="border border-divider cursor-pointer hover:shadow-md transition-shadow w-full"
                        isPressable
                        onPress={() => handleScheduleClick(event)}
                      >
                        <CardBody className="p-4">
                          <div className="flex gap-4">
                            {event.image && (
                              <div className="flex-shrink-0">
                                <img 
                                  src={event.image} 
                                  alt={event.title} 
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-base truncate flex-1 mr-2">{event.title}</h3>
                                <div className="flex flex-wrap gap-1 flex-shrink-0">
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
                                </div>
                              </div>
                              <div className="space-y-1 mb-3">
                                <div className="flex items-center">
                                  <Icon icon="lucide:calendar" className="text-foreground-400 mr-2 text-sm flex-shrink-0" />
                                  <span className="text-foreground-600 text-sm truncate">{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center">
                                  <Icon icon="lucide:map-pin" className="text-foreground-400 mr-2 text-sm flex-shrink-0" />
                                  <span className="text-foreground-600 text-sm truncate">{event.location}</span>
                                </div>
                              </div>
                              {(event.instructor || event.leader) && (
                                <div className="flex items-center">
                                  <Avatar 
                                    src={event.instructor?.avatar || event.leader?.avatar} 
                                    size="sm"
                                    className="mr-2 flex-shrink-0"
                                  />
                                  <span className="text-foreground-600 text-sm truncate">
                                    {event.instructor?.name || event.leader?.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card className="h-fit">
          <CardHeader className="px-6 py-4">
            <h2 className="text-lg font-semibold">내 수업</h2>
          </CardHeader>
          <CardBody className="px-6 py-4">
            {(showAllClasses ? mockClasses : mockClasses.slice(0, 3)).map((classItem) => {
              return (
                <div 
                  key={classItem.id} 
                  className="flex items-center mb-4 last:mb-0 cursor-pointer hover:bg-hover p-2 rounded-lg transition-colors"
                  onClick={() => handleClassClick(classItem.id)}
                >
                  <img 
                    src={classItem.image} 
                    alt={classItem.title} 
                    className="w-12 h-12 object-cover rounded-md mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{classItem.title}</h3>
                    <p className="text-xs text-foreground-500">
                      {classItem.instructor.name} | {classItem.location}
                    </p>
                  </div>
                  <Icon icon="lucide:chevron-right" className="text-foreground-400" />
                </div>
              );
            })}
            {mockClasses.length > 3 && (
              <div className="mt-4 pt-3 border-t border-divider">
                <Button
                  variant="light"
                  color="primary"
                  size="sm"
                  className="w-full"
                  startContent={<Icon icon={showAllClasses ? "lucide:minus" : "lucide:plus"} />}
                  onPress={() => setShowAllClasses(!showAllClasses)}
                >
                  {showAllClasses ? '접기' : `${mockClasses.length - 3}개 더보기`}
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="h-fit">
          <CardHeader className="px-6 py-4">
            <h2 className="text-lg font-semibold">내 모임</h2>
          </CardHeader>
          <CardBody className="px-6 py-4">
            {(showAllMoims ? mockMoims : mockMoims.slice(0, 3)).map((moim) => {
              return (
                <div 
                  key={moim.id} 
                  className="flex items-center mb-4 last:mb-0 cursor-pointer hover:bg-hover p-2 rounded-lg transition-colors"
                  onClick={() => handleMoimClick(moim.id)}
                >
                  <img 
                    src={moim.image} 
                    alt={moim.title} 
                    className="w-12 h-12 object-cover rounded-md mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{moim.title}</h3>
                    <p className="text-xs text-foreground-500">
                      {moim.location} | {moim.memberCount}/{moim.maxMembers}명
                    </p>
                  </div>
                  <Icon icon="lucide:chevron-right" className="text-foreground-400" />
                </div>
              );
            })}
            {mockMoims.length > 3 && (
              <div className="mt-4 pt-3 border-t border-divider">
                <Button
                  variant="light"
                  color="primary"
                  size="sm"
                  className="w-full"
                  startContent={<Icon icon={showAllMoims ? "lucide:minus" : "lucide:plus"} />}
                  onPress={() => setShowAllMoims(!showAllMoims)}
                >
                  {showAllMoims ? '접기' : `${mockMoims.length - 3}개 더보기`}
                </Button>
              </div>
            )}
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