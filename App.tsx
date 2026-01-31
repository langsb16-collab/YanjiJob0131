
import React, { useState, useEffect, useMemo } from 'react';
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
      setPosts([
        {
          id: 's1',
          type: CategoryType.BUSINESS,
          titleKR: '연길 서시장 인근 정통 한식당 [연길맛집]',
          titleCN: '延吉西市场附近正宗韩餐 [延吉美食]',
          shopName: '연길맛집',
          category: '식당·카페',
          location: '연길 (延吉)',
          descriptionKR: '30년 전통의 맛을 자랑합니다. 단체석 완비.',
          descriptionCN: '30年传统美味。提供团体席。',
          phoneNumber: '138-0000-1111',
          createdAt: new Date().toLocaleDateString(),
          expiresAt: '2025-12-31',
          isUrgent: false,
          isPremium: true,
          isAd: false,
          status: 'active',
          reportCount: 0,
          likes: 42,
          dislikes: 1,
          views: 1205,
          comments: []
        }
      ]);
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
    <div className="min-h-screen bg-[#F4F7FE] flex flex-col items-center font-sans">
      <div className="w-full bg-black text-white py-1.5 text-center text-[10px] font-black uppercase tracking-widest relative z-[70]">
        {lang === 'KR' ? '🌏 Yanji Lifestyle Portal • No Login' : '🌏 延吉生活门户 • 免登录'}
        <button onClick={() => setIsAdminMode(true)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity">⚙️</button>
      </div>

      <div className="w-full max-w-2xl bg-white min-h-screen shadow-2xl relative flex flex-col pb-24">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
          <div className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab(CategoryType.RECRUITMENT)}>
              <div className="w-8 h-8 bg-gray-900 rounded-[12px] flex items-center justify-center font-black text-white text-base">Y</div>
              <div>
                <h1 className="text-lg font-black text-gray-900 tracking-tighter leading-none">{t.appTitle}</h1>
              </div>
            </div>
            <button onClick={() => setLang(lang === 'KR' ? 'CN' : 'KR')} className="text-[10px] font-black px-3 py-1.5 border-2 border-gray-900 rounded-full hover:bg-black hover:text-white transition-all uppercase">
              {lang === 'KR' ? 'CN' : 'KR'}
            </button>
          </div>
          
          <nav className="grid grid-cols-2 gap-2 px-3 pb-3 md:flex md:flex-wrap md:gap-2 md:px-5 md:pb-4">
            {[
              { id: CategoryType.RECRUITMENT, label: t.recruitment },
              { id: CategoryType.RESUME, label: t.resume },
              { id: CategoryType.PARTTIME, label: t.parttime },
              { id: CategoryType.BUSINESS, label: t.business },
              { id: CategoryType.PROMO, label: t.promo },
              { id: CategoryType.REAL_ESTATE, label: t.realEstate },
              { id: CategoryType.COMMUNITY_PHOTO, label: t.communityPhoto },
              { id: CategoryType.COMMUNITY_USED, label: t.communityUsed },
              { id: CategoryType.PARTNERSHIP, label: t.partnership },
            ].map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center justify-center rounded-xl text-[13px] font-bold h-[48px] md:h-[36px] md:px-4 transition-all ${
                  activeTab === cat.id ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-50 text-gray-400 hover:text-gray-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="flex-1 p-4 space-y-4">
           <div className="space-y-3">
            <div className="relative">
              <input className="w-full bg-gray-50 border-none p-4 pl-12 rounded-[24px] outline-none focus:ring-2 focus:ring-yellow-400 font-bold shadow-sm" placeholder={t.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg opacity-30">🔍</span>
            </div>
            <select className="bg-gray-50 px-5 py-2.5 rounded-full text-[11px] font-black border-none outline-none appearance-none shadow-sm cursor-pointer" onChange={e => setFilterRegion(e.target.value)}>
              <option value="">{t.filterRegion} ({t.all})</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 flex items-start gap-4 shadow-sm mb-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-2xl shadow-inner">🛡️</div>
            <div>
              <p className="text-xs text-gray-900 font-black mb-0.5">{t.safetyNotice}</p>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{t.noLoginInfo}</p>
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
          className="fixed bottom-8 right-1/2 translate-x-[110px] sm:translate-x-[260px] w-16 h-16 bg-gray-900 text-white rounded-[24px] shadow-2xl flex items-center justify-center text-3xl font-light hover:scale-110 active:scale-95 transition-all z-[60] border-4 border-white"
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
