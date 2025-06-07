import React from 'react';
import { Card, CardBody, Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Schedule } from '../../types/category';

interface CalendarProps {
  schedules: Schedule[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onScheduleClick: (schedule: Schedule) => void;
}

const Calendar: React.FC<CalendarProps> = ({ 
  schedules, 
  selectedDate, 
  onDateChange, 
  onScheduleClick 
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getSchedulesForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date).toISOString().split('T')[0];
      return scheduleDate === dateString;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // 시간순 정렬
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateChange(today);
  };

  const handleScheduleClick = (e: React.MouseEvent, schedule: Schedule, date: Date) => {
    e.stopPropagation();
    onDateChange(date); // 날짜를 선택하여 오른쪽에 일정 목록을 표시
    onScheduleClick(schedule); // 일정 클릭 시 상세페이지로 이동
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long' 
  });

  const days = [];
  
  // 빈 셀 추가 (이전 달)
  for (let i = 0; i < firstDay; i++) {
    days.push(
      <div key={`empty-${i}`} className="h-32 border-b border-r border-divider bg-default-50"></div>
    );
  }

  // 현재 달의 날짜들
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const daySchedules = getSchedulesForDate(date);
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
    
    days.push(
      <div 
        key={day}
        className={`h-32 border-b border-r border-divider p-1 cursor-pointer hover:bg-hover transition-colors relative ${
          isSelected(date) ? 'bg-primary-50 border-primary-200' : ''
        } ${isPast ? 'opacity-75' : ''}`}
        onClick={() => onDateChange(date)}
      >
        <div className={`text-sm font-medium mb-1 flex items-center justify-between ${
          isToday(date) 
            ? 'text-white' 
            : isPast 
            ? 'text-foreground-400'
            : 'text-foreground-700'
        }`}>
          <span className={
            isToday(date) 
              ? 'bg-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold' 
              : ''
          }>
            {day}
          </span>
          {daySchedules.length > 0 && (
            <div className="flex items-center gap-1">
              <Icon icon="lucide:circle-dot" className="text-primary text-xs" />
              <span className="text-xs text-foreground-500">{daySchedules.length}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-0.5 overflow-hidden flex-1">
          {daySchedules.slice(0, 2).map((schedule) => (
            <div
              key={schedule.id}
              className={`text-xs px-1 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity truncate ${
                schedule.type === 'class' 
                  ? 'bg-primary-100 text-primary-700 border-l-2 border-primary-500'
                  : schedule.type === 'moim'
                  ? 'bg-secondary-100 text-secondary-700 border-l-2 border-secondary-500'
                  : 'bg-default-100 text-default-700 border-l-2 border-default-500'
              }`}
              onClick={(e) => handleScheduleClick(e, schedule, date)}
              title={`${schedule.title} - ${new Date(schedule.date).toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}`}
            >
              <div className="truncate font-medium leading-tight">{schedule.title}</div>
              <div className="truncate opacity-75 text-xs leading-tight">
                {new Date(schedule.date).toLocaleTimeString('ko-KR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          ))}
          {daySchedules.length > 2 && (
            <div 
              className="text-xs text-primary-600 px-1 py-0.5 cursor-pointer hover:bg-primary-50 rounded leading-tight font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onDateChange(date);
              }}
              title={`총 ${daySchedules.length}개의 일정이 있습니다`}
            >
              <div className="flex items-center gap-1 truncate">
                <Icon icon="lucide:more-horizontal" className="text-xs flex-shrink-0" />
                <span className="truncate">+{daySchedules.length - 2}개</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardBody className="p-0">
        {/* 달력 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-divider">
          <h3 className="text-lg font-semibold">{monthName}</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="light"
              onPress={goToToday}
              className="text-primary"
            >
              오늘
            </Button>
            <Button
              size="sm"
              variant="light"
              isIconOnly
              onPress={goToPrevMonth}
            >
              <Icon icon="lucide:chevron-left" />
            </Button>
            <Button
              size="sm"
              variant="light"
              isIconOnly
              onPress={goToNextMonth}
            >
              <Icon icon="lucide:chevron-right" />
            </Button>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b border-divider">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <div 
              key={day} 
              className={`p-3 text-center text-sm font-medium border-r border-divider last:border-r-0 ${
                index === 0 ? 'text-danger-500' : index === 6 ? 'text-primary-500' : 'text-foreground-600'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 달력 그리드 */}
        <div className="grid grid-cols-7">
          {days}
        </div>

        {/* 범례 및 통계 */}
        <div className="p-4 border-t border-divider">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-500 rounded"></div>
                <span>수업</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary-500 rounded"></div>
                <span>모임</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-default-500 rounded"></div>
                <span>개인 일정</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-foreground-500">
              <div className="flex items-center gap-1">
                <Icon icon="lucide:calendar" className="text-sm" />
                <span>총 {schedules.length}개 일정</span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Calendar;