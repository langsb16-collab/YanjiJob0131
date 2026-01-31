
import React, { useState } from 'react';
import { ContentPost, AdminStats, Language, CategoryType, Report, AdCampaign, BlacklistItem } from '../types';
import { TRANSLATIONS, LOCATIONS } from '../constants';

interface Props {
  posts: ContentPost[];
  reports: Report[];
  ads: AdCampaign[];
  blacklist: BlacklistItem[];
  lang: Language;
  onDeletePost: (id: string) => void;
  onToggleStatus: (id: string, field: 'isUrgent' | 'isAd' | 'isPremium') => void;
  onApprovePartnership: (id: string) => void;
  onRejectPartnership: (id: string) => void;
  onSetPremium: (id: string, days: number) => void;
  onAddBlacklist: (val: string, reason: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<Props> = ({ 
  posts, reports, ads, blacklist, lang, onDeletePost, onToggleStatus, onApprovePartnership, onRejectPartnership, onSetPremium, onAddBlacklist, onDeleteComment, onClose 
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'dash' | 'posts' | 'partnerships' | 'reports' | 'blacklist' | 'comments'>('dash');
  const [blockVal, setBlockVal] = useState('');

  const stats: AdminStats = {
    totalPosts: posts.length,
    newToday: posts.filter(p => p.createdAt === new Date().toLocaleDateString()).length,
    pendingReports: reports.filter(r => r.status === 'open').length,
    activeAds: ads.filter(a => a.isActive).length,
    adsCtr: 0.05
  };

  const premiumActiveCount = posts.filter(p => p.isPremium).length;

  return (
    <div className="fixed inset-0 z-[100] bg-[#F4F7FE] flex overflow-hidden font-sans">
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shrink-0 p-6 shadow-sm">
        <div className="mb-10 px-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-900 rounded-[18px] flex items-center justify-center text-white font-black">YH</div>
          <span className="font-black text-gray-900 text-2xl tracking-tighter">Admin</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          {[
            { id: 'dash', icon: '📊', label: t.overview },
            { id: 'posts', icon: '📝', label: t.postManage },
            { id: 'partnerships', icon: '🤝', label: 'Partnerships' },
            { id: 'comments', icon: '💬', label: 'Comments' },
            { id: 'reports', icon: '🚨', label: t.reportManage },
            { id: 'blacklist', icon: '🛡️', label: t.blacklistManage },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${
                activeTab === item.id ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <button onClick={onClose} className="w-full py-5 bg-emerald-50 text-emerald-600 rounded-3xl font-black text-sm uppercase">🏠 {t.userView}</button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden p-10">
        <header className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">{activeTab}</h2>
          <div className="flex gap-4">
             <div className="bg-white px-5 py-2 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] text-gray-400 font-bold uppercase">System Status</p>
                <p className="text-emerald-500 font-black text-sm uppercase">Secure</p>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
          {activeTab === 'dash' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Contents</span>
                  <h3 className="text-5xl font-black mt-4">{stats.totalPosts}</h3>
                </div>
                <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.activePremiumPosts}</span>
                  <h3 className="text-5xl font-black mt-4 text-emerald-600">{premiumActiveCount}</h3>
                </div>
                <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Pending Partners</span>
                  <h3 className="text-5xl font-black mt-4 text-indigo-600">{posts.filter(p => p.status === 'pending').length}</h3>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                <h3 className="font-black text-xl mb-6">Views Top 5</h3>
                <div className="space-y-4">
                  {posts.sort((a,b) => b.views - a.views).slice(0, 5).map(p => (
                    <div key={p.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                      <span className="font-bold text-gray-700">{p.titleKR}</span>
                      <span className="text-emerald-500 font-black">{p.views} views</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'partnerships' && (
            <div className="space-y-4">
              {posts.filter(p => p.type === CategoryType.PARTNERSHIP).map(p => (
                <div key={p.id} className={`bg-white p-8 rounded-[32px] border flex flex-col gap-6 ${p.status === 'pending' ? 'border-yellow-200 bg-yellow-50/10' : 'border-gray-100'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-xl">{p.titleKR}</h4>
                      <p className="text-sm text-gray-500 font-medium">{p.category} | {p.phoneNumber} | {p.createdAt}</p>
                      {p.isPremium && <span className="inline-block mt-2 text-[10px] font-black bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg">PREMIUM UNTIL: {p.premiumUntil}</span>}
                    </div>
                    <div className="flex gap-2">
                      {p.status === 'pending' && (
                        <>
                          <button onClick={() => onApprovePartnership(p.id)} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase hover:bg-indigo-700">{t.approve}</button>
                          <button onClick={() => onRejectPartnership(p.id)} className="px-5 py-2.5 bg-red-100 text-red-600 rounded-xl font-black text-xs uppercase hover:bg-red-200">{t.reject}</button>
                        </>
                      )}
                      {!p.isPremium && p.status === 'active' && <button onClick={() => onSetPremium(p.id, 7)} className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs uppercase hover:bg-emerald-100">Set Premium (7d)</button>}
                      <button onClick={() => onDeletePost(p.id)} className="px-5 py-2.5 bg-gray-100 text-gray-400 rounded-xl font-black text-xs uppercase hover:bg-gray-200">Delete</button>
                    </div>
                  </div>
                  {p.inquiries && p.inquiries.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Messages ({p.inquiries.length})</h5>
                      <div className="space-y-4">
                        {p.inquiries.map(m => (
                          <div key={m.id} className="text-xs border-b border-gray-100 pb-2 last:border-0">
                            <p className="font-black text-gray-900">{m.senderName} <span className="text-[10px] font-medium text-gray-300 ml-2">{m.createdAt}</span></p>
                            <p className="text-gray-600 mt-1">{m.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                     <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase">Post</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase">Nickname</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase">Content</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase text-center">Likes / Reports</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase text-center">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {posts.flatMap(p => p.comments.map(c => ({...c, postId: p.id, postTitle: p.titleKR}))).map(c => (
                        <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                           <td className="px-8 py-4 text-xs font-bold text-gray-400 truncate max-w-[120px]">{c.postTitle}</td>
                           <td className="px-8 py-4 text-sm font-black">{c.nickname}</td>
                           <td className="px-8 py-4 text-sm text-gray-600 font-medium">{c.content}</td>
                           <td className="px-8 py-4 text-xs font-black text-center">
                              <span className="text-emerald-500">👍 {c.likes}</span> / <span className="text-rose-500">🚩 {c.reportCount}</span>
                           </td>
                           <td className="px-8 py-4 text-center">
                              <button onClick={() => onDeleteComment(c.postId, c.id)} className="text-xs font-black text-red-500 hover:underline">DELETE</button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === 'blacklist' && (
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
               <div className="flex gap-3 mb-10">
                  <input className="flex-1 p-5 bg-gray-50 rounded-2xl border-none font-bold" placeholder="Phone to block..." value={blockVal} onChange={e => setBlockVal(e.target.value)} />
                  <button onClick={() => { onAddBlacklist(blockVal, 'Manual Block'); setBlockVal(''); }} className="px-10 bg-black text-white rounded-2xl font-black">BLOCK</button>
               </div>
               <div className="space-y-3">
                  {blacklist.map(item => (
                    <div key={item.id} className="p-5 bg-gray-50 rounded-2xl flex justify-between items-center font-bold">
                       <span>{item.value} ({item.reason})</span>
                       <span className="text-gray-300 text-xs">{item.createdAt}</span>
                    </div>
                  ))}
               </div>
            </div>
          )}
          
          {/* Default list view for regular posts handled elsewhere or simplified here */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
