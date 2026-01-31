
import React, { useState, useEffect } from 'react';
import { ContentPost, Language, CategoryType, Comment, InquiryMessage } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  post: ContentPost;
  lang: Language;
  onOpenChat: (post: ContentPost) => void;
  onReport?: (postId: string) => void;
  onReact: (postId: string, type: 'like' | 'dislike') => void;
  onAddComment: (postId: string, nickname: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onReportComment: (postId: string, commentId: string) => void;
  onAddInquiry?: (postId: string, name: string, message: string) => void;
  onView?: () => void;
}

const ContentCard: React.FC<Props> = ({ 
  post, lang, onOpenChat, onReport, onReact, onAddComment, onLikeComment, onReportComment, onAddInquiry, onView 
}) => {
  const t = TRANSLATIONS[lang];
  const [showComments, setShowComments] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [commentNickname, setCommentNickname] = useState('');
  const [commentText, setCommentText] = useState('');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryText, setInquiryText] = useState('');

  useEffect(() => {
    // Basic impression tracking
    onView?.();
  }, []);

  const title = lang === 'KR' ? post.titleKR : post.titleCN;
  const description = lang === 'KR' ? post.descriptionKR : post.descriptionCN;

  const isPending = post.status === 'pending';
  const isRejected = post.status === 'rejected';

  const getCategoryTheme = () => {
    switch(post.type) {
      case CategoryType.BUSINESS: return 'bg-purple-600';
      case CategoryType.REAL_ESTATE: return 'bg-blue-600';
      case CategoryType.PARTNERSHIP: return 'bg-indigo-600';
      case CategoryType.COMMUNITY_PHOTO: return 'bg-teal-500';
      case CategoryType.COMMUNITY_USED: return 'bg-rose-500';
      default: return 'bg-emerald-600';
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentNickname || (lang === 'KR' ? '익명' : '匿名'), commentText);
    setCommentText('');
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;
    onAddInquiry?.(post.id, inquiryName || (lang === 'KR' ? '익명' : '匿名'), inquiryText);
    setInquiryText('');
    setShowInquiryForm(false);
  };

  return (
    <div className={`group relative bg-white rounded-[32px] border-2 p-6 mb-3 transition-all duration-500 ${isPending || isRejected ? 'opacity-50 grayscale' : 'border-gray-100 hover:border-yellow-400'}`}>
      {isPending && <div className="absolute inset-0 z-10 flex items-center justify-center font-black text-gray-500 uppercase tracking-widest bg-white/60 backdrop-blur-[2px] rounded-[32px]">{t.pendingApproval}</div>}
      {isRejected && <div className="absolute inset-0 z-10 flex items-center justify-center font-black text-red-500 uppercase tracking-widest bg-white/60 backdrop-blur-[2px] rounded-[32px]">Rejected</div>}
      
      <div className="flex justify-between items-start mb-5">
        <div className="flex gap-2 items-center flex-wrap">
          <span className={`text-[10px] px-3 py-1.5 rounded-xl text-white font-black uppercase tracking-wider ${getCategoryTheme()}`}>
            {post.category}
          </span>
          {post.isPremium && <span className="text-[10px] px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-black uppercase tracking-widest">{t.premium}</span>}
          <span className="text-[10px] px-3 py-1.5 rounded-xl bg-gray-100 text-gray-400 font-bold uppercase tracking-widest">👁️ {post.views}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onReport?.(post.id)} className="text-[10px] text-gray-300 hover:text-red-500 font-black uppercase tracking-widest">{t.report}</button>
          <span className="text-[11px] text-gray-300 font-bold">{post.createdAt}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors leading-tight">
            {post.shopName ? `[${post.shopName}] ${title}` : title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm font-bold text-gray-500">
            <span className="flex items-center gap-1.5 whitespace-nowrap">📍 {post.location}</span>
            {post.price && <span className="text-rose-600 font-black whitespace-nowrap">🏷️ {post.price}</span>}
            {post.salary && <span className="text-emerald-600 font-black whitespace-nowrap">💰 {post.salary}</span>}
          </div>

          {post.photos && post.photos.length > 0 && (
            <div className={`grid ${post.photos.length === 1 ? 'grid-cols-1' : 'grid-cols-3'} gap-2 mb-4 rounded-2xl overflow-hidden`}>
              {post.photos.map((src, i) => (
                <img key={i} src={src} className={`w-full ${post.photos?.length === 1 ? 'h-64' : 'h-32'} object-cover hover:scale-105 transition-transform cursor-pointer shadow-sm`} alt="Post" />
              ))}
            </div>
          )}

          <p className="text-[15px] text-gray-600 mb-6 line-clamp-3 leading-relaxed font-medium">
            {description}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => onReact(post.id, 'like')} className="flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full hover:scale-105 transition-transform">
              👍 {post.likes}
            </button>
            <button onClick={() => onReact(post.id, 'dislike')} className="flex items-center gap-1.5 text-xs font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full hover:scale-105 transition-transform">
              👎 {post.dislikes}
            </button>
            <button onClick={() => setShowComments(!showComments)} className="text-xs font-black text-gray-400">
              💬 {post.comments?.filter(c => c.status === 'active').length || 0} {t.comments}
            </button>
            {post.type === CategoryType.PARTNERSHIP && (
              <button onClick={() => setShowInquiryForm(!showInquiryForm)} className="text-xs font-black text-indigo-500 flex items-center gap-1">
                🤝 {t.partnershipInquiry}
              </button>
            )}
          </div>
        </div>
      </div>

      {showInquiryForm && post.type === CategoryType.PARTNERSHIP && (
        <div className="mt-4 p-6 bg-indigo-50 rounded-[24px] border border-indigo-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h4 className="font-black text-indigo-900 mb-4 uppercase text-xs tracking-widest">{t.partnershipInquiry}</h4>
          <form onSubmit={handleInquirySubmit} className="space-y-3">
             <input 
              className="w-full px-4 py-3 bg-white border-none rounded-xl outline-none text-xs font-bold" 
              placeholder={t.nickname} 
              value={inquiryName} 
              onChange={e => setInquiryName(e.target.value)} 
            />
            <textarea 
              rows={3}
              className="w-full px-4 py-3 bg-white border-none rounded-xl outline-none text-xs font-bold resize-none" 
              placeholder={t.inquiryPlaceholder} 
              value={inquiryText} 
              onChange={e => setInquiryText(e.target.value)} 
            />
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl text-xs font-black hover:bg-indigo-700 transition-colors">
              {t.sendInquiry}
            </button>
          </form>
        </div>
      )}

      {showComments && (
        <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 no-scrollbar">
            {post.comments.filter(c => c.status === 'active').length > 0 ? (
              post.comments.map((comment) => (
                comment.status === 'active' ? (
                  <div key={comment.id} className="bg-gray-50/50 p-4 rounded-2xl group/comment">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-black text-gray-900">{comment.nickname}</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => onLikeComment(post.id, comment.id)} className="text-[10px] font-black text-emerald-500 hover:scale-110">👍 {comment.likes}</button>
                        <button onClick={() => onReportComment(post.id, comment.id)} className="text-[10px] font-black text-gray-300 hover:text-red-500">🚩</button>
                        <span className="text-[10px] text-gray-300 font-bold">{comment.createdAt}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{comment.content}</p>
                  </div>
                ) : null
              ))
            ) : (
              <p className="text-center text-xs text-gray-300 font-bold py-6 uppercase tracking-widest">{t.noComments}</p>
            )}
          </div>
          
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <input 
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none text-xs font-bold" 
              placeholder={t.nickname} 
              value={commentNickname} 
              onChange={e => setCommentNickname(e.target.value)} 
            />
            <div className="flex gap-2">
              <input 
                className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl outline-none text-xs font-bold" 
                placeholder={t.commentPlaceholder} 
                value={commentText} 
                onChange={e => setCommentText(e.target.value)} 
              />
              <button className="bg-gray-900 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-black">
                {t.postComment}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-3 pt-6 border-t border-gray-50">
        <button 
          onClick={() => window.location.href = `tel:${post.phoneNumber}`}
          className="flex-1 bg-gray-900 text-white py-4 rounded-[20px] text-sm font-black hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          <span>📞</span> {t.phone}
        </button>
        <button 
          onClick={() => onOpenChat(post)}
          className="flex-1 bg-yellow-400 text-black py-4 rounded-[20px] text-sm font-black hover:bg-yellow-500 transition-all flex items-center justify-center gap-2"
        >
          <span>💬</span> {t.chat}
        </button>
      </div>
    </div>
  );
};

export default ContentCard;
