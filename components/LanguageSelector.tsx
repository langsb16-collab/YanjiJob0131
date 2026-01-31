
import React from 'react';
import { Language } from '../types';

interface Props {
  onSelect: (lang: Language) => void;
}

const LanguageSelector: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-2">연길 알바천국</h1>
        <p className="text-gray-600 mb-8">延吉兼职天堂 / Yanji Job Hub</p>
        
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => onSelect('KR')}
            className="flex items-center justify-between p-4 border-2 border-yellow-400 rounded-xl hover:bg-yellow-50 transition-colors"
          >
            <span className="text-lg font-bold">한국어 (Korean)</span>
            <span className="text-2xl">🇰🇷</span>
          </button>
          
          <button
            onClick={() => onSelect('CN')}
            className="flex items-center justify-between p-4 border-2 border-red-400 rounded-xl hover:bg-red-50 transition-colors"
          >
            <span className="text-lg font-bold">中文 (Chinese)</span>
            <span className="text-2xl">🇨🇳</span>
          </button>
        </div>
        
        <p className="mt-8 text-xs text-gray-400">
          로그인 없이 무료로 이용하세요<br/>
          无需登录,免费使用
        </p>
      </div>
    </div>
  );
};

export default LanguageSelector;
