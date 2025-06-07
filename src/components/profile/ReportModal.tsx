import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  RadioGroup,
  Radio,
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { User } from '../../data/mockData';

interface ReportModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onReport: (reason: string, details: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  user,
  isOpen,
  onClose,
  onReport
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    { value: 'spam', label: '스팸/광고성 콘텐츠' },
    { value: 'harassment', label: '욕설/비방/혐오표현' },
    { value: 'illegal', label: '불법/유해 콘텐츠' },
    { value: 'fraud', label: '사기/허위 정보' },
    { value: 'privacy', label: '개인정보 노출' },
    { value: 'other', label: '기타' }
  ];

  const handleClose = () => {
    setSelectedReason('');
    setDetails('');
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);
    
    try {
      // 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onReport(selectedReason, details);
      
      // 성공 토스트 메시지 (실제로는 토스트 라이브러리 사용)
      alert('신고가 접수되었습니다');
      
      handleClose();
    } catch (error) {
      console.error('신고 처리 중 오류가 발생했습니다:', error);
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="md"
      classNames={{
        base: "w-full max-w-lg mx-4",
        body: "p-6"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3 border-b border-divider pb-4">
          <div className="flex items-center gap-3">
            <Icon icon="lucide:flag" className="text-red-500" />
            <div>
              <h3 className="text-lg font-bold">신고하기</h3>
              <p className="text-sm text-gray-500">{user.name}님을 신고합니다</p>
            </div>
          </div>
        </ModalHeader>
        
        <ModalBody className="space-y-6">
          {/* 신고 사유 선택 */}
          <div>
            <h4 className="text-sm font-semibold mb-3">신고 사유를 선택해주세요</h4>
            <RadioGroup
              value={selectedReason}
              onValueChange={setSelectedReason}
              classNames={{
                wrapper: "space-y-2"
              }}
            >
              {reportReasons.map((reason) => (
                <Radio
                  key={reason.value}
                  value={reason.value}
                  classNames={{
                    base: "w-full max-w-none hover:bg-gray-50 rounded-lg p-2 m-0",
                    wrapper: "mr-3"
                  }}
                >
                  <span className="text-sm">{reason.label}</span>
                </Radio>
              ))}
            </RadioGroup>
          </div>

          {/* 상세 내용 입력 */}
          <div>
            <h4 className="text-sm font-semibold mb-2">상세 내용 (선택사항)</h4>
            <Textarea
              placeholder="신고 사유를 자세히 설명해주세요 (선택사항)"
              value={details}
              onValueChange={setDetails}
              maxRows={4}
              maxLength={500}
              classNames={{
                input: "text-sm",
                inputWrapper: "border border-gray-300"
              }}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                신고는 익명으로 처리되며, 검토 후 적절한 조치가 취해집니다
              </span>
              <span className="text-xs text-gray-400">
                {details.length}/500
              </span>
            </div>
          </div>

          {/* 추가 안내 메시지 */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon icon="lucide:alert-circle" className="text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium mb-1">신고 전 확인사항</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>허위 신고는 제재를 받을 수 있습니다</li>
                  <li>신고 내용은 관리자가 검토합니다</li>
                  <li>처리 결과는 별도로 안내되지 않습니다</li>
                </ul>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2 pt-4 border-t border-divider">
          <Button
            variant="light"
            onPress={handleClose}
            isDisabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            color="danger"
            onPress={handleSubmit}
            isDisabled={!selectedReason || isSubmitting}
            isLoading={isSubmitting}
            startContent={!isSubmitting && <Icon icon="lucide:flag" />}
          >
            {isSubmitting ? '신고 중...' : '신고하기'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReportModal;