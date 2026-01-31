
export type Language = 'KR' | 'CN';

export enum CategoryType {
  RECRUITMENT = 'RECRUITMENT',
  RESUME = 'RESUME',
  PARTTIME = 'PARTTIME',
  BUSINESS = 'BUSINESS',
  PROMO = 'PROMO',
  REAL_ESTATE = 'REAL_ESTATE',
  COMMUNITY_PHOTO = 'COMMUNITY_PHOTO',
  COMMUNITY_USED = 'COMMUNITY_USED',
  PARTNERSHIP = 'PARTNERSHIP'
}

export interface Comment {
  id: string;
  nickname: string;
  content: string;
  likes: number;
  reportCount: number;
  status: 'active' | 'hidden';
  createdAt: string;
}

export interface InquiryMessage {
  id: string;
  senderName: string;
  message: string;
  createdAt: string;
}

export interface ContentPost {
  id: string;
  type: CategoryType;
  titleKR: string;
  titleCN: string;
  category: string;
  location: string;
  // Specific fields
  salary?: string; 
  price?: string;
  area?: string;
  shopName?: string;
  address?: string;
  openHours?: string;
  tags?: string[];
  dealType?: string;
  estateType?: string;
  floor?: string;
  moveInDate?: string;
  startDate?: string;
  endDate?: string;
  promoType?: string;
  photos?: string[];
  // Common fields
  descriptionKR: string;
  descriptionCN: string;
  phoneNumber: string;
  wechatId?: string;
  isKoreanRequired?: boolean;
  hasDormitory?: boolean;
  createdAt: string;
  expiresAt: string;
  isUrgent: boolean; 
  isPremium: boolean; 
  isAd: boolean; 
  status: 'active' | 'reported' | 'deleted' | 'banned' | 'pending' | 'rejected';
  reportCount: number;
  // Engagement fields
  likes: number;
  dislikes: number;
  views: number;
  comments: Comment[];
  inquiries?: InquiryMessage[];
  premiumUntil?: string;
}

export interface Report {
  id: string;
  postId: string;
  commentId?: string;
  reason: string;
  createdAt: string;
  status: 'open' | 'closed';
}

export interface BlacklistItem {
  id: string;
  type: 'phone' | 'ip';
  value: string;
  reason: string;
  createdAt: string;
  expiresAt?: string;
}

export interface AdCampaign {
  id: string;
  packageId: string;
  type: 'banner' | 'premium' | 'top';
  title: string;
  linkUrl: string;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  isActive: boolean;
  region?: string;
}

export interface AdminStats {
  totalPosts: number;
  newToday: number;
  pendingReports: number;
  activeAds: number;
  adsCtr: number;
}
