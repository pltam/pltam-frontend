// 사용자 인터페이스 정의
export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    phone: string;
    bio: string;
    location: string;
    joinDate: string;
    interests: number[];
    isOnline: boolean;
    rating: number;
    reviewCount: number;
    followerCount?: number;
    followingCount?: number;
    lastActiveAt?: string;
    postsCount?: number;
    joinedMoimsCount?: number;
    completedClassesCount?: number;
}

// 팔로우 관계 인터페이스
export interface FollowRelation {
    id: number;
    followerId: number;
    followingId: number;
    createdAt: string;
}

// 회원 데이터
export const mockUser = {
    id: 1,
    name: '홍길동',
    email: 'hong@example.com',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=1',
    phone: '010-1234-5678',
    bio: '안녕하세요! 다양한 취미를 가진 홍길동입니다.',
    location: '서울특별시 강남구',
    joinDate: '2025-01-15',
    interests: [1, 3, 5], // 카테고리 ID
    isOnline: true,
    rating: 4.8,
    reviewCount: 25,
    followerCount: 10, // 실제 팔로워 수 (101,102,103,104,105,106,107,108,301,302)
    followingCount: 8 // 실제 팔로잉 수 (101,102,103,104,105,106,107,108)
};

// 다른 사용자들 데이터
export const mockUsers = [
    {
        id: 101,
        name: '김기타',
        email: 'kim@example.com',
        avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=101',
        phone: '010-2345-6789',
        bio: '기타 강사입니다.',
        location: '서울 강남구',
        joinDate: '2024-12-01',
        interests: [3],
        isOnline: false,
        rating: 4.9,
        reviewCount: 45,
        followerCount: 30,
        followingCount: 12,
        lastActiveAt: '2025-03-10T10:00:00Z',
        postsCount: 15,
        joinedMoimsCount: 3,
        completedClassesCount: 12
    },
    {
        id: 102,
        name: '박요가',
        email: 'park@example.com',
        avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=102',
        phone: '010-3456-7890',
        bio: '요가 강사입니다.',
        location: '서울 마포구',
        joinDate: '2024-11-15',
        interests: [1],
        isOnline: true,
        rating: 4.7,
        reviewCount: 38,
        followerCount: 4, // 실제 팔로워 수 (1,101,103,104)
        followingCount: 3, // 실제 팔로잉 수 (1,101,103,104)
        lastActiveAt: '2025-03-10T14:30:00Z',
        postsCount: 20,
        joinedMoimsCount: 2,
        completedClassesCount: 8
    },
    {
        id: 103,
        name: '이등산',
        email: 'lee@example.com',
        avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=103',
        phone: '010-4567-8901',
        bio: '등산을 좋아합니다.',
        location: '서울 도봉구',
        joinDate: '2024-10-20',
        interests: [1],
        isOnline: true,
        rating: 4.6,
        reviewCount: 20,
        followerCount: 4, // 실제 팔로워 수 (1,102,108,301)
        followingCount: 3, // 실제 팔로잉 수 (1,102,108,301)
        lastActiveAt: '2025-03-10T12:15:00Z',
        postsCount: 25,
        joinedMoimsCount: 5,
        completedClassesCount: 6
    },
    {
        id: 104,
        name: '정독서',
        email: 'jung@example.com',
        avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=104',
        phone: '010-5678-9012',
        bio: '독서 모임을 운영합니다.',
        location: '서울 종로구',
        joinDate: '2024-09-10',
        interests: [8],
        isOnline: false,
        rating: 4.8,
        reviewCount: 15,
        followerCount: 4, // 실제 팔로워 수 (1,102,105,302)
        followingCount: 3, // 실제 팔로잉 수 (1,102,105,302)
        lastActiveAt: '2025-03-09T18:00:00Z',
        postsCount: 18,
        joinedMoimsCount: 1,
        completedClassesCount: 4
    },
    {
        id: 105,
        name: '최사진',
        email: 'choi@example.com',
        avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=105',
        phone: '010-6789-0123',
        bio: '사진 작가입니다.',
        location: '서울 종로구',
        joinDate: '2024-08-05',
        interests: [5],
        isOnline: true,
        rating: 4.9,
        reviewCount: 30,
        followerCount: 4, // 실제 팔로워 수 (1,101,104,106)
        followingCount: 3, // 실제 팔로잉 수 (1,101,104,106)
        lastActiveAt: '2025-03-10T16:45:00Z',
        postsCount: 30,
        joinedMoimsCount: 4,
        completedClassesCount: 10
    },
    {
        id: 106,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=106',
        phone: '010-7890-1234',
        bio: '영어 강사입니다.',
        location: '서울 서초구',
        joinDate: '2024-07-15',
        interests: [7, 9],
        isOnline: false,
        rating: 4.8,
        reviewCount: 42,
        followerCount: 3, // 실제 팔로워 수 (1,105,107)
        followingCount: 2, // 실제 팔로잉 수 (1,105,107)
        lastActiveAt: '2025-03-09T20:30:00Z',
        postsCount: 22,
        joinedMoimsCount: 3,
        completedClassesCount: 7
    },
    // 추가 사용자들 (모임 참여자용)
    {
        id: 107,
        name: '김코딩',
        email: 'kim.coding@example.com',
        avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=107',
        phone: '010-1111-2222',
        bio: '개발자입니다.',
        location: '서울 강남구',
        joinDate: '2024-06-01',
        interests: [9],
        isOnline: true,
        rating: 4.7,
        reviewCount: 25,
        followerCount: 3, // 실제 팔로워 수 (1,106,108)
        followingCount: 2, // 실제 팔로잉 수 (1,106,108)
        lastActiveAt: '2025-03-10T09:00:00Z',
        postsCount: 30,
        joinedMoimsCount: 2,
        completedClassesCount: 5
    },
    {
        id: 108,
        name: '박라이더',
        email: 'park.rider@example.com',
        avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=108',
        phone: '010-2222-3333',
        bio: '자전거를 사랑합니다.',
        location: '서울 한강공원',
        joinDate: '2024-05-15',
        interests: [1],
        isOnline: false,
        rating: 4.5,
        reviewCount: 18,
        followerCount: 4, // 실제 팔로워 수 (1,103,107,101)
        followingCount: 3, // 실제 팔로잉 수 (1,103,107,101)
        lastActiveAt: '2025-03-09T16:30:00Z',
        postsCount: 12,
        joinedMoimsCount: 3,
        completedClassesCount: 2
    },
    // 댓글 작성자들
    {
        id: 301,
        name: '댓글작성자1',
        email: 'comment1@example.com',
        avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=301',
        phone: '010-3001-3001',
        bio: '댓글을 자주 씁니다.',
        location: '서울 마포구',
        joinDate: '2024-01-01',
        interests: [1, 3, 5],
        isOnline: true,
        rating: 4.2,
        reviewCount: 8,
        followerCount: 1, // 실제 팔로워 수 (103)
        followingCount: 2, // 실제 팔로잉 수 (1,103)
        lastActiveAt: '2025-03-10T15:00:00Z',
        postsCount: 5,
        joinedMoimsCount: 1,
        completedClassesCount: 2
    },
    {
        id: 302,
        name: '댓글작성자2',
        email: 'comment2@example.com',
        avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=302',
        phone: '010-3002-3002',
        bio: '활발한 커뮤니티 참여자입니다.',
        location: '서울 송파구',
        joinDate: '2024-02-01',
        interests: [2, 4, 6],
        isOnline: false,
        rating: 4.4,
        reviewCount: 12,
        followerCount: 1, // 실제 팔로워 수 (104)
        followingCount: 2, // 실제 팔로잉 수 (1,104)
        lastActiveAt: '2025-03-09T14:00:00Z',
        postsCount: 8,
        joinedMoimsCount: 2,
        completedClassesCount: 3
    }
];

