import React from 'react';
import { Home, MessageSquare, BookOpen, FileText, Image as ImageIcon, Video } from 'lucide-react';
import { ActiveTab } from '../types';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: 'hi' | 'en';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  language,
}) => {
  const tabs = [
    {
      id: 'home' as ActiveTab,
      labelHi: 'होम',
      labelEn: 'Home',
      icon: Home,
    },
    {
      id: 'chat' as ActiveTab,
      labelHi: 'चैट',
      labelEn: 'Chat',
      icon: MessageSquare,
    },
    {
      id: 'story' as ActiveTab,
      labelHi: 'कहानी',
      labelEn: 'Story',
      icon: BookOpen,
      highlight: true,
    },
    {
      id: 'content' as ActiveTab,
      labelHi: 'कंटेंट',
      labelEn: 'Writer',
      icon: FileText,
    },
    {
      id: 'photo' as ActiveTab,
      labelHi: 'फोटो',
      labelEn: 'Photo',
      icon: ImageIcon,
    },
    {
      id: 'video' as ActiveTab,
      labelHi: 'वीडियो',
      labelEn: 'Video',
      icon: Video,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-purple-500/30 px-2 py-1.5 pb-safe shadow-2xl shadow-black bg-[#090b1c]/95">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.highlight && !isActive && (
                <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping" />
              )}
              <div
                className={`p-1.5 rounded-lg transition-transform duration-200 ${
                  isActive
                    ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/50 scale-110'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-purple-300 font-bold' : ''}`}>
                {language === 'hi' ? tab.labelHi : tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
