export interface SubCategory {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  subCategories: SubCategory[];
}

export interface BoardType {
  id: number;
  name: string;
  description: string;
}

export interface Class {
  id: number;
  title: string;
  instructor: {
    id: number;
    name: string;
    avatar: string;
  };
  categoryId: number;
  subCategoryId: number;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  location: string;
  isOnline: boolean;
  isGroup: boolean;
  isOneDay: boolean;
}

export interface Moim {
  id: number;
  title: string;
  leader: {
    id: number;
    name: string;
    avatar: string;
  };
  categoryId: number;
  subCategoryId: number;
  memberCount: number;
  maxMembers: number;
  image: string;
  location: string;
  isRegular: boolean;
  description: string;
}

export interface Post {
  id: number;
  title: string;
  author: {
    id: number;
    name: string;
    avatar: string;
  };
  categoryId: number;
  subCategoryId: number;
  boardTypeId: number;
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  joinDate: string;
  bio: string;
  location: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface ChatRoom {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isGroup: boolean;
  memberCount?: number;
  isOnline?: boolean;
}

export interface Schedule {
  id: number;
  title: string;
  type: 'class' | 'moim' | 'custom';
  date: string;
  location: string;
  image?: string;
  categoryId?: number;
  subCategoryId?: number;
  instructor?: {
    id: number;
    name: string;
    avatar: string;
  };
  leader?: {
    id: number;
    name: string;
    avatar: string;
  };
  description?: string;
  relatedId?: number; // 관련된 class나 moim의 ID
}