// 수업 데이터
export const mockClasses = [
    {
        id: 1,
        title: '초보자를 위한 기타 클래스',
        categoryId: 3,
        subCategoryId: 302,
        instructor: {
            id: 101,
            name: '김기타',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=101'
        },
        location: '서울 강남구',
        image: 'https://img.heroui.chat/image/music?w=600&h=400&u=1',
        price: 50000,
        rating: 4.8,
        reviewCount: 32,
        duration: 60,
        description: '기타를 처음 시작하는 분들을 위한 기초 수업입니다.',
        isOnline: false,
        isGroup: true,
        isOneDay: false
    },
    {
        id: 2,
        title: '주말 요가 클래스',
        categoryId: 1,
        subCategoryId: 110,
        instructor: {
            id: 102,
            name: '박요가',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=102'
        },
        location: '서울 마포구',
        image: 'https://img.heroui.chat/image/sports?w=600&h=400&u=2',
        price: 40000,
        rating: 4.9,
        reviewCount: 45,
        duration: 90,
        description: '주말에 몸과 마음을 편안하게 만들어주는 요가 수업입니다.',
        isOnline: false,
        isGroup: true,
        isOneDay: false
    },
    {
        id: 3,
        title: 'DSLR 사진 촬영 기초',
        categoryId: 5,
        subCategoryId: 501,
        instructor: {
            id: 105,
            name: '최사진',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=105'
        },
        location: '서울 종로구',
        image: 'https://img.heroui.chat/image/landscape?w=600&h=400&u=5',
        price: 80000,
        rating: 4.7,
        reviewCount: 18,
        duration: 120,
        description: 'DSLR 카메라로 멋진 사진을 찍는 방법을 배워보세요.',
        isOnline: false,
        isGroup: true,
        isOneDay: true
    },
    {
        id: 4,
        title: '온라인 영어회화',
        categoryId: 9,
        subCategoryId: 901,
        instructor: {
            id: 106,
            name: 'Sarah Johnson',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=106'
        },
        location: '온라인',
        image: 'https://img.heroui.chat/image/education?w=600&h=400&u=6',
        price: 60000,
        rating: 4.8,
        reviewCount: 28,
        duration: 60,
        description: '원어민과 함께하는 실전 영어회화 수업입니다.',
        isOnline: true,
        isGroup: true,
        isOneDay: false
    },
    {
        id: 5,
        title: '드럼 중급 클래스',
        categoryId: 3,
        subCategoryId: 303,
        instructor: {
            id: 107,
            name: '김드럼',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=107'
        },
        location: '서울 홍대',
        image: 'https://img.heroui.chat/image/music?w=600&h=400&u=7',
        price: 70000,
        rating: 4.6,
        reviewCount: 22,
        duration: 90,
        description: '드럼의 기본기를 마스터한 분들을 위한 중급 수업입니다.',
        isOnline: false,
        isGroup: true,
        isOneDay: false
    },
    {
        id: 6,
        title: '필라테스 초급반',
        categoryId: 1,
        subCategoryId: 110,
        instructor: {
            id: 108,
            name: '이필라',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=108'
        },
        location: '서울 강남구',
        image: 'https://img.heroui.chat/image/sports?w=600&h=400&u=8',
        price: 45000,
        rating: 4.9,
        reviewCount: 35,
        duration: 60,
        description: '몸의 균형과 자세 교정을 위한 필라테스 수업입니다.',
        isOnline: false,
        isGroup: true,
        isOneDay: false
    }
];

