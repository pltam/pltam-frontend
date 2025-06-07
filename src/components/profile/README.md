# 사용자 프로필 상호작용 시스템

Instagram과 유사한 팔로우 기능과 프로필 상호작용 시스템을 구현했습니다.

## 🎯 주요 기능

### 1. 팔로우 시스템
- ✅ 팔로워/팔로잉 수 표시
- ✅ 팔로우/언팔로우 기능
- ✅ 팔로워/팔로잉 목록 보기
- ✅ 실시간 카운트 업데이트

### 2. 프로필 드롭다운 메뉴
- ✅ 사용자 프로필 사진/이름 클릭 시 나타남
- ✅ 프로필 상세보기, 1:1 채팅, 신고하기 메뉴
- ✅ 본인 프로필은 드롭다운 없음
- ✅ 외부 클릭 및 ESC 키로 닫기

### 3. 프로필 상세 모달
- ✅ 사용자 기본 정보 (프로필 사진, 이름, 가입일, 소개, 위치 등)
- ✅ 온라인 상태 표시
- ✅ 팔로워/팔로잉 수 표시 (클릭 시 목록 보기)
- ✅ 활동 내역 탭 (작성글, 가입 모임, 참여 수업)
- ✅ 팔로우/언팔로우, 1:1 채팅, 신고하기 버튼

### 4. 신고 모달
- ✅ 신고 사유 선택 (스팸, 욕설, 불법 콘텐츠 등)
- ✅ 상세 내용 입력 (선택사항)
- ✅ 익명 신고 처리
- ✅ 허위 신고 방지 안내

## 📁 파일 구조

```
src/
├── data/
│   └── mockData.ts                 # 사용자 데이터 및 팔로우 관계
├── components/profile/
│   ├── UserProfileSystem.tsx       # 메인 시스템 컨테이너
│   ├── UserProfileDropdown.tsx     # 프로필 드롭다운 메뉴
│   ├── UserProfileModal.tsx        # 프로필 상세 모달
│   ├── ReportModal.tsx            # 신고 모달
│   ├── UserProfileClickable.tsx   # 클릭 가능한 프로필 컴포넌트
│   ├── ProfileClickProvider.tsx   # Context Provider
│   └── README.md                  # 사용 가이드
└── App.tsx                        # UserProfileSystem 통합
```

## 🔧 설치 및 설정

프로젝트는 이미 구현이 완료되어 있으며, 다음과 같이 사용할 수 있습니다:

### 1. mockData 업데이트 완료
- ✅ User 인터페이스에 팔로우 관련 필드 추가
- ✅ 팔로우 관계 데이터 추가
- ✅ 사용자별 활동 데이터 추가
- ✅ 채팅방 데이터 mockData 연동

### 2. 프로필 컴포넌트 구현 완료
- ✅ 모든 프로필 관련 컴포넌트 생성
- ✅ 애니메이션 및 반응형 디자인 적용
- ✅ TypeScript 타입 정의 완료

### 3. 전역 시스템 통합 완료
- ✅ App.tsx에 UserProfileSystem 추가
- ✅ 채팅 시작 기능 연동
- ✅ Context Provider 설정

## 🚀 사용 방법

### 기본 사용법
시스템은 이미 전역에서 활성화되어 있습니다. 다음과 같이 사용할 수 있습니다:

```tsx
import { useProfileClick } from './components/profile/ProfileClickProvider';
import UserProfileClickable from './components/profile/UserProfileClickable';

const MyComponent = () => {
  const { onProfileClick } = useProfileClick();

  return (
    <div>
      {/* 클릭 가능한 프로필 컴포넌트 */}
      <UserProfileClickable
        user={someUser}
        onProfileClick={onProfileClick}
        showName={true}
        avatarSize="md"
      />
      
      {/* 또는 직접 클릭 핸들러 사용 */}
      <div onClick={(e) => onProfileClick(userId, e)}>
        <Avatar src={user.avatar} />
        <span>{user.name}</span>
      </div>
    </div>
  );
};
```

### 적용된 위치들
다음 위치에서 프로필 클릭 기능을 사용할 수 있습니다:

- ✅ **수업 카드**: 강사 프로필 클릭
- ✅ **모임 카드**: 리더 프로필 클릭
- ✅ **커뮤니티 게시글**: 작성자 프로필 클릭
- ✅ **댓글**: 댓글 작성자 프로필 클릭
- ✅ **채팅방**: 참여자 프로필 클릭
- ✅ **모임 참가자 목록**: 참가자 프로필 클릭
- ✅ **수업 수강생 목록**: 수강생 프로필 클릭

## 💡 주요 특징

### 1. 팔로우 시스템
```typescript
// 팔로우 상태 확인
const isUserFollowing = isFollowing(currentUserId, targetUserId);

// 팔로우 토글
const newFollowState = toggleFollow(currentUserId, targetUserId);

// 팔로워 목록 가져오기
const followers = getFollowers(userId);

// 팔로잉 목록 가져오기
const following = getFollowing(userId);
```

