import { Sparkles, Heart, Shield, Smartphone, Globe, Download } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  language: 'hi' | 'en';
  onOpenExport: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, language, onOpenExport }) => {
  const isHi = language === 'hi';

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 border-t border-purple-500/20 bg-[#070814] text-slate-400 text-xs py-10 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-black text-sm">
                AAB
              </div>
              <span className="text-lg font-black text-white">
                AAB <span className="text-purple-400">AI</span>
              </span>
            </div>

            <p className="text-slate-400 max-w-md text-xs sm:text-sm leading-relaxed">
              {isHi
                ? 'आदित्य अशोक बाघ (Aditya Ashok Bagh) द्वारा निर्मित बहुआयामी आर्टिफिशियल इंटेलिजेंस प्लेटफॉर्म। एआई चैट, हिंदी कहानियां, डिजिटल कंटेंट, 8K फोटो और वीडियो स्टूडियो।'
                : 'All-in-one AI platform architected by Aditya Ashok Bagh. Featuring intelligent chat, Hindi stories, content writing, 8K art synthesis, and video production.'}
            </p>

            <div className="flex items-center gap-2 text-purple-300 font-medium">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>
                {isHi ? 'निर्माता: आदित्य अशोक बाघ' : 'Created by Aditya Ashok Bagh'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-sm">
              {isHi ? 'मुख्य विशेषताएं' : 'Core Features'}
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => handleNav('chat')}
                  className="hover:text-purple-300 transition-colors"
                >
                  {isHi ? 'AI चैट (हिंदी/अंग्रेजी)' : 'AI Chat (Hindi/English)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('story')}
                  className="hover:text-purple-300 transition-colors"
                >
                  {isHi ? 'AI हिंदी कहानी लेखक' : 'AI Hindi Story Writer'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('content')}
                  className="hover:text-purple-300 transition-colors"
                >
                  {isHi ? 'AI डिजिटल कंटेंट राइटर' : 'AI Content Writer'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('photo')}
                  className="hover:text-purple-300 transition-colors"
                >
                  {isHi ? 'AI फोटो जनरेटर' : 'AI Photo Generator'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('video')}
                  className="hover:text-purple-300 transition-colors"
                >
                  {isHi ? 'AI वीडियो क्रिएटर स्टूडियो' : 'AI Video Creator Studio'}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenExport}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isHi ? 'प्रोजेक्ट डाउनलोड (.zip)' : 'Export Code (.zip)'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Guarantees */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-sm">
              {isHi ? 'सुरक्षा एवं तकनीक' : 'Tech & Privacy'}
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>सुरक्षित सर्वर-साइड AI (No API Key Leak)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                <span>एंड्रॉयड मोबाइल फोन फ्रेंडली</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>प्राथमिक भाषा: हिंदी (Hindi)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} AAB AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
            <span>by Aditya Ashok Bagh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
