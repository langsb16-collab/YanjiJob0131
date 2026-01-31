
import React from 'react';
// Changed JobPost to ContentPost to match exported types from ../types
import { ContentPost, Language, CategoryType } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  // Updated Prop type to ContentPost
  post: ContentPost;
  lang: Language;
  // Updated callback parameter type to ContentPost
  onOpenChat: (post: ContentPost) => void;
  onReport?: (postId: string) => void;
}

const JobCard: React.FC<Props> = ({ post, lang, onOpenChat, onReport }) => {
  const t = TRANSLATIONS[lang];
  const title = lang === 'KR' ? post.titleKR : post.titleCN;
  const description = lang === 'KR' ? post.descriptionKR : post.descriptionCN;

  const getThemeStyles = () => {
    if (post.isPremium) return 'border-emerald-500 bg-emerald-50/20 shadow-emerald-100 shadow-md';
    if (post.isUrgent) return 'border-red-400 bg-red-50/30';
    if (post.isAd) return 'border-yellow-400 bg-yellow-50/30';
    return 'border-gray-200 hover:border-yellow-400';
  };

  const getCategoryColor = () => {
    if (post.type === CategoryType.PARTTIME) return 'bg-orange-500';
    if (post.type === CategoryType.RESUME) return 'bg-blue-500';
    return 'bg-emerald-600';
  };

  return (
    <div className={`group relative bg-white rounded-[24px] border-2 p-6 mb-4 transition-all duration-300 ${getThemeStyles()}`}>
      {/* Premium Badge Overlay */}
      {post.isPremium && (
        <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-lg z-10 animate-bounce">
          {t.premium.toUpperCase()}
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2 items-center flex-wrap">
          {post.isUrgent && (
            <span className="text-[10px] px-2 py-1 rounded-lg bg-red-600 text-white font-black uppercase tracking-tighter">
              {t.urgent}
            </span>
          )}
          <span className={`text-[10px] px-2.5 py-1 rounded-lg text-white font-black uppercase tracking-wide ${getCategoryColor()}`}>
            {post.category}
          </span>
          {post.isKoreanRequired && (
            <span className="text-[10px] px-2 py-1 rounded-lg bg-yellow-100 text-yellow-800 font-black">
              KR PASS
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onReport?.(post.id)}
            className="text-[10px] text-gray-300 hover:text-red-500 transition-colors font-bold uppercase tracking-widest"
          >
            {t.report}
          </button>
          <span className="text-[11px] text-gray-300 font-bold">{post.createdAt}</span>
        </div>
      </div>
      
      <div className="flex gap-5">
        <div className="hidden sm:flex w-16 h-16 bg-gray-50 rounded-2xl items-center justify-center text-2xl shrink-0 shadow-inner group-hover:bg-white group-hover:shadow-md transition-all">
          {post.category.substring(0, 1)}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors leading-tight line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-4 mb-4 text-sm font-bold text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="opacity-50">📍</span> {post.location}
            </span>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <span className="text-emerald-600 flex items-center gap-1.5">
              <span className="opacity-50">💰</span> {post.salary}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed font-medium">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
        <button 
          onClick={() => window.location.href = `tel:${post.phoneNumber}`}
          className="flex-1 bg-gray-900 text-white py-4 rounded-2xl text-sm font-black hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
        >
          <span>📞</span> {t.phone}
        </button>
        <button 
          onClick={() => onOpenChat(post)}
          className="flex-1 bg-yellow-400 text-black py-4 rounded-2xl text-sm font-black hover:bg-yellow-500 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-100"
        >
          <span>💬</span> {t.chat}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