// 모임 데이터
export const mockMoims = [
    {
        id: 1,
        title: '주말 등산 모임',
        categoryId: 1,
        subCategoryId: 101,
        leader: {
            id: 103,
            name: '이등산',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=103'
        },
        location: '서울 도봉구',
        image: 'https://img.heroui.chat/image/nature?w=600&h=400&u=1',
        memberCount: 15,
        maxMembers: 20,
        description: '주말마다 서울 근교의 산을 함께 등산하는 모임입니다.',
        isOnline: false,
        isRegular: true
    },
    {
        id: 2,
        title: '독서 토론 모임',
        categoryId: 8,
        subCategoryId: 801,
        leader: {
            id: 104,
            name: '정독서',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=104'
        },
        location: '서울 종로구',
        image: 'https://img.heroui.chat/image/books?w=600&h=400&u=2',
        memberCount: 8,
        maxMembers: 12,
        description: '매월 한 권의 책을 선정하여 함께 읽고 토론하는 모임입니다.',
        isOnline: false,
        isRegular: true
    },
    {
        id: 3,
        title: '코딩 스터디 그룹',
        categoryId: 9,
        subCategoryId: 903,
        leader: {
            id: 107,
            name: '김코딩',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=107'
        },
        location: '온라인',
        image: 'https://img.heroui.chat/image/tech?w=600&h=400&u=3',
        memberCount: 12,
        maxMembers: 15,
        description: '함께 코딩 문제를 풀고 프로젝트를 진행하는 온라인 스터디 그룹입니다.',
        isOnline: true,
        isRegular: true
    },
    {
        id: 4,
        title: '주말 자전거 라이딩',
        categoryId: 1,
        subCategoryId: 103,
        leader: {
            id: 108,
            name: '박라이더',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=108'
        },
        location: '서울 한강공원',
        image: 'https://img.heroui.chat/image/sports?w=600&h=400&u=4',
        memberCount: 18,
        maxMembers: 25,
        description: '주말마다 한강을 따라 자전거를 타는 모임입니다.',
        isOnline: false,
        isRegular: true
    },
    {
        id: 5,
        title: '사진 동호회',
        categoryId: 5,
        subCategoryId: 501,
        leader: {
            id: 105,
            name: '최사진',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=105'
        },
        location: '서울 전역',
        image: 'https://img.heroui.chat/image/landscape?w=600&h=400&u=5',
        memberCount: 10,
        maxMembers: 15,
        description: '서울의 아름다운 장소를 찾아다니며 사진을 찍는 모임입니다.',
        isOnline: false,
        isRegular: true
    },
    {
        id: 6,
        title: '요리 스터디',
        categoryId: 2,
        subCategoryId: 201,
        leader: {
            id: 109,
            name: '박요리',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=109'
        },
        location: '서울 마포구',
        image: 'https://img.heroui.chat/image/food?w=600&h=400&u=6',
        memberCount: 6,
        maxMembers: 8,
        description: '매주 새로운 요리를 배우고 함께 만들어 먹는 모임입니다.',
        isOnline: false,
        isRegular: true
    }
];

// 게시글 데이터
export const mockPosts = [
    {
        id: 1,
        title: '등산 초보자를 위한 팁',
        content: '등산을 처음 시작하는 분들을 위한 유용한 팁을 공유합니다...',
        author: {
            id: 103,
            name: '이등산',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=103'
        },
        categoryId: 1,
        subCategoryId: 101,
        boardTypeId: 1,
        createdAt: '2025-03-10T09:00:00Z',
        updatedAt: '2025-03-10T09:00:00Z',
        viewCount: 120,
        likeCount: 15,
        commentCount: 8,
        images: ['https://img.heroui.chat/image/nature?w=800&h=600&u=11']
    },
    {
        id: 2,
        title: '기타 연습 방법',
        content: '기타를 효과적으로 연습하는 방법을 알려드립니다...',
        author: {
            id: 101,
            name: '김기타',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=101'
        },
        categoryId: 3,
        subCategoryId: 302,
        boardTypeId: 2,
        createdAt: '2025-03-09T14:30:00Z',
        updatedAt: '2025-03-09T14:30:00Z',
        viewCount: 85,
        likeCount: 12,
        commentCount: 5,
        images: ['https://img.heroui.chat/image/music?w=800&h=600&u=12']
    },
    {
        id: 3,
        title: '이번 주 독서 모임 공지',
        content: '이번 주 독서 모임에서는 "사피엔스"를 토론할 예정입니다...',
        author: {
            id: 104,
            name: '정독서',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=104'
        },
        categoryId: 8,
        subCategoryId: 801,
        boardTypeId: 1,
        createdAt: '2025-03-08T18:15:00Z',
        updatedAt: '2025-03-08T18:15:00Z',
        viewCount: 42,
        likeCount: 8,
        commentCount: 3,
        images: []
    }
];

