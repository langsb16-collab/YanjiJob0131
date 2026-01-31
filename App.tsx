
import React, { useState, useEffect, useMemo } from 'react';
import { Briefcase, UserCheck, Clock, Building2, Megaphone, Home, Image, ShoppingBag, Handshake } from 'lucide-react';
import { Language, CategoryType, ContentPost, Report, AdCampaign, BlacklistItem, Comment, InquiryMessage } from './types';
import { TRANSLATIONS, LOCATIONS, BANNED_WORDS } from './constants';
import LanguageSelector from './components/LanguageSelector';
import ContentCard from './components/ContentCard';
import ContentForm from './components/ContentForm';
import ChatInterface from './components/ChatInterface';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language | null>(null);
  const [activeTab, setActiveTab] = useState<CategoryType>(CategoryType.RECRUITMENT);
  const [showForm, setShowForm] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [selectedChatPost, setSelectedChatPost] = useState<ContentPost | null>(null);
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [ads, setAds] = useState<AdCampaign[]>([]);
  const [blacklist, setBlacklist] = useState<BlacklistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('yj_hub_all_posts_v4');
    const savedBlacklist = localStorage.getItem('yj_hub_blacklist');
    if (saved) setPosts(JSON.parse(saved));
    if (savedBlacklist) setBlacklist(JSON.parse(savedBlacklist));
    
    if (!saved) {
      const samplePosts: ContentPost[] = [
        // 구인 샘플
        { id: 'r1', type: CategoryType.RECRUITMENT, titleKR: '카페 직원 모집 (월 260만)', titleCN: '咖啡店招聘 (月260万)', category: '카페', location: '연길 (延吉)', descriptionKR: '주 5일, 9시-18시', descriptionCN: '周5天, 9-18点', phoneNumber: '138-1111-1111', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-03-31', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 5, dislikes: 0, views: 50, comments: [] },
        { id: 'r2', type: CategoryType.RECRUITMENT, titleKR: '물류센터 단기 근무자 구함', titleCN: '物流中心短期工', category: '물류', location: '훈춘 (珲春)', descriptionKR: '체력 좋으신 분', descriptionCN: '体力好', phoneNumber: '138-1111-2222', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-02-28', isUrgent: true, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 8, dislikes: 0, views: 120, comments: [] },
        { id: 'r3', type: CategoryType.RECRUITMENT, titleKR: '식당 주방보조 급구', titleCN: '餐厅厨房助理急招', category: '식당', location: '연길 (延吉)', descriptionKR: '경력 무관', descriptionCN: '无经验要求', phoneNumber: '138-1111-3333', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-03-15', isUrgent: true, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 3, dislikes: 0, views: 80, comments: [] },
        
        // 구직 샘플
        { id: 'j1', type: CategoryType.RESUME, titleKR: '웹디자이너 경력 5년 구직중', titleCN: 'Web设计师5年经验求职', category: '디자인', location: '연길 (延吉)', descriptionKR: 'Figma, Photoshop 능숙', descriptionCN: '熟练Figma, Photoshop', phoneNumber: '138-2222-1111', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-04-30', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 12, dislikes: 0, views: 200, comments: [] },
        { id: 'j2', type: CategoryType.RESUME, titleKR: '운전기사 일자리 찾습니다', titleCN: '司机求职', category: '운전', location: '도문 (图们)', descriptionKR: '1종 보통, 무사고 10년', descriptionCN: '1类驾照, 10年无事故', phoneNumber: '138-2222-2222', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-03-31', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 6, dislikes: 0, views: 90, comments: [] },
        { id: 'j3', type: CategoryType.RESUME, titleKR: '사무직 취업 희망', titleCN: '求职办公室工作', category: '사무', location: '연길 (延吉)', descriptionKR: 'Excel, 한중 번역 가능', descriptionCN: 'Excel, 韩中翻译', phoneNumber: '138-2222-3333', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-04-15', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 9, dislikes: 0, views: 150, comments: [] },
        
        // 알바 샘플
        { id: 'p1', type: CategoryType.PARTTIME, titleKR: '편의점 야간 알바 구함', titleCN: '便利店夜班兼职', category: '편의점', location: '연길 (延吉)', descriptionKR: '주 3일, 22시-06시', descriptionCN: '周3天, 22-06点', phoneNumber: '138-3333-1111', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-03-20', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 7, dislikes: 0, views: 110, comments: [] },
        { id: 'p2', type: CategoryType.PARTTIME, titleKR: '행사 스태프 모집', titleCN: '活动工作人员招聘', category: '행사', location: '연길 (延吉)', descriptionKR: '주말만, 일당 15만원', descriptionCN: '仅周末, 日薪15万', phoneNumber: '138-3333-2222', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-02-28', isUrgent: true, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 15, dislikes: 0, views: 250, comments: [] },
        { id: 'p3', type: CategoryType.PARTTIME, titleKR: '카페 주말 알바', titleCN: '咖啡店周末兼职', category: '카페', location: '연길 (延吉)', descriptionKR: '토일 10-18시', descriptionCN: '周六日 10-18点', phoneNumber: '138-3333-3333', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-03-31', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 11, dislikes: 0, views: 180, comments: [] },
        
        // 비즈니스 샘플 (기존 + 2개 추가)
        { id: 's1', type: CategoryType.BUSINESS, titleKR: '연길 서시장 인근 정통 한식당 [연길맛집]', titleCN: '延吉西市场附近正宗韩餐 [延吉美食]', shopName: '연길맛집', category: '식당·카페', location: '연길 (延吉)', descriptionKR: '30년 전통의 맛을 자랑합니다. 단체석 완비.', descriptionCN: '30年传统美味。提供团体席。', phoneNumber: '138-0000-1111', createdAt: new Date().toLocaleDateString(), expiresAt: '2025-12-31', isUrgent: false, isPremium: true, isAd: false, status: 'active', reportCount: 0, likes: 42, dislikes: 1, views: 1205, comments: [] },
        { id: 'b2', type: CategoryType.BUSINESS, titleKR: '온라인 쇼핑몰 공동 운영자 모집', titleCN: '在线商城合伙人招募', shopName: '글로벌샵', category: '온라인', location: '연길 (延吉)', descriptionKR: '의류 전문, 수익 배분', descriptionCN: '服装专业, 利润分成', phoneNumber: '138-4444-2222', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-04-30', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 18, dislikes: 0, views: 300, comments: [] },
        { id: 'b3', type: CategoryType.BUSINESS, titleKR: '소자본 창업 파트너 찾습니다', titleCN: '小资本创业合伙人', shopName: '스타트업', category: '창업', location: '연길 (延吉)', descriptionKR: '배달 전문점 오픈 예정', descriptionCN: '外卖专门店开业', phoneNumber: '138-4444-3333', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-03-31', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 22, dislikes: 0, views: 400, comments: [] },
        
        // 홍보/광고 샘플
        { id: 'pr1', type: CategoryType.PROMO, titleKR: 'SNS 마케팅 대행', titleCN: 'SNS营销代理', category: '마케팅', location: '연길 (延吉)', descriptionKR: '인스타/틱톡 전문', descriptionCN: 'Instagram/TikTok专业', phoneNumber: '138-5555-1111', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-06-30', isUrgent: false, isPremium: true, isAd: true, status: 'active', reportCount: 0, likes: 30, dislikes: 2, views: 500, comments: [] },
        { id: 'pr2', type: CategoryType.PROMO, titleKR: '전단지 배포 광고', titleCN: '传单分发广告', category: '광고', location: '연길 (延吉)', descriptionKR: '효과적인 오프라인 홍보', descriptionCN: '有效的线下推广', phoneNumber: '138-5555-2222', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-05-31', isUrgent: false, isPremium: false, isAd: true, status: 'active', reportCount: 0, likes: 8, dislikes: 1, views: 150, comments: [] },
        { id: 'pr3', type: CategoryType.PROMO, titleKR: '지역 상권 광고 진행', titleCN: '地区商圈广告', category: '상권', location: '연길 (延吉)', descriptionKR: '맞춤형 광고 솔루션', descriptionCN: '定制广告方案', phoneNumber: '138-5555-3333', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-07-31', isUrgent: false, isPremium: false, isAd: true, status: 'active', reportCount: 0, likes: 14, dislikes: 0, views: 220, comments: [] },
        
        // 부동산 샘플
        { id: 're1', type: CategoryType.REAL_ESTATE, titleKR: '연길 시내 원룸 임대', titleCN: '延吉市内单间出租', category: '원룸', location: '연길 (延吉)', descriptionKR: '월세 80만원, 풀옵션', descriptionCN: '月租80万, 全配', phoneNumber: '138-6666-1111', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-04-30', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 25, dislikes: 0, views: 600, comments: [] },
        { id: 're2', type: CategoryType.REAL_ESTATE, titleKR: '상가 점포 매매', titleCN: '商铺店面买卖', category: '상가', location: '연길 (延吉)', descriptionKR: '1층 50평, 역세권', descriptionCN: '1楼50坪, 地铁站', phoneNumber: '138-6666-2222', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-06-30', isUrgent: false, isPremium: true, isAd: false, status: 'active', reportCount: 0, likes: 35, dislikes: 0, views: 800, comments: [] },
        { id: 're3', type: CategoryType.REAL_ESTATE, titleKR: '아파트 전세', titleCN: '公寓全租', category: '아파트', location: '연길 (延吉)', descriptionKR: '33평 3룸, 주차 가능', descriptionCN: '33坪3室, 可停车', phoneNumber: '138-6666-3333', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-05-31', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 40, dislikes: 0, views: 950, comments: [] },
        
        // 사진 자랑 샘플
        { id: 'ph1', type: CategoryType.COMMUNITY_PHOTO, titleKR: '연길 야경 촬영', titleCN: '延吉夜景摄影', category: '풍경', location: '연길 (延吉)', descriptionKR: '아름다운 야경 공유', descriptionCN: '美丽夜景分享', phoneNumber: '138-7777-1111', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-12-31', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 50, dislikes: 0, views: 1200, comments: [] },
        { id: 'ph2', type: CategoryType.COMMUNITY_PHOTO, titleKR: '가족 여행 사진', titleCN: '家庭旅行照片', category: '여행', location: '백두산', descriptionKR: '백두산 여행 기록', descriptionCN: '长白山旅行记录', phoneNumber: '138-7777-2222', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-12-31', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 65, dislikes: 0, views: 1500, comments: [] },
        { id: 'ph3', type: CategoryType.COMMUNITY_PHOTO, titleKR: '자연 풍경 작품', titleCN: '自然风景作品', category: '자연', location: '두만강', descriptionKR: '두만강변 풍경', descriptionCN: '图们江边风景', phoneNumber: '138-7777-3333', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-12-31', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 72, dislikes: 0, views: 1800, comments: [] },
        
        // 중고 거래 샘플
        { id: 'u1', type: CategoryType.COMMUNITY_USED, titleKR: '아이폰 중고 판매', titleCN: 'iPhone二手出售', category: '전자기기', location: '연길 (延吉)', descriptionKR: '아이폰 13, 배터리 95%', descriptionCN: 'iPhone 13, 电池95%', phoneNumber: '138-8888-1111', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-03-31', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 20, dislikes: 0, views: 400, comments: [] },
        { id: 'u2', type: CategoryType.COMMUNITY_USED, titleKR: '중고 자전거 팝니다', titleCN: '二手自行车出售', category: '자전거', location: '연길 (延吉)', descriptionKR: '거의 새것, 5만원', descriptionCN: '几乎全新, 5万', phoneNumber: '138-8888-2222', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-02-28', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 10, dislikes: 0, views: 150, comments: [] },
        { id: 'u3', type: CategoryType.COMMUNITY_USED, titleKR: '전자렌지 저렴히', titleCN: '微波炉低价', category: '가전', location: '연길 (延吉)', descriptionKR: '2년 사용, 3만원', descriptionCN: '使用2年, 3万', phoneNumber: '138-8888-3333', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-03-15', isUrgent: true, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 8, dislikes: 0, views: 120, comments: [] },
        
        // 동업 & 제휴 샘플
        { id: 'pa1', type: CategoryType.PARTNERSHIP, titleKR: '카페 동업자 모집', titleCN: '咖啡店合伙人招募', category: '카페', location: '연길 (延吉)', descriptionKR: '초기 투자 5천만원', descriptionCN: '初始投资5千万', phoneNumber: '138-9999-1111', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-04-30', isUrgent: false, isPremium: false, isAd: false, status: 'active', reportCount: 0, likes: 28, dislikes: 0, views: 550, comments: [] },
        { id: 'pa2', type: CategoryType.PARTNERSHIP, titleKR: '식품 유통 제휴 제안', titleCN: '食品流通合作提案', category: '유통', location: '연길 (延吉)', descriptionKR: '수입 식품 유통망 보유', descriptionCN: '拥有进口食品渠道', phoneNumber: '138-9999-2222', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-05-31', isUrgent: false, isPremium: false, isAd: false, status: 'pending', reportCount: 0, likes: 32, dislikes: 0, views: 620, comments: [] },
        { id: 'pa3', type: CategoryType.PARTNERSHIP, titleKR: '공동 브랜드 런칭', titleCN: '共同品牌推出', category: '브랜드', location: '연길 (延吉)', descriptionKR: '패션 브랜드 런칭 계획', descriptionCN: '时尚品牌推出计划', phoneNumber: '138-9999-3333', createdAt: new Date().toLocaleDateString(), expiresAt: '2026-06-30', isUrgent: false, isPremium: true, isAd: false, status: 'pending', reportCount: 0, likes: 45, dislikes: 0, views: 750, comments: [] }
      ];
      setPosts(samplePosts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('yj_hub_all_posts_v4', JSON.stringify(posts));
    localStorage.setItem('yj_hub_blacklist', JSON.stringify(blacklist));
  }, [posts, blacklist]);

  const t = lang ? TRANSLATIONS[lang] : TRANSLATIONS.KR;

  const checkBannedWords = (text: string) => {
    return BANNED_WORDS.some(word => text.toLowerCase().includes(word.toLowerCase()));
  };

  const isUserBlocked = (phone?: string) => {
    return blacklist.some(item => item.value === phone);
  };

  const handleAddPost = (post: ContentPost) => {
    if (isUserBlocked(post.phoneNumber)) {
      alert(t.blockedUserError);
      return;
    }
    if (checkBannedWords(post.titleKR) || checkBannedWords(post.descriptionKR)) {
      alert(t.bannedWordError);
      return;
    }

    if (post.type === CategoryType.PARTNERSHIP) {
      post.status = 'pending';
      alert(t.pendingApproval);
    }

    setPosts([post, ...posts]);
    setShowForm(false);
  };

  const handleAddComment = (postId: string, nickname: string, content: string) => {
    if (checkBannedWords(content)) {
      alert(t.bannedWordError);
      return;
    }

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      nickname,
      content,
      likes: 0,
      reportCount: 0,
      status: 'active',
      createdAt: new Date().toLocaleDateString()
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [newComment, ...p.comments].sort((a, b) => b.likes - a.likes) };
      }
      return p;
    }));
  };

  const handleCommentLike = (postId: string, commentId: string) => {
    const key = `comment_liked_${commentId}`;
    if (localStorage.getItem(key)) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: p.comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c)
            .sort((a, b) => b.likes - a.likes)
        };
      }
      return p;
    }));
    localStorage.setItem(key, 'true');
  };

  const handleReportPost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newCount = p.reportCount + 1;
        return {
          ...p,
          reportCount: newCount,
          status: newCount >= 5 ? 'banned' : p.status
        };
      }
      return p;
    }));
    alert(lang === 'KR' ? '신고되었습니다.' : '已举报。');
  };

  const handleReportComment = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: p.comments.map(c => {
            if (c.id === commentId) {
              const newReportCount = c.reportCount + 1;
              return { ...c, reportCount: newReportCount, status: newReportCount >= 3 ? 'hidden' : c.status };
            }
            return c;
          })
        };
      }
      return p;
    }));
    alert(lang === 'KR' ? '댓글이 신고되었습니다.' : '评论已举报。');
  };

  const handleReact = (postId: string, type: 'like' | 'dislike') => {
    const key = `reacted_${postId}_${type}`;
    if (localStorage.getItem(key)) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: type === 'like' ? p.likes + 1 : p.likes,
          dislikes: type === 'dislike' ? p.dislikes + 1 : p.dislikes
        };
      }
      return p;
    }));
    localStorage.setItem(key, 'true');
  };

  const handleAddInquiry = (postId: string, senderName: string, message: string) => {
    if (checkBannedWords(message)) {
      alert(t.bannedWordError);
      return;
    }

    const newInquiry: InquiryMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderName,
      message,
      createdAt: new Date().toLocaleDateString()
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, inquiries: [...(p.inquiries || []), newInquiry] };
      }
      return p;
    }));
    alert(t.inquirySuccess);
  };

  const incrementView = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, views: p.views + 1 } : p));
  };

  const handleApprovePartnership = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'active' } : p));
  };

  const handleRejectPartnership = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
  };

  const handleSetPremium = (id: string, days: number) => {
    const until = new Date();
    until.setDate(until.getDate() + days);
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isPremium: true, premiumUntil: until.toLocaleDateString() } : p));
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesTab = post.type === activeTab;
      const matchesSearch = 
        post.titleKR.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.titleCN.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.shopName && post.shopName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesRegion = !filterRegion || post.location === filterRegion;
      
      const isVisible = (isAdminLoggedIn && isAdminMode) 
        ? true 
        : (post.status === 'active');

      return matchesTab && matchesSearch && matchesRegion && isVisible;
    }).sort((a, b) => {
      // Premium posts first
      if (a.isPremium !== b.isPremium) return a.isPremium ? -1 : 1;
      // Then by date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [posts, activeTab, searchQuery, filterRegion, isAdminMode, isAdminLoggedIn]);

  if (!lang) return <LanguageSelector onSelect={setLang} />;

  if (isAdminMode && isAdminLoggedIn) {
    return (
      <AdminDashboard 
        posts={posts} reports={reports} ads={ads} blacklist={blacklist} lang={lang} 
        onClose={() => setIsAdminMode(false)}
        onDeletePost={id => setPosts(posts.filter(p => p.id !== id))}
        onToggleStatus={(id, field) => setPosts(posts.map(p => p.id === id ? {...p, [field]: !p[field]} : p))}
        onApprovePartnership={handleApprovePartnership}
        onRejectPartnership={handleRejectPartnership}
        onSetPremium={handleSetPremium}
        onAddBlacklist={(val, reason) => setBlacklist([...blacklist, { id: Math.random().toString(), type: 'phone', value: val, reason, createdAt: new Date().toLocaleDateString() }])}
        onDeleteComment={(postId, commentId) => {
          setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p));
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col items-center">
      <div className="w-full bg-[#111827] text-white py-1.5 text-center text-[10px] font-semibold uppercase tracking-widest relative z-[70]">
        {lang === 'KR' ? '🌏 Yanji Lifestyle Portal • No Login' : '🌏 延吉生活门户 • 免登录'}
        <button onClick={() => setIsAdminMode(true)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity">⚙️</button>
      </div>

      <div className="w-full max-w-2xl bg-white min-h-screen shadow-2xl relative flex flex-col pb-24">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
          <div className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab(CategoryType.RECRUITMENT)}>
              <div className="w-8 h-8 bg-[#111827] rounded-[12px] flex items-center justify-center font-bold text-white text-base">Y</div>
              <div>
                <h1 className="text-[20px] font-bold text-[#111827] tracking-tight leading-none" style={{letterSpacing: '-0.03em'}}>{t.appTitle}</h1>
              </div>
            </div>
            <button onClick={() => setLang(lang === 'KR' ? 'CN' : 'KR')} className="text-[10px] font-semibold px-3 py-1.5 border-2 border-[#111827] rounded-full hover:bg-[#111827] hover:text-white transition-all uppercase">
              {lang === 'KR' ? 'CN' : 'KR'}
            </button>
          </div>
          
          <nav className="grid grid-cols-2 gap-2 px-3 pb-3 md:flex md:flex-wrap md:gap-2 md:px-5 md:pb-4">
            {[
              { id: CategoryType.RECRUITMENT, label: t.recruitment, icon: Briefcase },
              { id: CategoryType.RESUME, label: t.resume, icon: UserCheck },
              { id: CategoryType.PARTTIME, label: t.parttime, icon: Clock },
              { id: CategoryType.BUSINESS, label: t.business, icon: Building2 },
              { id: CategoryType.PROMO, label: t.promo, icon: Megaphone },
              { id: CategoryType.REAL_ESTATE, label: t.realEstate, icon: Home },
              { id: CategoryType.COMMUNITY_PHOTO, label: t.communityPhoto, icon: Image },
              { id: CategoryType.COMMUNITY_USED, label: t.communityUsed, icon: ShoppingBag },
              { id: CategoryType.PARTNERSHIP, label: t.partnership, icon: Handshake },
            ].map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setActiveTab(cat.id)}
                className={`flex flex-col items-center justify-center gap-1 rounded-[14px] text-[15px] font-semibold h-[48px] md:h-[40px] md:px-4 transition-all ${
                  activeTab === cat.id ? 'bg-[#111827] text-white shadow-md' : 'bg-white border border-[#e5e7eb] text-[#6b7280] hover:border-[#2563eb] hover:text-[#111827]'
                }`}
                style={{letterSpacing: '-0.02em'}}
              >
                <cat.icon size={20} strokeWidth={1.8} />
                <span className="text-[13px] md:text-[15px]">{cat.label}</span>
              </button>
            ))}
          </nav>
        </header>

        <main className="flex-1 p-4 space-y-4">
           <div className="space-y-3">
            <div className="relative">
              <input className="w-full bg-white border border-[#e5e7eb] p-4 pl-12 rounded-[24px] outline-none focus:ring-2 focus:ring-[#2563eb] text-[14px] font-normal shadow-sm" placeholder={t.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg opacity-30">🔍</span>
            </div>
            <select className="bg-white border border-[#e5e7eb] px-5 py-2.5 rounded-full text-[12px] font-medium outline-none appearance-none shadow-sm cursor-pointer" onChange={e => setFilterRegion(e.target.value)}>
              <option value="">{t.filterRegion} ({t.all})</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-6 flex items-start gap-4 shadow-sm mb-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-2xl shadow-inner">🛡️</div>
            <div>
              <p className="text-[13px] text-[#111827] font-semibold mb-0.5">{t.safetyNotice}</p>
              <p className="text-[12px] text-[#6b7280] font-normal leading-relaxed">{t.noLoginInfo}</p>
            </div>
          </div>

          <div className="pb-10">
            {filteredPosts.map(post => (
              <ContentCard 
                key={post.id} 
                post={post} 
                lang={lang} 
                onOpenChat={setSelectedChatPost} 
                onReport={handleReportPost}
                onReact={handleReact}
                onAddComment={handleAddComment}
                onLikeComment={handleCommentLike}
                onReportComment={handleReportComment}
                onAddInquiry={handleAddInquiry}
                onView={() => incrementView(post.id)}
              />
            ))}
            {filteredPosts.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="text-6xl mb-4 grayscale opacity-10">🏗️</div>
                <p className="text-gray-300 font-black text-lg tracking-tighter">No contents available</p>
                <button onClick={() => setShowForm(true)} className="mt-3 text-yellow-500 font-black text-sm hover:underline">Post the first one!</button>
              </div>
            )}
          </div>
        </main>

        <button 
          onClick={() => setShowForm(true)}
          className="fixed bottom-8 right-1/2 translate-x-[110px] sm:translate-x-[260px] w-16 h-16 bg-[#111827] text-white rounded-[24px] shadow-2xl flex items-center justify-center text-3xl font-light hover:scale-110 hover:bg-[#1f2937] active:scale-95 transition-all z-[60] border-4 border-white"
        >
          +
        </button>

        {showForm && (
          <ContentForm 
            type={activeTab} 
            lang={lang} 
            onClose={() => setShowForm(false)} 
            onSubmit={handleAddPost} 
          />
        )}
        {selectedChatPost && (
          <ChatInterface post={selectedChatPost} lang={lang} onClose={() => setSelectedChatPost(null)} />
        )}
      </div>
    </div>
  );
};

export default App;
