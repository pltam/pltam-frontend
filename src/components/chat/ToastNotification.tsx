import React, { useEffect } from 'react';
import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';

interface ToastNotificationProps {
  isVisible: boolean;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  isVisible,
  message,
  type = 'success',
  duration = 3000,
  onClose
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Icon icon="lucide:check-circle" className="text-green-500" />;
      case 'error':
        return <Icon icon="lucide:x-circle" className="text-red-500" />;
      case 'warning':
        return <Icon icon="lucide:alert-triangle" className="text-orange-500" />;
      case 'info':
        return <Icon icon="lucide:info" className="text-blue-500" />;
      default:
        return <Icon icon="lucide:check-circle" className="text-green-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-orange-500';
      case 'info':
        return 'border-l-blue-500';
      default:
        return 'border-l-green-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[10001] animate-in slide-in-from-right duration-300">
      <Card className={`shadow-lg border-l-4 ${getBorderColor()} max-w-sm`}>
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            {getIcon()}
            <p className="text-sm font-medium flex-1">{message}</p>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon icon="lucide:x" className="w-4 h-4" />
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ToastNotification;