// 일정 데이터
export const mockSchedules = [
    // 같은 날짜에 여러 일정을 추가 (6월 15일)
    {
        id: 1,
        title: '북한산 등산',
        description: '북한산 등산로를 따라 정상까지 등산합니다.',
        startTime: '2025-06-15T08:00:00Z',
        endTime: '2025-06-15T16:00:00Z',
        location: '서울 도봉구 북한산',
        organizer: {
            id: 103,
            name: '이등산',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=103'
        },
        moimId: 1,
        attendees: 12,
        maxAttendees: 15,
        isOnline: false,
        type: 'moim' as const,
        date: '2025-06-15',
        instructor: {
            id: 103,
            name: '이등산',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=103'
        },
        image: 'https://img.heroui.chat/image/nature?w=600&h=400&u=1',
        leader: {
            id: 103,
            name: '이등산',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=103'
        },
        categoryId: 1
    },
    {
        id: 7,
        title: '초급 요가 클래스',
        description: '요가 기초 자세를 배우는 수업입니다.',
        startTime: '2025-06-15T10:00:00Z',
        endTime: '2025-06-15T11:30:00Z',
        location: '서울 마포구 요가스튜디오',
        organizer: {
            id: 102,
            name: '박요가',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=102'
        },
        classId: 2,
        attendees: 8,
        maxAttendees: 12,
        isOnline: false,
        type: 'class' as const,
        date: '2025-06-15',
        instructor: {
            id: 102,
            name: '박요가',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=102'
        },
        image: 'https://img.heroui.chat/image/sports?w=600&h=400&u=2',
        leader: {
            id: 102,
            name: '박요가',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=102'
        },
        categoryId: 1
    },
    {
        id: 8,
        title: '기타 초급반',
        description: '기타 연주의 기초를 배워보세요.',
        startTime: '2025-06-15T14:00:00Z',
        endTime: '2025-06-15T16:00:00Z',
        location: '서울 강남구 음악교실',
        organizer: {
            id: 101,
            name: '김기타',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=101'
        },
        classId: 1,
        attendees: 6,
        maxAttendees: 10,
        isOnline: false,
        type: 'class' as const,
        date: '2025-06-15',
        instructor: {
            id: 101,
            name: '김기타',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=101'
        },
        image: 'https://img.heroui.chat/image/music?w=600&h=400&u=1',
        leader: {
            id: 101,
            name: '김기타',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=101'
        },
        categoryId: 3
    },
    {
        id: 9,
        title: '사진 촬영 워크숍',
        description: '야외 사진 촬영 실습을 진행합니다.',
        startTime: '2025-06-15T18:00:00Z',
        endTime: '2025-06-15T20:00:00Z',
        location: '서울 종로구 경복궁',
        organizer: {
            id: 105,
            name: '최사진',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=105'
        },
        classId: 3,
        attendees: 5,
        maxAttendees: 8,
        isOnline: false,
        type: 'class' as const,
        date: '2025-06-15',
        instructor: {
            id: 105,
            name: '최사진',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=105'
        },
        image: 'https://img.heroui.chat/image/landscape?w=600&h=400&u=5',
        leader: {
            id: 105,
            name: '최사진',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=105'
        },
        categoryId: 5
    },
    {
        id: 10,
        title: '코딩 스터디',
        description: '알고리즘 문제 해결 스터디입니다.',
        startTime: '2025-06-15T19:30:00Z',
        endTime: '2025-06-15T21:30:00Z',
        location: '온라인',
        organizer: {
            id: 107,
            name: '김코딩',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=107'
        },
        moimId: 3,
        attendees: 10,
        maxAttendees: 15,
        isOnline: true,
        type: 'moim' as const,
        date: '2025-06-15',
        instructor: {
            id: 107,
            name: '김코딩',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=107'
        },
        image: 'https://img.heroui.chat/image/tech?w=600&h=400&u=3',
        leader: {
            id: 107,
            name: '김코딩',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=107'
        },
        categoryId: 9
    },
    {
        id: 2,
        title: '독서 토론 모임',
        description: '이번 달 선정 도서 "사피엔스"에 대한 토론을 진행합니다.',
        startTime: '2025-06-20T19:00:00Z',
        endTime: '2025-06-20T21:00:00Z',
        location: '서울 종로구 북카페',
        organizer: {
            id: 104,
            name: '정독서',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=104'
        },
        moimId: 2,
        attendees: 8,
        maxAttendees: 12,
        isOnline: false,
        type: 'moim' as const,
        date: '2025-06-20',
        instructor: {
            id: 104,
            name: '정독서',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=104'
        },
        image: 'https://img.heroui.chat/image/books?w=600&h=400&u=2',
        leader: {
            id: 104,
            name: '정독서',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=104'
        },
        categoryId: 8
    },
    // 6월 20일에 추가 일정들
    {
        id: 11,
        title: '영어 회화 클래스',
        description: '원어민과 함께하는 영어 대화 수업입니다.',
        startTime: '2025-06-20T18:00:00Z',
        endTime: '2025-06-20T19:00:00Z',
        location: '온라인',
        organizer: {
            id: 106,
            name: 'Sarah Johnson',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=106'
        },
        classId: 4,
        attendees: 6,
        maxAttendees: 10,
        isOnline: true,
        type: 'class' as const,
        date: '2025-06-20',
        instructor: {
            id: 106,
            name: 'Sarah Johnson',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=106'
        },
        image: 'https://img.heroui.chat/image/education?w=600&h=400&u=6',
        leader: {
            id: 106,
            name: 'Sarah Johnson',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=106'
        },
        categoryId: 9
    },
    {
        id: 12,
        title: '자전거 라이딩',
        description: '한강에서 자전거를 타며 운동해요.',
        startTime: '2025-06-20T16:00:00Z',
        endTime: '2025-06-20T18:00:00Z',
        location: '서울 한강공원',
        organizer: {
            id: 108,
            name: '박라이더',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=108'
        },
        moimId: 4,
        attendees: 15,
        maxAttendees: 20,
        isOnline: false,
        type: 'moim' as const,
        date: '2025-06-20',
        instructor: {
            id: 108,
            name: '박라이더',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=108'
        },
        image: 'https://img.heroui.chat/image/sports?w=600&h=400&u=4',
        leader: {
            id: 108,
            name: '박라이더',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=108'
        },
        categoryId: 1
    },
    {
        id: 3,
        title: '초보자를 위한 기타 클래스',
        description: '기타를 처음 시작하는 분들을 위한 기초 수업입니다.',
        startTime: '2025-06-18T20:00:00Z',
        endTime: '2025-06-18T22:00:00Z',
        location: '서울 강남구',
        organizer: {
            id: 101,
            name: '김기타',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=101'
        },
        classId: 1,
        attendees: 10,
        maxAttendees: 15,
        isOnline: false,
        type: 'class' as const,
        date: '2025-06-18',
        instructor: {
            id: 101,
            name: '김기타',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=101'
        },
        image: 'https://img.heroui.chat/image/music?w=600&h=400&u=1',
        leader: {
            id: 101,
            name: '김기타',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=101'
        },
        categoryId: 3
    },
    {
        id: 4,
        title: '주말 요가 클래스',
        description: '주말에 몸과 마음을 편안하게 만들어주는 요가 수업입니다.',
        startTime: '2025-06-22T10:00:00Z',
        endTime: '2025-06-22T11:30:00Z',
        location: '서울 마포구',
        organizer: {
            id: 102,
            name: '박요가',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=102'
        },
        classId: 2,
        attendees: 8,
        maxAttendees: 12,
        isOnline: false,
        type: 'class' as const,
        date: '2025-06-22',
        instructor: {
            id: 102,
            name: '박요가',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=102'
        },
        image: 'https://img.heroui.chat/image/sports?w=600&h=400&u=2',
        leader: {
            id: 102,
            name: '박요가',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=102'
        },
        categoryId: 1
    },
    // 과거 일정들
    {
        id: 5,
        title: '지난 등산 모임',
        description: '관악산 등산을 다녀왔습니다.',
        startTime: '2025-05-10T08:00:00Z',
        endTime: '2025-05-10T16:00:00Z',
        location: '서울 관악구 관악산',
        organizer: {
            id: 103,
            name: '이등산',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=103'
        },
        moimId: 1,
        attendees: 15,
        maxAttendees: 15,
        isOnline: false,
        type: 'moim' as const,
        date: '2025-05-10',
        instructor: {
            id: 103,
            name: '이등산',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=103'
        },
        image: 'https://img.heroui.chat/image/nature?w=600&h=400&u=1',
        leader: {
            id: 103,
            name: '이등산',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=103'
        },
        categoryId: 1
    },
    {
        id: 6,
        title: '4월 독서 토론회',
        description: '지난 달 "1984" 도서 토론을 마쳤습니다.',
        startTime: '2025-04-25T19:00:00Z',
        endTime: '2025-04-25T21:00:00Z',
        location: '서울 종로구 북카페',
        organizer: {
            id: 104,
            name: '정독서',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=104'
        },
        moimId: 2,
        attendees: 8,
        maxAttendees: 12,
        isOnline: false,
        type: 'moim' as const,
        date: '2025-04-25',
        instructor: {
            id: 104,
            name: '정독서',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=104'
        },
        image: 'https://img.heroui.chat/image/books?w=600&h=400&u=2',
        leader: {
            id: 104,
            name: '정독서',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=104'
        },
        categoryId: 8
    }
];

