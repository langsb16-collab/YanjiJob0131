import React from 'react';
import { ContentPost } from '../types';

interface Props {
  posts: ContentPost[];
  onClose: () => void;
}

const StatsDashboard: React.FC<Props> = ({ posts, onClose }) => {
  const totalPosts = posts.length;
  const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalComments = posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);

  const categoryStats = posts.reduce((acc: any, post) => {
    const cat = post.type;
    if (!acc[cat]) acc[cat] = 0;
    acc[cat]++;
    return acc;
  }, {});

  const topPosts = [...posts]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#111827]">📊 활동 통계</h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#f9fafb] p-4 rounded-2xl border border-[#e5e7eb]">
            <p className="text-sm text-[#6b7280] font-semibold mb-1">전체 게시글</p>
            <p className="text-3xl font-bold text-[#111827]">{totalPosts}</p>
          </div>
          <div className="bg-[#f9fafb] p-4 rounded-2xl border border-[#e5e7eb]">
            <p className="text-sm text-[#6b7280] font-semibold mb-1">총 좋아요</p>
            <p className="text-3xl font-bold text-emerald-600">{totalLikes}</p>
          </div>
          <div className="bg-[#f9fafb] p-4 rounded-2xl border border-[#e5e7eb]">
            <p className="text-sm text-[#6b7280] font-semibold mb-1">총 조회수</p>
            <p className="text-3xl font-bold text-blue-600">{totalViews}</p>
          </div>
          <div className="bg-[#f9fafb] p-4 rounded-2xl border border-[#e5e7eb]">
            <p className="text-sm text-[#6b7280] font-semibold mb-1">총 댓글</p>
            <p className="text-3xl font-bold text-purple-600">{totalComments}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#111827] mb-3">카테고리별 통계</h3>
          <div className="space-y-2">
            {Object.entries(categoryStats).map(([cat, count]) => (
              <div key={cat} className="flex justify-between items-center bg-[#f9fafb] p-3 rounded-xl">
                <span className="font-semibold text-[#111827]">{cat}</span>
                <span className="text-[#6b7280]">{count}개</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#111827] mb-3">인기 게시글 Top 5</h3>
          <div className="space-y-2">
            {topPosts.map((post, idx) => (
              <div key={post.id} className="flex items-center gap-3 bg-[#f9fafb] p-3 rounded-xl">
                <span className="text-2xl font-bold text-[#6b7280]">#{idx + 1}</span>
                <div className="flex-1">
                  <p className="font-semibold text-[#111827] text-sm">{post.titleKR}</p>
                  <p className="text-xs text-[#6b7280]">👍 {post.likes} • 👁️ {post.views}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
