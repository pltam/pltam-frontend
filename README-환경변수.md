# 플탐 환경변수 가이드

## 개발 환경에서 임시 계정 사용하기

### 1. 환경 설정

개발 환경에서는 `.env.development` 파일에 설정된 임시 데모 계정을 사용할 수 있습니다.

```bash
# 개발 서버 시작
npm run start:dev

# 또는
npm start
```

### 2. 데모 계정 정보

- **이메일**: demo@pltam.com
- **비밀번호**: demo123
- **사용자명**: 데모 사용자

### 3. 데모 계정 사용법

1. 로그인 모달을 열면 **개발환경에서만** 상단에 노란색 데모 계정 카드가 표시됩니다
2. "데모 계정으로 빠른 로그인" 버튼을 클릭하면 자동으로 로그인됩니다
3. 일반 로그인 폼에 직접 입력해도 됩니다

### 4. 배포 시 자동 제거

배포 환경에서는 데모 계정이 **자동으로 비활성화**됩니다:

```bash
# 배포용 빌드 (데모 계정 비활성화)
npm run build:prod
```

### 5. 환경변수 파일 구조

```
├── .env.development     # 개발환경 (데모 계정 활성화)
├── .env.production      # 배포환경 (데모 계정 비활성화)
└── .env.local          # 로컬 개발자별 설정 (Git 제외)
```

### 6. 보안 주의사항

- **민감한 정보는 절대 .env.development에 저장하지 마세요**
- 실제 API 키나 비밀번호는 .env.local에 저장하세요
- .env.local 파일은 Git에 커밋되지 않습니다

### 7. 번역 기능 테스트

로그인 후 채팅 기능에서 번역을 테스트할 수 있습니다:

1. 채팅 → 설정 → 언어 변경
2. 메시지 번역 표시 스위치 켜기
3. user2 채팅방의 영어 메시지에서 번역 확인

## 개발 팁

### 환경 확인
```javascript
// 현재 환경 확인
console.log('Environment:', process.env.REACT_APP_ENV);
console.log('Demo Enabled:', process.env.REACT_APP_DEV_DEMO_ENABLED);
```

### 조건부 기능
```javascript
// 개발환경에서만 실행
if (process.env.REACT_APP_DEV_DEMO_ENABLED === 'true') {
  console.log('개발모드 활성화');
}
```