// 카테고리 데이터
export const mockCategories = [
    { id: 1, name: '스포츠/레저', icon: 'sports' },
    { id: 2, name: '요리/음식', icon: 'restaurant' },
    { id: 3, name: '음악/악기', icon: 'music_note' },
    { id: 4, name: '미술/공예', icon: 'palette' },
    { id: 5, name: '사진/영상', icon: 'camera_alt' },
    { id: 6, name: '여행/탐방', icon: 'flight' },
    { id: 7, name: '언어/외국어', icon: 'translate' },
    { id: 8, name: '독서/글쓰기', icon: 'book' },
    { id: 9, name: 'IT/프로그래밍', icon: 'code' },
    { id: 10, name: '금융/투자', icon: 'attach_money' }
];

// 서브 카테고리 데이터
export const mockSubCategories = [
    // 스포츠/레저
    { id: 101, categoryId: 1, name: '등산' },
    { id: 102, categoryId: 1, name: '러닝' },
    { id: 103, categoryId: 1, name: '자전거' },
    { id: 104, categoryId: 1, name: '수영' },
    { id: 105, categoryId: 1, name: '테니스' },
    { id: 106, categoryId: 1, name: '골프' },
    { id: 107, categoryId: 1, name: '볼링' },
    { id: 108, categoryId: 1, name: '배드민턴' },
    { id: 109, categoryId: 1, name: '축구/풋살' },
    { id: 110, categoryId: 1, name: '요가/필라테스' },

    // 요리/음식
    { id: 201, categoryId: 2, name: '한식' },
    { id: 202, categoryId: 2, name: '양식' },
    { id: 203, categoryId: 2, name: '일식' },
    { id: 204, categoryId: 2, name: '중식' },
    { id: 205, categoryId: 2, name: '베이킹' },
    { id: 206, categoryId: 2, name: '디저트' },
    { id: 207, categoryId: 2, name: '커피/차' },
    { id: 208, categoryId: 2, name: '와인/칵테일' },

    // 음악/악기
    { id: 301, categoryId: 3, name: '피아노' },
    { id: 302, categoryId: 3, name: '기타' },
    { id: 303, categoryId: 3, name: '드럼' },
    { id: 304, categoryId: 3, name: '바이올린' },
    { id: 305, categoryId: 3, name: '우쿨렐레' },
    { id: 306, categoryId: 3, name: '보컬' },
    { id: 307, categoryId: 3, name: '작곡' },

    // 미술/공예
    { id: 401, categoryId: 4, name: '그림' },
    { id: 402, categoryId: 4, name: '도예' },
    { id: 403, categoryId: 4, name: '캘리그라피' },
    { id: 404, categoryId: 4, name: '뜨개질/자수' },
    { id: 405, categoryId: 4, name: '가죽공예' },
    { id: 406, categoryId: 4, name: '목공' },

    // 사진/영상
    { id: 501, categoryId: 5, name: '사진촬영' },
    { id: 502, categoryId: 5, name: '영상촬영' },
    { id: 503, categoryId: 5, name: '사진편집' },
    { id: 504, categoryId: 5, name: '영상편집' },

    // 여행/탐방
    { id: 601, categoryId: 6, name: '국내여행' },
    { id: 602, categoryId: 6, name: '해외여행' },
    { id: 603, categoryId: 6, name: '백패킹' },
    { id: 604, categoryId: 6, name: '캠핑' },
    { id: 605, categoryId: 6, name: '맛집탐방' },
    { id: 606, categoryId: 6, name: '카페탐방' },

    // 언어/외국어
    { id: 701, categoryId: 7, name: '영어' },
    { id: 702, categoryId: 7, name: '일본어' },
    { id: 703, categoryId: 7, name: '중국어' },
    { id: 704, categoryId: 7, name: '프랑스어' },
    { id: 705, categoryId: 7, name: '스페인어' },
    { id: 706, categoryId: 7, name: '독일어' },

    // 독서/글쓰기
    { id: 801, categoryId: 8, name: '독서토론' },
    { id: 802, categoryId: 8, name: '소설쓰기' },
    { id: 803, categoryId: 8, name: '시쓰기' },
    { id: 804, categoryId: 8, name: '에세이' },

    // IT/프로그래밍
    { id: 901, categoryId: 9, name: '웹개발' },
    { id: 902, categoryId: 9, name: '앱개발' },
    { id: 903, categoryId: 9, name: '알고리즘' },
    { id: 904, categoryId: 9, name: '데이터분석' },
    { id: 905, categoryId: 9, name: 'AI/머신러닝' },

    // 금융/투자
    { id: 1001, categoryId: 10, name: '주식' },
    { id: 1002, categoryId: 10, name: '부동산' },
    { id: 1003, categoryId: 10, name: '가상화폐' },
    { id: 1004, categoryId: 10, name: '재테크' }
];

// 댓글 데이터
export const mockComments = [
    {
        id: 1,
        postId: 1,
        author: {
            id: 1,
            name: '홍길동',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=1'
        },
        content: '정말 유용한 정보 감사합니다!',
        createdAt: '2025-03-10T10:15:00Z',
        likeCount: 3
    },
    {
        id: 2,
        postId: 1,
        author: {
            id: 104,
            name: '정독서',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=104'
        },
        content: '저도 등산을 시작하려고 했는데 좋은 정보네요.',
        createdAt: '2025-03-10T11:30:00Z',
        likeCount: 2
    },
    {
        id: 3,
        postId: 2,
        author: {
            id: 1,
            name: '홍길동',
            avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=1'
        },
        content: '기타 연습 방법 잘 보고 갑니다.',
        createdAt: '2025-03-09T15:45:00Z',
        likeCount: 1
    }
];

