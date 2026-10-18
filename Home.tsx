import React from 'react';
import {
  Sparkles,
  MessageSquare,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Video,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Award,
  Smartphone,
  Play,
  Heart,
  Flame,
  Download,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface HomeProps {
  setActiveTab: (tab: ActiveTab) => void;
  language: 'hi' | 'en';
  onOpenExport: () => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, language, onOpenExport }) => {
  const isHi = language === 'hi';

  const features = [
    {
      id: 'chat' as ActiveTab,
      titleHi: 'AI चैट (बुद्धिमान संवाद)',
      titleEn: 'AI Chat Assistant',
      descHi: 'किसी भी विषय पर हिंदी या अंग्रेजी में बुद्धिमत्तापूर्ण प्रश्नोत्तरी, कोडिंग और सलाह।',
      descEn: 'Intelligent multi-turn conversational AI answering questions, code, and daily tasks.',
      icon: MessageSquare,
      gradient: 'from-purple-600 via-indigo-600 to-blue-500',
      badgeHi: 'लाइव असिस्टेंट',
      badgeEn: 'Live Assistant',
      ctaHi: 'चैट शुरू करें',
      ctaEn: 'Start Chatting',
      apiInfoHi: 'निःशुल्क / Gemini 3.8 Flash समर्थित',
      apiInfoEn: 'Free / Gemini 3.8 Flash Powered',
    },
    {
      id: 'story' as ActiveTab,
      titleHi: 'AI हिंदी कहानी लेखक',
      titleEn: 'AI Hindi Story Writer',
      descHi: 'बाल कथाएं, प्रेरणादायक प्रसंग, पौराणिक गाथाएं और रहस्यमय कहानियां शुद्ध हिंदी में वॉयसओवर सहित।',
      descEn: 'Deep cultural and moral stories in natural Hindi with audio voiceover and character cards.',
      icon: BookOpen,
      gradient: 'from-fuchsia-600 via-purple-600 to-indigo-600',
      badgeHi: 'विशेष फीचर (हिंदी)',
      badgeEn: 'Special Feature (Hindi)',
      ctaHi: 'कहानी बनाएं',
      ctaEn: 'Create Story',
      apiInfoHi: 'पूर्णतः निःशुल्क हिंदी इंजन',
      apiInfoEn: '100% Free Hindi Story Engine',
      popular: true,
    },
    {
      id: 'content' as ActiveTab,
      titleHi: 'AI डिजिटल कंटेंट राइटर',
      titleEn: 'AI Content Writer',
      descHi: 'YouTube वीडियो स्क्रिप्ट, वायरल रील्स कैप्शन, ब्लॉग पोस्ट्स, लिंक्डइन व प्रोफेशनल ईमेल।',
      descEn: 'High-converting scripts, SEO blog articles, Instagram captions, and formal emails.',
      icon: FileText,
      gradient: 'from-blue-600 via-cyan-600 to-teal-500',
      badgeHi: 'सोशल मीडिया बूस्ट',
      badgeEn: 'Social Media Ready',
      ctaHi: 'कंटेंट लिखें',
      ctaEn: 'Write Content',
      apiInfoHi: 'निःशुल्क एवं त्वरित जनरेशन',
      apiInfoEn: 'Free & Instant Output',
    },
    {
      id: 'photo' as ActiveTab,
      titleHi: 'AI फोटो जनरेटर',
      titleEn: 'AI Photo Generator',
      descHi: 'अपने शब्दों को जीवंत 8K अल्ट्रा-एचडी छवियों में बदलें। 1:1, 16:9, 9:16 में मुफ्त डाउनलोड करें।',
      descEn: 'Turn simple text prompts into photorealistic artworks, cyberpunk visions, and 3D renders.',
      icon: ImageIcon,
      gradient: 'from-pink-600 via-rose-600 to-purple-600',
      badgeHi: 'असीमित मुफ्त कला',
      badgeEn: 'Unlimited Free Art',
      ctaHi: 'तस्वीर बनाएं',
      ctaEn: 'Generate Art',
      apiInfoHi: 'इंस्टेंट न्यूरल इमेज इंजन (फ्री)',
      apiInfoEn: 'Instant Free Neural Synthesis',
    },
    {
      id: 'video' as ActiveTab,
      titleHi: 'AI वीडियो क्रिएटर एवं स्टोरीबोर्ड',
      titleEn: 'AI Video Creator Studio',
      descHi: 'सिनेमैटिक मल्टी-सीन वीडियो स्क्रिप्ट, विजुअल फ्रेम्स, हिंदी डायलॉग और लाइव वीडियो प्लेयर सिम्युलेटर।',
      descEn: 'Cinematic multi-scene storyboards, camera directions, voiceover scripts, and real interactive player.',
      icon: Video,
      gradient: 'from-indigo-600 via-purple-700 to-pink-600',
      badgeHi: 'सिनेमैटिक स्टूडियो',
      badgeEn: 'Cinematic Studio',
      ctaHi: 'वीडियो बनाएं',
      ctaEn: 'Create Video',
      apiInfoHi: 'स्टोरीबोर्ड + इंटरएक्टिव सिम्युलेटर',
      apiInfoEn: 'Storyboard + Live Simulator',
    },
  ];

  const quickPrompts = [
    {
      category: isHi ? 'कहानी' : 'Story',
      text: isHi
        ? 'एक बुद्धिमान किसान और आधुनिक सौर रोबोट की प्रेरणादायक कहानी'
        : 'An inspiring story of a wise farmer and a solar-powered farm robot',
      action: 'story',
    },
    {
      category: isHi ? 'चैट' : 'Chat',
      text: isHi
        ? 'आधुनिक भारत में AI क्रांति और युवाओं के लिए 5 बड़े करियर विकल्प बताएं'
        : 'Explain the top 5 emerging AI careers for young professionals in India',
      action: 'chat',
    },
    {
      category: isHi ? 'फोटो' : 'Photo',
      text: isHi
        ? 'वाराणसी के घाट पर ध्यान मुद्रा में एक युवा, नीयन और सुनहरी रोशनी, 8k सिनेमैटिक'
        : 'Futuristic Varanasi ghat with glowing purple and blue neon reflections, 8k cinematic',
      action: 'photo',
    },
    {
      category: isHi ? 'वीडियो' : 'Video',
      text: isHi
        ? 'भारत का मंगलयान 2 अभियान - अंतरिक्ष की गहराई में एक रोमांचक यात्रा'
        : 'India Mangalyaan 2 mission - deep space cinematic trailer with thrilling voiceover',
      action: 'video',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-12 lg:p-16 border border-purple-500/30 bg-gradient-to-b from-purple-950/40 via-[#0d0f2b]/80 to-[#080917] shadow-2xl shadow-purple-950/40">
        {/* Glowing background orbs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Creator Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-400/40 text-purple-200 text-xs sm:text-sm font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-purple-300 animate-spin" />
            <span>
              {isHi
                ? 'आदित्य अशोक बाघ (Aditya Ashok Bagh) द्वारा प्रस्तुत ऑल-इन-वन एआई'
                : 'All-in-One AI Platform Created by Aditya Ashok Bagh'}
            </span>
          </div>

          {/* Main Hero Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {isHi ? (
              <>
                आपकी रचनात्मकता को नई उड़ान देने वाला{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  AAB AI स्टूडियो
                </span>
              </>
            ) : (
              <>
                Unleash the Power of Next-Gen{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  AAB AI Studio
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            {isHi
              ? 'एआई चैट, हिंदी कहानियां, प्रोफेशनल कंटेंट राइटिंग, हाई-डेफिनिशन फोटो जनरेशन और वीडियो क्रिएशन—सब कुछ एक ही शक्तिशाली, मोबाइल-फ्रेंडली प्लेटफॉर्म पर।'
              : 'Smart AI Chat, Hindi Storyteller, Digital Content Writer, HD Photo Generator, and Cinematic Video Creator—all unified in one sleek, mobile-optimized experience.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => setActiveTab('story')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-102 transition-all cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              <span>{isHi ? 'हिंदी कहानी लिखें' : 'Write Hindi Story'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 border border-purple-500/30 font-semibold text-sm sm:text-base hover:scale-102 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <span>{isHi ? 'एआई से चैट करें' : 'Try AI Chat'}</span>
            </button>

            <button
              onClick={() => setActiveTab('photo')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-pink-300 border border-pink-500/30 font-semibold text-sm sm:text-base hover:scale-102 transition-all cursor-pointer"
            >
              <ImageIcon className="w-5 h-5 text-pink-400" />
              <span>{isHi ? 'फोटो जनरेट करें' : 'Create Art'}</span>
            </button>

            <button
              onClick={onOpenExport}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 text-emerald-300 border border-emerald-500/40 font-bold text-sm sm:text-base hover:scale-102 transition-all cursor-pointer"
            >
              <Download className="w-5 h-5 text-emerald-400" />
              <span>{isHi ? 'प्रोजेक्ट डाउनलोड (.zip)' : 'Export Code (.zip)'}</span>
            </button>
          </div>

          {/* Feature Highlights Ribbon */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-slate-300 font-medium border-t border-slate-800/80">
            <div className="flex items-center justify-center gap-2 py-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>{isHi ? '100% निःशुल्क विकल्प' : 'Free Options Included'}</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>{isHi ? 'डिफ़ॉल्ट हिंदी भाषा' : 'Hindi by Default'}</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span>{isHi ? 'एंड्रॉयड फोन हेतु तैयार' : 'Android Mobile Ready'}</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{isHi ? 'सुरक्षित एवं प्राइवेट' : 'Secure Server-Side AI'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-purple-500/20 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span>{isHi ? 'AAB AI की 5 मुख्य क्षमताएं' : '5 Core AI Capabilities'}</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              {isHi
                ? 'प्रत्येक सुविधा के लिए अलग और समर्पित स्टूडियो'
                : 'Dedicated workspaces crafted for maximum creative freedom'}
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300">
            {isHi ? 'सभी टूल्स सक्रिय हैं' : 'All 5 Tools Active'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className={`group relative rounded-2xl p-6 glass-card border border-purple-500/20 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-900/40 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  feat.popular ? 'ring-1 ring-purple-500/50 bg-[#141233]/70' : ''
                }`}
              >
                {/* Popular / Special Badge */}
                {feat.popular && (
                  <div className="absolute -top-3 right-5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[11px] font-bold shadow-md shadow-pink-500/40">
                    <Flame className="w-3 h-3" />
                    <span>{isHi ? 'लोकप्रिय' : 'Most Popular'}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-purple-950/50 border border-purple-500/20 text-purple-300">
                      {isHi ? feat.badgeHi : feat.badgeEn}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {isHi ? feat.titleHi : feat.titleEn}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                    {isHi ? feat.descHi : feat.descEn}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{isHi ? 'इंजन' : 'Engine'}:</span>
                    <span className="text-cyan-300 font-medium">
                      {isHi ? feat.apiInfoHi : feat.apiInfoEn}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-purple-400 group-hover:text-purple-300 font-semibold text-xs sm:text-sm">
                    <span>{isHi ? feat.ctaHi : feat.ctaEn}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Prompt Launcher Section */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-purple-500/20 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {isHi ? 'एक क्लिक में आज़माएँ (त्वरित प्रॉम्प्ट्स)' : 'Quick-Start Presets'}
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {isHi ? 'सीधे संबंधित टूल पर जाएं' : 'Click any preset to launch'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickPrompts.map((p, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab(p.action as ActiveTab)}
              className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all flex items-start gap-3 group"
            >
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {p.category}
              </span>
              <p className="text-xs sm:text-sm text-slate-200 group-hover:text-purple-300 transition-colors flex-1">
                "{p.text}"
              </p>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 shrink-0 mt-0.5" />
            </div>
          ))}
        </div>
      </section>

      {/* Creator Profile & Vision Banner */}
      <section className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900/60 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-purple-400" />
            <span>{isHi ? 'निर्माता परिचय' : 'Creator Spotlight'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {isHi
              ? 'आदित्य अशोक बाघ (Aditya Ashok Bagh) द्वारा निर्मित'
              : 'Architected by Aditya Ashok Bagh'}
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            {isHi
              ? 'AAB AI का उद्देश्य भारतीय उपयोगकर्ताओं और दुनिया भर के रचनाकारों को बिना किसी जटिलता के अत्याधुनिक आर्टिफिशियल इंटेलिजेंस की शक्तियाँ हिंदी और अंग्रेजी में उपलब्ध कराना है।'
              : 'AAB AI is dedicated to empowering creators and mobile users with advanced artificial intelligence in Hindi and English with zero barriers.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="text-center px-4 py-2 rounded-xl bg-purple-900/40 border border-purple-500/20">
            <div className="text-lg font-black text-purple-300">5 in 1</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              {isHi ? 'एआई टूल्स' : 'AI Engines'}
            </div>
          </div>
          <div className="text-center px-4 py-2 rounded-xl bg-indigo-900/40 border border-indigo-500/20">
            <div className="text-lg font-black text-indigo-300">100%</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              {isHi ? 'मुफ्त पहुंच' : 'Free Access'}
            </div>
          </div>
          <div className="text-center px-4 py-2 rounded-xl bg-blue-900/40 border border-blue-500/20">
            <div className="text-lg font-black text-cyan-300">हिंदी</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              {isHi ? 'प्रथम भाषा' : 'Primary Lang'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
