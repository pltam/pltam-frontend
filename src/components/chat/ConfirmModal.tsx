import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@heroui/react';
import { Icon } from '@iconify/react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  type = 'warning'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Icon icon="lucide:alert-triangle" className="text-red-500" />;
      case 'info':
        return <Icon icon="lucide:info" className="text-blue-500" />;
      default:
        return <Icon icon="lucide:alert-circle" className="text-orange-500" />;
    }
  };

  const getConfirmColor = () => {
    switch (type) {
      case 'danger':
        return 'danger';
      case 'info':
        return 'primary';
      default:
        return 'warning';
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="sm"
      classNames={{
        base: "w-full max-w-md mx-4 z-[10000]",
        backdrop: "z-[10000]",
        wrapper: "z-[10000]",
        body: "p-6"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3 border-b border-divider pb-4">
          {getIcon()}
          <h3 className="text-lg font-bold">{title}</h3>
        </ModalHeader>
        
        <ModalBody>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {message}
          </p>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2 pt-4 border-t border-divider">
          <Button
            variant="light"
            onPress={onClose}
          >
            {cancelText}
          </Button>
          <Button
            color={getConfirmColor()}
            onPress={handleConfirm}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;