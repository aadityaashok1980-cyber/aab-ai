import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Video,
  Share2,
  Mail,
  UserCheck,
  Megaphone,
  Hash,
  Lightbulb,
} from 'lucide-react';
import { ContentResult } from '../types';

interface ContentWriterProps {
  language: 'hi' | 'en';
}

export const ContentWriter: React.FC<ContentWriterProps> = ({ language }) => {
  const isHi = language === 'hi';

  const [type, setType] = useState('youtube');
  const [topic, setTopic] = useState('2026 में YouTube चैनल कैसे शुरू करें और सफल हों');
  const [tone, setTone] = useState('inspiring');
  const [contentLang, setContentLang] = useState<'hi' | 'hinglish' | 'en'>('hi');
  const [keywords, setKeywords] = useState('YouTube tips, video editing, subscriber growth');
  const [targetAudience, setTargetAudience] = useState('युवा क्रिएटर्स और नए यूट्यूबर्स');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentResult | null>(null);
  const [copied, setCopied] = useState(false);

  const contentTypes = [
    {
      id: 'youtube',
      labelHi: 'YouTube वीडियो स्क्रिप्ट',
      labelEn: 'YouTube Script',
      icon: Video,
      desc: 'Hook, body breakdown, and viewer CTA',
    },
    {
      id: 'blog',
      labelHi: 'SEO ब्लॉग / आर्टिकल',
      labelEn: 'SEO Blog Post',
      icon: FileText,
      desc: 'Rankable headings and comprehensive sections',
    },
    {
      id: 'instagram',
      labelHi: 'इंस्टाग्राम / रील्स कैप्शन',
      labelEn: 'Instagram / Reel Captions',
      icon: Share2,
      desc: 'Catchy captions with trending hashtags',
    },
    {
      id: 'email',
      labelHi: 'प्रोफेशनल फॉर्मल ईमेल',
      labelEn: 'Professional Email',
      icon: Mail,
      desc: 'Polite corporate and client communications',
    },
    {
      id: 'bio',
      labelHi: 'लिंक्डइन / रिज्यूमे बायो',
      labelEn: 'LinkedIn / Resume Bio',
      icon: UserCheck,
      desc: 'High-impact personal branding summary',
    },
    {
      id: 'ad',
      labelHi: 'विज्ञापन / सेल्स कॉपी (Ad Copy)',
      labelEn: 'High-Converting Ad Copy',
      icon: Megaphone,
      desc: 'Persuasive hooks and direct call to actions',
    },
  ];

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          topic: topic.trim(),
          tone,
          language: contentLang,
          keywords,
          targetAudience,
        }),
      });

      const data = await res.json();
      if (data.data) {
        setResult(data.data);
      }
    } catch (err) {
      console.error('Content generate error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `${result.title}\n\nHook: ${result.hook}\n\n${result.sections
      .map((s) => `${s.heading}\n${s.body}`)
      .join('\n\n')}\n\nCTA: ${result.callToAction}\n\nTags: ${result.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8">
      {/* Header */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isHi ? 'AI डिजिटल कंटेंट राइटर' : 'AI Content Writer'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {isHi ? 'मल्टी-फॉर्मेट' : 'Multi-Format'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {isHi
                ? 'आदित्य अशोक बाघ द्वारा प्रस्तुत डिजिटल क्रिएटर्स के लिए संपूर्ण लेखन टूल'
                : 'Digital copywriting engine architected by Aditya Ashok Bagh'}
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>निःशुल्क जनरेशन</span>
        </span>
      </div>

      {/* Content Type Selector */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-semibold text-slate-200">
          {isHi ? 'कंटेंट का प्रकार चुनें:' : 'Select Content Format:'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {contentTypes.map((t) => {
            const Icon = t.icon;
            const isSelected = type === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border-cyan-400 text-white shadow-md shadow-cyan-600/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Icon
                    className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}
                  />
                  {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                </div>
                <div className="text-xs sm:text-sm font-bold truncate">
                  {isHi ? t.labelHi : t.labelEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Options Form */}
      <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-purple-500/20 space-y-4">
        {/* Topic Input */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-semibold text-slate-200">
            {isHi ? 'कंटेंट का मुख्य विषय या टाइटल' : 'Topic or Headline'} *
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="जैसे: नई कार खरीदने से पहले 5 बातें, YouTube चैनल की सफलता का राज..."
            className="w-full rounded-xl bg-slate-900/80 border border-purple-500/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Language Selection */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              {isHi ? 'भाषा (Language)' : 'Output Language'}
            </label>
            <select
              value={contentLang}
              onChange={(e) => setContentLang(e.target.value as any)}
              className="w-full rounded-xl bg-slate-900/80 border border-purple-500/30 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="hi" className="bg-slate-900">
                हिंदी (Hindi)
              </option>
              <option value="hinglish" className="bg-slate-900">
                हिंग्लिश (Hinglish)
              </option>
              <option value="en" className="bg-slate-900">
                English (अंग्रेजी)
              </option>
            </select>
          </div>

          {/* Tone */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              {isHi ? 'टोन / शैली (Tone)' : 'Tone'}
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-xl bg-slate-900/80 border border-purple-500/30 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="inspiring" className="bg-slate-900">
                प्रेरणादायक (Inspiring)
              </option>
              <option value="professional" className="bg-slate-900">
                व्यावसायिक (Professional)
              </option>
              <option value="casual" className="bg-slate-900">
                मित्रवत (Casual & Friendly)
              </option>
              <option value="persuasive" className="bg-slate-900">
                प्रभावशाली (Persuasive)
              </option>
              <option value="educational" className="bg-slate-900">
                शैक्षणिक (Educational)
              </option>
            </select>
          </div>

          {/* Target Audience */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              {isHi ? 'लक्षित दर्शक (Audience)' : 'Target Audience'}
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="जैसे: युवा, छात्र, पेशेवर..."
              className="w-full rounded-xl bg-slate-900/80 border border-purple-500/30 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-semibold text-slate-200">
            {isHi ? 'कीवर्ड्स (वैकल्पिक)' : 'Keywords (Optional)'}
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="कमाई, तकनीक, वायरल टिप्स..."
            className="w-full rounded-xl bg-slate-900/80 border border-purple-500/30 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>{isHi ? 'कंटेंट लिखा जा रहा है...' : 'Crafting Content...'}</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>{isHi ? '✨ संपूर्ण कंटेंट जनरेट करें' : '✨ Generate Content'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Result */}
      {result && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/30 space-y-6 shadow-2xl shadow-purple-950/40">
          {/* Top Title & Copy */}
          <div className="flex items-start justify-between gap-4 border-b border-purple-500/20 pb-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                शीर्षक / Headline
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {result.title}
              </h3>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shrink-0 border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
            </button>
          </div>

          {/* Hook */}
          {result.hook && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-purple-950/40 border border-blue-500/30">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-1">
                🎣 ओपनिंग हुक (Attention Hook):
              </span>
              <p className="text-sm sm:text-base text-slate-100 font-medium">
                "{result.hook}"
              </p>
            </div>
          )}

          {/* Main Sections */}
          <div className="space-y-5">
            {result.sections.map((sec, i) => (
              <div key={i} className="space-y-1.5">
                <h4 className="text-base sm:text-lg font-bold text-purple-300">
                  {sec.heading}
                </h4>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          {result.callToAction && (
            <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-500/30">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1">
                📢 कॉल-टू-एक्शन (Call to Action):
              </span>
              <p className="text-sm sm:text-base text-white font-medium">
                {result.callToAction}
              </p>
            </div>
          )}

          {/* Hashtags */}
          {result.hashtags && result.hashtags.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                <span>ट्रेंडिंग हैशटैग्स:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-xs text-cyan-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pro Tip */}
          {result.tips && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-yellow-950/20 border border-yellow-500/20 text-xs text-yellow-200/90">
              <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <span>{result.tips}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