// 팔로우 관계 데이터
export interface FollowRelation {
    id: number;
    followerId: number;
    followingId: number;
    createdAt: string;
}

export const mockFollowRelations: FollowRelation[] = [
    // 홍길동(1)의 팔로잉 관계
    {
        id: 1,
        followerId: 1, // 홍길동이
        followingId: 101, // 김기타를 팔로우
        createdAt: '2025-02-01T10:00:00Z'
    },
    {
        id: 2,
        followerId: 1, // 홍길동이
        followingId: 102, // 박요가를 팔로우
        createdAt: '2025-02-02T11:00:00Z'
    },
    {
        id: 3,
        followerId: 1, // 홍길동이
        followingId: 103, // 이등산을 팔로우
        createdAt: '2025-02-03T12:00:00Z'
    },
    {
        id: 4,
        followerId: 1, // 홍길동이
        followingId: 105, // 최사진을 팔로우
        createdAt: '2025-02-04T13:00:00Z'
    },
    {
        id: 5,
        followerId: 1, // 홍길동이
        followingId: 106, // Sarah Johnson을 팔로우
        createdAt: '2025-02-05T14:00:00Z'
    },
    {
        id: 6,
        followerId: 1, // 홍길동이
        followingId: 107, // 김코딩을 팔로우
        createdAt: '2025-02-06T15:00:00Z'
    },
    {
        id: 7,
        followerId: 1, // 홍길동이
        followingId: 108, // 박라이더를 팔로우
        createdAt: '2025-02-07T16:00:00Z'
    },
    {
        id: 8,
        followerId: 1, // 홍길동이
        followingId: 104, // 정독서를 팔로우
        createdAt: '2025-02-08T17:00:00Z'
    },

    // 홍길동(1)을 팔로우하는 사람들
    {
        id: 9,
        followerId: 101, // 김기타가
        followingId: 1, // 홍길동을 팔로우
        createdAt: '2025-02-09T10:00:00Z'
    },
    {
        id: 10,
        followerId: 102, // 박요가가
        followingId: 1, // 홍길동을 팔로우
        createdAt: '2025-02-10T11:00:00Z'
    },
    {
        id: 11,
        followerId: 103, // 이등산이
        followingId: 1, // 홍길동을 팔로우
        createdAt: '2025-02-11T12:00:00Z'
    },
    {
        id: 12,
        followerId: 104, // 정독서가
        followingId: 1, // 홍길동을 팔로우
        createdAt: '2025-02-12T13:00:00Z'
    },
    {
        id: 13,
        followerId: 105, // 최사진이
        followingId: 1, // 홍길동을 팔로우
        createdAt: '2025-02-13T14:00:00Z'
    },
    {
        id: 14,
        followerId: 106, // Sarah Johnson이
        followingId: 1, // 홍길동을 팔로우
        createdAt: '2025-02-14T15:00:00Z'
    },
    {
        id: 15,
        followerId: 107, // 김코딩이
        followingId: 1, // 홍길동을 팔로우
        createdAt: '2025-02-15T16:00:00Z'
    },
    {
        id: 16,
        followerId: 108, // 박라이더가
        followingId: 1, // 홍길동을 팔로우
        createdAt: '2025-02-16T17:00:00Z'
    },
    {
        id: 17,
        followerId: 301, // 댓글작성자1이
        followingId: 1, // 홍길동을 팔로우
        createdAt: '2025-02-17T18:00:00Z'
    },
    {
        id: 18,
        followerId: 302, // 댓글작성자2가
        followingId: 1, // 홍길동을 팔로우
        createdAt: '2025-02-18T19:00:00Z'
    },

    // 다른 사용자들 간의 팔로우 관계
    {
        id: 19,
        followerId: 101, // 김기타가
        followingId: 102, // 박요가를 팔로우
        createdAt: '2025-02-19T10:00:00Z'
    },
    {
        id: 20,
        followerId: 101, // 김기타가
        followingId: 105, // 최사진을 팔로우
        createdAt: '2025-02-20T11:00:00Z'
    },
    {
        id: 21,
        followerId: 102, // 박요가가
        followingId: 103, // 이등산을 팔로우
        createdAt: '2025-02-21T12:00:00Z'
    },
    {
        id: 22,
        followerId: 102, // 박요가가
        followingId: 104, // 정독서를 팔로우
        createdAt: '2025-02-22T13:00:00Z'
    },
    {
        id: 23,
        followerId: 103, // 이등산이
        followingId: 108, // 박라이더를 팔로우
        createdAt: '2025-02-23T14:00:00Z'
    },
    {
        id: 24,
        followerId: 104, // 정독서가
        followingId: 105, // 최사진을 팔로우
        createdAt: '2025-02-24T15:00:00Z'
    },
    {
        id: 25,
        followerId: 105, // 최사진이
        followingId: 106, // Sarah Johnson을 팔로우
        createdAt: '2025-02-25T16:00:00Z'
    },
    {
        id: 26,
        followerId: 106, // Sarah Johnson이
        followingId: 107, // 김코딩을 팔로우
        createdAt: '2025-02-26T17:00:00Z'
    },
    {
        id: 27,
        followerId: 107, // 김코딩이
        followingId: 108, // 박라이더를 팔로우
        createdAt: '2025-02-27T18:00:00Z'
    },
    {
        id: 28,
        followerId: 108, // 박라이더가
        followingId: 101, // 김기타를 팔로우
        createdAt: '2025-02-28T19:00:00Z'
    },

    // 역방향 관계들 (상호 팔로우)
    {
        id: 29,
        followerId: 102, // 박요가가
        followingId: 101, // 김기타를 팔로우
        createdAt: '2025-03-01T10:00:00Z'
    },
    {
        id: 30,
        followerId: 105, // 최사진이
        followingId: 101, // 김기타를 팔로우
        createdAt: '2025-03-02T11:00:00Z'
    },
    {
        id: 31,
        followerId: 103, // 이등산이
        followingId: 102, // 박요가를 팔로우
        createdAt: '2025-03-03T12:00:00Z'
    },
    {
        id: 32,
        followerId: 104, // 정독서가
        followingId: 102, // 박요가를 팔로우
        createdAt: '2025-03-04T13:00:00Z'
    },
    {
        id: 33,
        followerId: 108, // 박라이더가
        followingId: 103, // 이등산을 팔로우
        createdAt: '2025-03-05T14:00:00Z'
    },
    {
        id: 34,
        followerId: 105, // 최사진이
        followingId: 104, // 정독서를 팔로우
        createdAt: '2025-03-06T15:00:00Z'
    },
    {
        id: 35,
        followerId: 106, // Sarah Johnson이
        followingId: 105, // 최사진을 팔로우
        createdAt: '2025-03-07T16:00:00Z'
    },
    {
        id: 36,
        followerId: 107, // 김코딩이
        followingId: 106, // Sarah Johnson을 팔로우
        createdAt: '2025-03-08T17:00:00Z'
    },
    {
        id: 37,
        followerId: 108, // 박라이더가
        followingId: 107, // 김코딩을 팔로우
        createdAt: '2025-03-09T18:00:00Z'
    },
    {  
        id: 38,
        followerId: 101, // 김기타가
        followingId: 108, // 박라이더를 팔로우
        createdAt: '2025-03-10T19:00:00Z'
    },

    // 댓글 작성자들의 팔로우 관계
    {
        id: 39,
        followerId: 301, // 댓글작성자1이
        followingId: 103, // 이등산을 팔로우
        createdAt: '2025-03-11T10:00:00Z'
    },
    {
        id: 40,
        followerId: 302, // 댓글작성자2가
        followingId: 104, // 정독서를 팔로우
        createdAt: '2025-03-12T11:00:00Z'
    },
    {
        id: 41,
        followerId: 103, // 이등산이
        followingId: 301, // 댓글작성자1을 팔로우
        createdAt: '2025-03-13T12:00:00Z'
    },
    {
        id: 42,
        followerId: 104, // 정독서가
        followingId: 302, // 댓글작성자2를 팔로우
        createdAt: '2025-03-14T13:00:00Z'
    }
];

