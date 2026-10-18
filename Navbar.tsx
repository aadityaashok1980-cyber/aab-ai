import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Video,
  Home,
  Globe,
  Menu,
  X,
  Cpu,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: 'hi' | 'en';
  setLanguage: (lang: 'hi' | 'en') => void;
  hasApiKey: boolean;
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  hasApiKey,
  onOpenExport,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'home' as ActiveTab,
      labelHi: 'होम',
      labelEn: 'Home',
      icon: Home,
    },
    {
      id: 'chat' as ActiveTab,
      labelHi: 'एआई चैट',
      labelEn: 'AI Chat',
      icon: MessageSquare,
      badge: language === 'hi' ? 'लाइव' : 'Live',
    },
    {
      id: 'story' as ActiveTab,
      labelHi: 'हिंदी कहानी लेखक',
      labelEn: 'Hindi Story',
      icon: BookOpen,
      special: true,
    },
    {
      id: 'content' as ActiveTab,
      labelHi: 'कंटेंट राइटर',
      labelEn: 'Content Writer',
      icon: FileText,
    },
    {
      id: 'photo' as ActiveTab,
      labelHi: 'फोटो जनरेटर',
      labelEn: 'Photo Gen',
      icon: ImageIcon,
    },
    {
      id: 'video' as ActiveTab,
      labelHi: 'वीडियो क्रिएटर',
      labelEn: 'Video Creator',
      icon: Video,
      badge: 'PRO',
    },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-purple-500/20 shadow-lg shadow-purple-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5 shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0d0f26] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 text-lg sm:text-xl tracking-wider">
                  AAB
                </span>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-white group-hover:text-purple-300 transition-colors">
                  AAB <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">AI</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Studio
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                {language === 'hi' ? 'निर्माता: आदित्य अशोक बाघ' : 'By Aditya Ashok Bagh'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white border border-purple-500/40 shadow-sm shadow-purple-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-[9px] left-1/2 transform -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-purple-400 to-blue-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Button */}
            <button
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-200 text-xs sm:text-sm font-semibold transition-all hover:scale-102"
              title="भाषा बदलें / Change Language"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
              <span>{language === 'hi' ? 'हिन्दी' : 'English'}</span>
              <span className="text-[10px] px-1 py-0.2 bg-purple-800/60 rounded text-purple-300">
                {language === 'hi' ? 'EN' : 'HI'}
              </span>
            </button>

            {/* Export Code Button */}
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/30 transition-all hover:scale-102 cursor-pointer"
              title="प्रोजेक्ट एक्सपोर्ट करें / Export Source Code"
            >
              <Download className="w-3.5 h-3.5 text-pink-300" />
              <span className="hidden sm:inline">{language === 'hi' ? 'एक्सपोर्ट' : 'Export'}</span>
            </button>

            {/* AI API Status Badge */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/70 border border-slate-700/60 text-[11px] font-medium text-slate-300"
              title={
                hasApiKey
                  ? 'Google Gemini 3.8 Flash सक्रिय है'
                  : 'AAB AI निःशुल्क इंजन सक्रिय है'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  hasApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
                }`}
              />
              <span className="text-slate-300">
                {hasApiKey ? 'Gemini AI' : 'Free AI Engine'}
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800/80 text-slate-200 hover:text-white border border-slate-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-card border-b border-purple-500/20 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="p-2 mb-2 bg-purple-950/30 border border-purple-500/20 rounded-xl flex items-center justify-between">
            <span className="text-xs text-purple-200">
              {language === 'hi' ? 'निर्माता: आदित्य अशोक बाघ' : 'Created by Aditya Ashok Bagh'}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-cyan-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Free Access</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                  <span className="truncate">{language === 'hi' ? item.labelHi : item.labelEn}</span>
                  {item.badge && (
                    <span className="ml-auto text-[8px] px-1 py-0.5 rounded bg-pink-500 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenExport();
            }}
            className="w-full mt-2 p-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-600/30"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'hi' ? 'प्रोजेक्ट एक्सपोर्ट एवं फ्री डाउनलोड (.zip)' : 'Export & Free Download (.zip)'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
