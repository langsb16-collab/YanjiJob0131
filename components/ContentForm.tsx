
import React, { useState, useRef } from 'react';
import { Language, CategoryType, ContentPost } from '../types';
import { TRANSLATIONS, LOCATIONS, CATEGORIES, DEAL_TYPES } from '../constants';
import { generateBilingualPost } from '../services/geminiService';

interface Props {
  type: CategoryType;
  lang: Language;
  onClose: () => void;
  onSubmit: (post: ContentPost) => void;
}

const ContentForm: React.FC<Props> = ({ type, lang, onClose, onSubmit }) => {
  const t = TRANSLATIONS[lang];
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    shopName: '',
    description: '',
    category: '',
    location: LOCATIONS[0],
    salary: '',
    price: '',
    area: '',
    floor: '',
    address: '',
    openHours: '',
    tags: '',
    dealType: '',
    moveInDate: '',
    startDate: '',
    endDate: '',
    phoneNumber: '',
    wechatId: '',
    isKoreanRequired: false,
    hasDormitory: false
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length + photos.length > 3) {
      alert(lang === 'KR' ? '최대 3장까지 가능합니다.' : '最多上传3张照片。');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bilingual = await generateBilingualPost(formData.title || formData.shopName, formData.description, lang);
      
      // Added missing 'views' property to match ContentPost interface
      const newPost: ContentPost = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        titleKR: bilingual.titleKR,
        titleCN: bilingual.titleCN,
        descriptionKR: bilingual.descKR,
        descriptionCN: bilingual.descCN,
        shopName: formData.shopName || undefined,
        address: formData.address || undefined,
        openHours: formData.openHours || undefined,
        tags: formData.tags ? formData.tags.split(',').map((s: string) => s.trim()) : undefined,
        category: formData.category || (CATEGORIES[type as keyof typeof CATEGORIES]?.[0]?.kr || '기타'),
        location: formData.location,
        salary: formData.salary || undefined,
        price: formData.price || undefined,
        area: formData.area || undefined,
        floor: formData.floor || undefined,
        dealType: formData.dealType || undefined,
        moveInDate: formData.moveInDate || undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        photos: photos.length > 0 ? photos : undefined,
        phoneNumber: formData.phoneNumber,
        wechatId: formData.wechatId,
        isKoreanRequired: formData.isKoreanRequired,
        hasDormitory: formData.hasDormitory,
        createdAt: new Date().toLocaleDateString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
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
      alert("Failed to post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentCategories = CATEGORIES[type as keyof typeof CATEGORIES] || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="px-10 py-8 border-b flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-xl font-black bg-gray-100 hover:bg-gray-200 w-10 h-10 flex items-center justify-center rounded-xl transition-all">🏠</button>
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">{t.postButton} - {t[type.toLowerCase().replace('_', '') as keyof typeof t] || t[type.toLowerCase() as keyof typeof t]}</h2>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{t.home} | HOME • FREE REGISTRATION</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-gray-200 transition-all font-bold">✕ {t.cancel}</button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h3 className="font-black text-gray-900 border-l-4 border-yellow-400 pl-4 uppercase tracking-tighter">Information</h3>
            
            <div className="space-y-4">
              <input 
                required 
                className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 font-bold" 
                placeholder={(type === CategoryType.BUSINESS ? t.shopName : t.title) + " *"} 
                value={type === CategoryType.BUSINESS ? formData.shopName : formData.title} 
                onChange={e => setFormData({...formData, [type === CategoryType.BUSINESS ? 'shopName' : 'title']: e.target.value})} 
              />
              
              <div className="grid grid-cols-2 gap-4">
                <select className="p-5 bg-gray-50 border-none rounded-2xl outline-none font-bold appearance-none" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="">{lang === 'KR' ? '분류 선택' : '选择分类'}</option>
                  {currentCategories.map((c: any, i: number) => <option key={i} value={c.kr}>{lang === 'KR' ? c.kr : c.cn}</option>)}
                </select>
                <select className="p-5 bg-gray-50 border-none rounded-2xl outline-none font-bold appearance-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              {type === CategoryType.COMMUNITY_USED && (
                <input required className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 font-bold" placeholder={t.price + " *"} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              )}

              {type === CategoryType.REAL_ESTATE && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <select className="p-5 bg-gray-50 border-none rounded-2xl outline-none font-bold appearance-none" required value={formData.dealType} onChange={e => setFormData({...formData, dealType: e.target.value})}>
                       <option value="">{lang === 'KR' ? '거래 유형' : '交易类型'}</option>
                       {DEAL_TYPES.map((d, i) => <option key={i} value={d.kr}>{lang === 'KR' ? d.kr : d.cn}</option>)}
                    </select>
                    <input required className="p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 font-bold" placeholder={t.price + " *"} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                </>
              )}

              <textarea required rows={5} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 font-bold resize-none" placeholder={t.description + " *"} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              
              <div className="space-y-3">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.photos}</p>
                <div className="flex gap-4">
                  {photos.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-yellow-400 group">
                      <img src={src} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removePhoto(i)} className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold">✕</button>
                    </div>
                  ))}
                  {photos.length < 3 && (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:border-yellow-400 hover:text-yellow-400 transition-all">
                      <span className="text-2xl font-light">+</span>
                      <span className="text-[10px] font-black uppercase">Upload</span>
                    </button>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFileChange} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-black text-gray-900 border-l-4 border-yellow-400 pl-4 uppercase tracking-tighter">Contact & Post</h3>
            
            <div className="space-y-4">
              <input required type="tel" className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-black text-lg" placeholder={t.phone + " *"} value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
              <input className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-bold" placeholder="WeChat ID" value={formData.wechatId} onChange={e => setFormData({...formData, wechatId: e.target.value})} />
              
              <div className="bg-gray-50 p-8 rounded-[32px] shadow-inner space-y-4 border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Post Options</p>
                <label className="flex items-center gap-3 font-bold text-gray-700 cursor-pointer">
                  <input type="checkbox" className="w-6 h-6 accent-yellow-500 rounded-lg" checked={formData.isKoreanRequired} onChange={e => setFormData({...formData, isKoreanRequired: e.target.checked})} /> 
                  <span className="text-sm">{t.koreanRequired}</span>
                </label>
              </div>

              <div className="pt-6">
                <button disabled={loading} className="w-full py-6 bg-black text-white rounded-[24px] font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                  {loading ? (lang === 'KR' ? 'AI 번역 및 게시 중...' : '正在发布...') : t.submit}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentForm;