// 헬퍼 함수들
export const getUserById = (id: number): User | null => {
    if (id === 1) return mockUser;

    // mockUsers에서 먼저 찾기
    const foundUser = mockUsers.find(user => user.id === id);
    if (foundUser) return foundUser;

    // 모임 리더나 수업 강사 등에서 사용된 사용자 정보 찾기 (부분 정보만 있는 경우)
    const instructors = mockClasses.map(cls => cls.instructor);
    const leaders = mockMoims.map(moim => moim.leader);
    const authors = mockPosts.map(post => post.author);
    const organizers = mockSchedules.map(schedule => schedule.organizer);

    const allPartialUsers = [...instructors, ...leaders, ...authors, ...organizers];
    const partialUser = allPartialUsers.find(user => user.id === id);
    
    if (partialUser) {
        // 부분 정보를 완전한 User 타입으로 변환
        return {
            id: partialUser.id,
            name: partialUser.name,
            avatar: partialUser.avatar,
            email: `user${partialUser.id}@example.com`,
            phone: `010-${String(partialUser.id).padStart(4, '0')}-5678`,
            bio: `${partialUser.name}입니다.`,
            location: '서울특별시',
            joinDate: '2024-01-01',
            interests: [],
            isOnline: Math.random() > 0.5,
            rating: 4.5,
            reviewCount: 10,
            followerCount: Math.floor(Math.random() * 50),
            followingCount: Math.floor(Math.random() * 30)
        };
    }

    return null;
};

export const getClassById = (id: number) => {
    return mockClasses.find(cls => cls.id === id);
};

export const getMoimById = (id: number) => {
    return mockMoims.find(moim => moim.id === id);
};

export const getPostById = (id: number) => {
    return mockPosts.find(post => post.id === id);
};

export const getScheduleById = (id: number) => {
    return mockSchedules.find(schedule => schedule.id === id);
};

export const getCategoryById = (id: number) => {
    return mockCategories.find(category => category.id === id);
};

export const getSubCategoryById = (id: number) => {
    return mockSubCategories.find(subCategory => subCategory.id === id);
};

export const getSubCategoriesByCategoryId = (categoryId: number) => {
    return mockSubCategories.filter(subCategory => subCategory.categoryId === categoryId);
};

export const getCommentsByPostId = (postId: number) => {
    return mockComments.filter(comment => comment.postId === postId);
};

export const getFollowers = (userId: number) => {
    const followerIds = mockFollowRelations
        .filter(rel => rel.followingId === userId)
        .map(rel => rel.followerId);

    return followerIds.map(id => getUserById(id)).filter(user => user !== null);
};

export const getFollowing = (userId: number) => {
    const followingIds = mockFollowRelations
        .filter(rel => rel.followerId === userId)
        .map(rel => rel.followingId);

    return followingIds.map(id => getUserById(id)).filter(user => user !== null);
};

export const isFollowing = (followerId: number, followingId: number): boolean => {
    return mockFollowRelations.some(rel =>
        rel.followerId === followerId && rel.followingId === followingId
    );
};

export const toggleFollow = (followerId: number, followingId: number): boolean => {
    const existingRelation = mockFollowRelations.find(rel =>
        rel.followerId === followerId && rel.followingId === followingId
    );

    if (existingRelation) {
        // 언팔로우
        const index = mockFollowRelations.indexOf(existingRelation);
        mockFollowRelations.splice(index, 1);

        // 사용자 팔로우 카운트 업데이트 (감소)
        const follower = getUserById(followerId);
        const following = getUserById(followingId);
        if (follower) follower.followingCount = (follower.followingCount || 0) - 1;
        if (following) following.followerCount = (following.followerCount || 0) - 1;

        return false;
    } else {
        // 팔로우
        const newRelation: FollowRelation = {
            id: Date.now(),
            followerId,
            followingId,
            createdAt: new Date().toISOString()
        };
        mockFollowRelations.push(newRelation);

        // 사용자 팔로우 카운트 업데이트 (증가)
        const follower = getUserById(followerId);
        const following = getUserById(followingId);
        if (follower) follower.followingCount = (follower.followingCount || 0) + 1;
        if (following) following.followerCount = (following.followerCount || 0) + 1;

        return true;
    }
};

