
import React, { useState, useRef, useEffect } from 'react';
// Changed JobPost to ContentPost to match exported types from ../types
import { ContentPost, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  // Updated Prop type to ContentPost
  post: ContentPost;
  lang: Language;
  onClose: () => void;
}

const ChatInterface: React.FC<Props> = ({ post, lang, onClose }) => {
  const t = TRANSLATIONS[lang];
  const [messages, setMessages] = useState<{sender: 'me' | 'other', text: string}[]>([
    { sender: 'other', text: lang === 'KR' ? '안녕하세요, 게시글 보고 연락드렸습니다.' : '您好,看到您的发布了。' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isCalling, setIsCalling] = useState<'audio' | 'video' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { sender: 'me', text: inputValue }]);
    setInputValue('');
  };

  const startCall = (type: 'audio' | 'video') => {
    setIsCalling(type);
    if (type === 'video') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-white w-full max-w-md h-[80vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Calling Overlay */}
        {isCalling && (
          <div className="absolute inset-0 z-[70] bg-gray-900 flex flex-col items-center justify-center text-white">
            <div className="w-24 h-24 bg-gray-700 rounded-full mb-4 flex items-center justify-center overflow-hidden">
               {isCalling === 'video' ? <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" /> : <span className="text-4xl">📞</span>}
            </div>
            <h3 className="text-xl font-bold mb-2">{post.phoneNumber}</h3>
            <p className="text-gray-400 animate-pulse">{isCalling === 'video' ? '영상 통화 중...' : '음성 통화 중...'}</p>
            <button 
              onClick={() => setIsCalling(null)}
              className="mt-12 bg-red-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}

        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between bg-yellow-400">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1 font-bold">←</button>
            <div>
              <p className="font-bold leading-none">{lang === 'KR' ? post.titleKR : post.titleCN}</p>
              <p className="text-xs mt-1 text-gray-700">{post.phoneNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => startCall('audio')} className="p-2 hover:bg-yellow-500 rounded-full transition-colors">📞</button>
            <button onClick={() => startCall('video')} className="p-2 hover:bg-yellow-500 rounded-full transition-colors">📹</button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                msg.sender === 'me' ? 'bg-yellow-400 text-black rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="p-4 border-t bg-white flex gap-2">
          <input
            className="flex-1 p-2 bg-gray-100 rounded-full outline-none focus:ring-1 focus:ring-yellow-400 px-4 text-sm"
            placeholder={lang === 'KR' ? '메시지 보내기' : '发送消息'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            className="bg-yellow-400 px-4 py-2 rounded-full font-bold text-sm hover:bg-yellow-500"
          >
            {lang === 'KR' ? '전송' : '发送'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