### 2. 사용자 활동 데이터
```typescript
// 사용자 게시글
const userPosts = getUserPosts(userId, limit);

// 사용자 참여 모임
const userMoims = getUserMoims(userId, limit);

// 사용자 참여 수업
const userClasses = getUserClasses(userId, limit);
```

### 3. 실시간 상태 관리
- 팔로우/언팔로우 시 실시간 카운트 업데이트
- 온라인/오프라인 상태 표시
- 마지막 접속 시간 표시

## 🎨 디자인 특징

### 애니메이션
- 드롭다운: 페이드인 + 슬라이드 (150ms)
- 모달: 부드러운 페이드인/아웃
- 호버 효과: 배경색 변경 및 그림자 효과

### 반응형 디자인
- 데스크탑: 최대 너비 제한 및 중앙 정렬
- 태블릿: 화면 너비 90% 사용
- 모바일: 전체 화면 모달로 변경

### 접근성
- 키보드 네비게이션 지원 (ESC, Enter, Arrow keys)
- ARIA 속성 적용
- 적절한 색상 대비
- 스크린 리더 지원

## 🔒 보안 및 개인정보

### 신고 시스템
- 익명 신고 처리
- 허위 신고 방지 안내
- 신고 사유 카테고리화
- 관리자 검토 프로세스

### 개인정보 보호
- 본인 프로필 특별 처리
- 온라인 상태 선택적 표시
- 민감한 정보 필터링

## 🚦 상태 관리

### 전역 상태
- 현재 로그인 사용자 ID
- 채팅 모달 상태
- 프로필 시스템 상태

### 로컬 상태
- 드롭다운 표시/숨김
- 모달 열기/닫기
- 팔로우 상태
- 로딩 상태

## 📱 모바일 최적화

### 터치 인터페이스
- 충분한 터치 영역 (최소 44px)
- 터치 피드백 제공
- 스와이프 제스처 지원

### 성능 최적화
- 지연 로딩 (Lazy Loading)
- 메모이제이션 (React.memo)
- 가상화 (큰 목록 처리)

## 🧪 테스트

### 주요 테스트 케이스
1. **팔로우 기능**
   - 팔로우/언팔로우 동작
   - 카운트 업데이트
   - 중복 요청 방지

2. **프로필 모달**
   - 올바른 사용자 정보 표시
   - 탭 전환 동작
   - 액션 버튼 기능

3. **신고 기능**
   - 신고 사유 선택
   - 폼 검증
   - 제출 처리

4. **드롭다운 메뉴**
   - 위치 계산
   - 외부 클릭 처리
   - 키보드 네비게이션

## 🔮 향후 개선 사항

### 단기 개선사항
- 프로필 사진 업로드 기능
- 사용자 차단 기능
- 알림 시스템 연동
- 검색 기능 추가

### 장기 개선사항
- 실시간 알림 (WebSocket)
- 추천 사용자 시스템
- 소셜 그래프 분석
- 개인정보 설정 강화

## 🐛 알려진 이슈

### 현재 제한사항
1. **데이터 영속성**: 새로고침 시 팔로우 상태 초기화
2. **실시간 동기화**: 다른 사용자의 팔로우 상태 변경 미반영
3. **대용량 데이터**: 많은 팔로워/팔로잉 목록 성능 이슈

### 해결 예정
- 서버 API 연동으로 데이터 영속성 확보
- WebSocket을 통한 실시간 동기화
- 무한 스크롤 및 가상화로 성능 개선

## 📚 참고 자료

### 사용된 라이브러리
- **@heroui/react**: UI 컴포넌트
- **@iconify/react**: 아이콘
- **framer-motion**: 애니메이션 (기존 프로젝트)
- **React**: 18.x
- **TypeScript**: 타입 안전성

### 설계 참고
- Instagram 팔로우 시스템
- Twitter 사용자 상호작용
- LinkedIn 프로필 모달
- Discord 사용자 정보 카드

## 🎉 완료된 기능 요약

✅ **팔로우 시스템**: 완전 구현  
✅ **프로필 드롭다운**: 모든 기능 구현  
✅ **프로필 상세 모달**: 3개 탭 완성  
✅ **신고 모달**: 6가지 신고 사유 지원  
✅ **mockData 통합**: 모든 데이터 연동 완료  
✅ **채팅 시스템 연동**: 1:1 채팅 시작 기능  
✅ **반응형 디자인**: 모바일/태블릿/데스크탑 지원  
✅ **접근성**: 키보드 네비게이션 및 ARIA 속성  
✅ **애니메이션**: 부드러운 전환 효과  
✅ **TypeScript**: 완전한 타입 안전성  

이 시스템을 통해 **Instagram과 유사한 완전한 소셜 네트워킹 기능**을 제공할 수 있습니다! 🚀