// 사용자 게시글 가져오기
export const getUserPosts = (userId: number, limit: number = 10) => {
    return mockPosts
        .filter(post => post.author.id === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
};

// 사용자 참여 모임 가져오기
export const getUserMoims = (userId: number, limit: number = 12) => {
    // 실제로는 별도의 참여 관계 테이블이 있어야 하지만, 간단히 구현
    const userMoims = [];

    // 모임장으로 있는 모임들
    const leadMoims = mockMoims.filter(moim => moim.leader.id === userId);
    userMoims.push(...leadMoims);

    // 임시로 몇 개 모임에 참여하고 있다고 가정
    if (userId === 1) { // 현재 사용자
        userMoims.push(...mockMoims.filter(moim => [1, 2, 3].includes(moim.id)));
    }

    return userMoims.slice(0, limit);
};

// 사용자 참여 수업 가져오기
export const getUserClasses = (userId: number, limit: number = 12) => {
    // 실제로는 별도의 수강 관계 테이블이 있어야 하지만, 간단히 구현
    const userClasses = [];

    // 강사로 있는 수업들
    const instructorClasses = mockClasses.filter(cls => cls.instructor.id === userId);
    userClasses.push(...instructorClasses);

    // 임시로 몇 개 수업을 수강하고 있다고 가정
    if (userId === 1) { // 현재 사용자
        userClasses.push(...mockClasses.filter(cls => [1, 2, 4].includes(cls.id)));
    }

    return userClasses.slice(0, limit);
};

// 연결된 데이터를 포함한 헬퍼 함수들
export const getClassWithInstructor = (id: number) => {
    const classData = getClassById(id);
    if (!classData) return null;
    return classData; // instructor는 이미 포함되어 있음
};

export const getMoimWithLeader = (id: number) => {
    const moimData = getMoimById(id);
    if (!moimData) return null;
    return moimData; // leader는 이미 포함되어 있음
};

export const getPostWithAuthor = (id: number) => {
    const postData = getPostById(id);
    if (!postData) return null;
    return postData; // author는 이미 포함되어 있음
};

export const getScheduleWithDetails = (id: number) => {
    const scheduleData = getScheduleById(id);
    if (!scheduleData) return null;
    return scheduleData; // 관련 데이터는 이미 포함되어 있음
};

// 채팅방 데이터
export const mockChatRooms = [
    // 1:1 채팅방
    {
        id: 'user1',
        name: '김철수',
        lastMessage: '언제 시간 되실 때 만나서 이야기해요',
        unreadCount: 1,
        avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=101',
        isGroup: false,
        userId: 101,
        timestamp: '14:32',
        isOnline: true,
        memberCount: 2
    },
    {
        id: 'user2',
        name: '이영희',
        lastMessage: 'What time do you want to change?',
        unreadCount: 0,
        avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=102',
        isGroup: false,
        userId: 102,
        timestamp: '11:50',
        isOnline: false,
        memberCount: 2
    },
    {
        id: 'user3',
        name: '박민수',
        lastMessage: '혹시 질문이 있으시면 언제든 연락주세요',
        unreadCount: 2,
        avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=103',
        isGroup: false,
        userId: 103,
        timestamp: '09:40',
        isOnline: true,
        memberCount: 2
    },
    // 모임 채팅방
    {
        id: 'moim1',
        name: '주말 등산 모임',
        lastMessage: '시청역 1번 출구 어떨까요?',
        unreadCount: 0,
        avatar: 'https://img.heroui.chat/image/nature?w=200&h=200&u=1',
        isGroup: true,
        timestamp: '19:02',
        isOnline: true,
        memberCount: 3,
        participants: [
            {
                id: 1,
                name: '홍길동',
                avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=1',
                isOnline: true,
                role: 'member' as const
            },
            {
                id: 104,
                name: '이민수',
                avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=104',
                isOnline: false,
                role: 'admin' as const
            },
            {
                id: 105,
                name: '박지영',
                avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=105',
                isOnline: true,
                role: 'member' as const
            }
        ]
    },
    {
        id: 'moim2',
        name: '코딩 스터디 그룹',
        lastMessage: '자료구조와 관련된 문제를 풀어볼 예정입니다',
        unreadCount: 3,
        avatar: 'https://img.heroui.chat/image/tech?w=200&h=200&u=3',
        isGroup: true,
        timestamp: '14:31',
        isOnline: true,
        memberCount: 2,
        participants: [
            {
                id: 1,
                name: '홍길동',
                avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=1',
                isOnline: true,
                role: 'member' as const
            },
            {
                id: 107,
                name: '김코더',
                avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=106',
                isOnline: true,
                role: 'admin' as const
            }
        ]
    },
    {
        id: 'moim3',
        name: '북한산 등산 모임',
        lastMessage: '좋은 생각이에요! 날씨도 확인해보세요',
        unreadCount: 0,
        avatar: 'https://img.heroui.chat/image/nature?w=200&h=200&u=2',
        isGroup: true,
        timestamp: '08:10',
        isOnline: false,
        memberCount: 3,
        participants: [
            {
                id: 1,
                name: '홍길동',
                avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=1',
                isOnline: true,
                role: 'member' as const
            },
            {
                id: 103,
                name: '산악인',
                avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=107',
                isOnline: false,
                role: 'admin' as const
            },
            {
                id: 108,
                name: '등반러버',
                avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=108',
                isOnline: true,
                role: 'member' as const
            }
        ]
    }
];

// 메인페이지용 데이터 (각 페이지 데이터에서 가져옴)
export const getHomePageData = () => {
    return {
        featuredClasses: mockClasses.slice(0, 4).map(cls => getClassWithInstructor(cls.id)),
        featuredMoims: mockMoims.slice(0, 4).map(moim => getMoimWithLeader(moim.id)),
        recentPosts: mockPosts.slice(0, 3).map(post => getPostWithAuthor(post.id))
    };
};
