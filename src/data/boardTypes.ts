import { BoardType } from '../types/category';

export const boardTypes: BoardType[] = [
  {
    id: 1,
    name: '전체',
    description: '모든 게시글'
  },
  {
    id: 2,
    name: '자유 게시판',
    description: '자유로운 주제의 게시글'
  },
  {
    id: 3,
    name: '질문 & 답변',
    description: 'Q&A 형태의 게시글'
  },
  {
    id: 4,
    name: '모임 홍보',
    description: '모임을 홍보하는 게시글'
  },
  {
    id: 5,
    name: '노하우 & 팁',
    description: '경험과 팁을 공유하는 게시글'
  },
  {
    id: 6,
    name: '작품 & 활동 공유',
    description: '작품이나 활동 결과를 공유하는 게시글'
  }
];
