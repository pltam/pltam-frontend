import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  RadioGroup,
  Radio
} from '@heroui/react';
import { Icon } from '@iconify/react';

interface LanguageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (language: string) => void;
  currentLanguage: string;
}

const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentLanguage
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const languages = [
    { value: 'ko', label: '한국어', flag: '🇰🇷' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'ja', label: '日本語', flag: '🇯🇵' },
    { value: 'zh', label: '中文', flag: '🇨🇳' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { value: 'ru', label: 'Русский', flag: '🇷🇺' }
  ];

  const handleSave = () => {
    onSelect(selectedLanguage);
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      setSelectedLanguage(currentLanguage);
    }
  }, [isOpen, currentLanguage]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="md"
      classNames={{
        base: "w-full max-w-md mx-4 z-[10000]",
        backdrop: "z-[10000]",
        wrapper: "z-[10000]",
        body: "p-6"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3 border-b border-divider pb-4">
          <Icon icon="lucide:globe" className="text-primary" />
          <h3 className="text-lg font-bold">언어 선택</h3>
        </ModalHeader>
        
        <ModalBody>
          <p className="text-sm text-gray-600 mb-4">
            채팅 인터페이스에서 사용할 언어를 선택하세요.
          </p>
          
          <RadioGroup
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
            classNames={{
              wrapper: "space-y-1"
            }}
          >
            {languages.map((language) => (
              <Radio
                key={language.value}
                value={language.value}
                classNames={{
                  base: "w-full max-w-none hover:bg-gray-50 rounded-lg p-3 m-0 border border-gray-200",
                  wrapper: "mr-3"
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <span className="font-medium">{language.label}</span>
                </div>
              </Radio>
            ))}
          </RadioGroup>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2 pt-4 border-t border-divider">
          <Button
            variant="light"
            onPress={onClose}
          >
            취소
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            startContent={<Icon icon="lucide:check" />}
          >
            선택
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LanguageSelectModal;