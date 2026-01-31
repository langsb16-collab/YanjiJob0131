
import React, { useState } from 'react';
// Changed JobPost to ContentPost to match exported types from ../types
import { Language, CategoryType, ContentPost } from '../types';
import { TRANSLATIONS, LOCATIONS, CATEGORIES } from '../constants';
import { generateBilingualPost } from '../services/geminiService';

interface Props {
  type: CategoryType;
  lang: Language;
  onClose: () => void;
  // Updated callback parameter type to ContentPost
  onSubmit: (post: ContentPost) => void;
}

const JobForm: React.FC<Props> = ({ type, lang, onClose, onSubmit }) => {
  const t = TRANSLATIONS[lang];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: LOCATIONS[0],
    salary: '',
    phoneNumber: '',
    wechatId: '',
    isKoreanRequired: false,
    hasDormitory: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bilingual = await generateBilingualPost(formData.title, formData.description, lang);
      
      // Added missing engagement fields (likes, dislikes, comments, views) to match ContentPost interface
      const newPost: ContentPost = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        titleKR: bilingual.titleKR,
        titleCN: bilingual.titleCN,
        descriptionKR: bilingual.descKR,
        descriptionCN: bilingual.descCN,
        category: formData.category || (type === CategoryType.PARTTIME ? CATEGORIES.PARTTIME[0].kr : CATEGORIES.RECRUITMENT[0].kr),
        location: formData.location,
        salary: formData.salary,
        phoneNumber: formData.phoneNumber,
        wechatId: formData.wechatId,
        isKoreanRequired: formData.isKoreanRequired,
        hasDormitory: formData.hasDormitory,
        createdAt: new Date().toLocaleDateString(),
        expiresAt: new Date(Date.now() + (type === CategoryType.PARTTIME ? 14 : 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        isUrgent: false,
        isAd: false,
        isPremium: false,
        status: 'active',
        reportCount: 0,
        likes: 0,
        dislikes: 0,
        views: 0,
        comments: []
      };

      onSubmit(newPost);
    } catch (error) {
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentCategories = type === CategoryType.PARTTIME ? CATEGORIES.PARTTIME : CATEGORIES.RECRUITMENT;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-black text-gray-900">{t.postButton}</h2>
            <p className="text-xs text-gray-500 mt-1">로그인 없이 무료로 등록하세요 | 无需登录，免费发布</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-gray-400">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: Job Details */}
            <div className="space-y-6">
              <h3 className="font-bold text-gray-900 border-l-4 border-yellow-400 pl-3">공고 상세 정보</h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.title} *</label>
                <input
                  required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                  placeholder={lang === 'KR' ? "예: 식당 홀서빙 구함" : "例如：餐厅服务员"}
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">카테고리</label>
                  <select 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none"
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {currentCategories.map((cat, idx) => (
                      <option key={idx} value={cat.kr}>{lang === 'KR' ? cat.kr : cat.cn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t.location} *</label>
                  <select 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none"
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  >
                    {LOCATIONS.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.salary} *</label>
                <input
                  required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="예: 월 4500RMB / 일 150RMB"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.description} *</label>
                <textarea
                  required
                  rows={5}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                  placeholder={lang === 'KR' ? "업무 시간, 우대 사항 등을 자유롭게 적어주세요." : "请输入详细的工作内容 and 要求。"}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            {/* Right Column: Contact & Options */}
            <div className="space-y-6">
              <h3 className="font-bold text-gray-900 border-l-4 border-yellow-400 pl-3">연락처 및 옵션</h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.phone} (필수) *</label>
                <input
                  required
                  type="tel"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none font-mono"
                  placeholder="138-0000-0000"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">WeChat ID</label>
                <input
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  placeholder="WeChat ID"
                  value={formData.wechatId}
                  onChange={(e) => setFormData({...formData, wechatId: e.target.value})}
                />
              </div>

              <div className="bg-yellow-50 p-6 rounded-2xl space-y-4">
                <p className="text-xs font-bold text-yellow-800 uppercase tracking-widest">Additional Options</p>
                <label className="flex items-center gap-3 text-sm font-bold text-gray-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-yellow-500 rounded border-gray-300"
                    checked={formData.isKoreanRequired} 
                    onChange={(e) => setFormData({...formData, isKoreanRequired: e.target.checked})}
                  />
                  {t.koreanRequired} (한국어 필요)
                </label>
                <label className="flex items-center gap-3 text-sm font-bold text-gray-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-yellow-500 rounded border-gray-300"
                    checked={formData.hasDormitory}
                    onChange={(e) => setFormData({...formData, hasDormitory: e.target.checked})}
                  />
                  {t.dormitory} (숙식 제공)
                </label>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-5 bg-black text-white rounded-xl font-black text-lg hover:bg-gray-900 disabled:opacity-50 transition-all shadow-xl shadow-black/10"
                >
                  {loading ? (lang === 'KR' ? '자동 번역 및 등록 중...' : '正在自动翻译并发布...') : t.submit}
                </button>
                <p className="text-[10px] text-gray-400 text-center">
                  등록 시 허위사실 및 불법 광고에 대한 법적 책임은 게시자에게 있습니다.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
