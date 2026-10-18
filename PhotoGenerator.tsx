import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Copy,
  Check,
  Maximize2,
  RefreshCw,
  Palette,
  Ratio,
  Compass,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { GeneratedImage } from '../types';

interface PhotoGeneratorProps {
  language: 'hi' | 'en';
}

export const PhotoGenerator: React.FC<PhotoGeneratorProps> = ({ language }) => {
  const isHi = language === 'hi';

  const [prompt, setPrompt] = useState('भविष्य का डिजिटल भारत, नीयन रोशनी, उड़ती गाड़ियां और रोबोट, 8k सिनेमैटिक');
  const [style, setStyle] = useState('photorealistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [copied, setCopied] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const styles = [
    { id: 'photorealistic', labelHi: 'यथार्थवादी (Photorealistic 8K)', icon: '📸' },
    { id: 'cyberpunk', labelHi: 'साइबरपंक नीयन (Cyberpunk Neon)', icon: '⚡' },
    { id: '3d_render', labelHi: '3D एनिमेशन (3D Render/Pixar)', icon: '🎨' },
    { id: 'anime', labelHi: 'एनीमे / मांगा (Anime Studio)', icon: '✨' },
    { id: 'cinematic', labelHi: 'सिनेमैटिक (Cinematic Movie Shot)', icon: '🎬' },
    { id: 'indian_epic', labelHi: 'भारतीय ऐतिहासिक / राजसी (Indian Royal Epic)', icon: '👑' },
  ];

  const aspectRatios = [
    { id: '1:1', label: '1:1 (वर्ग / Post)', desc: 'Instagram' },
    { id: '16:9', label: '16:9 (लैंडस्केप)', desc: 'YouTube' },
    { id: '9:16', label: '9:16 (पोर्ट्रेट)', desc: 'Mobile/Reel' },
    { id: '4:3', label: '4:3 (क्लासिक)', desc: 'Tablet' },
  ];

  const samplePrompts = [
    {
      titleHi: 'भविष्य का साइबर भारत',
      textHi: 'वर्ष 2090 का साइबरपंक भारत, नीयन रोशनी, उड़ती गाड़ियां, हाई-टेक मंदिर, 8k सिनेमैटिक',
      style: 'cyberpunk',
      ratio: '16:9',
    },
    {
      titleHi: 'पहाड़ी मंदिर और सूर्यास्त',
      textHi: 'हिमालय की चोटी पर स्थित प्राचीन भारतीय मंदिर, सूर्यास्त की सुनहरी किरणें, बादल और शांत वातावरण, फोटोरियलिस्टिक',
      style: 'photorealistic',
      ratio: '1:1',
    },
    {
      titleHi: 'नन्हा रोबोट और गिलहरी',
      textHi: 'एक प्यारा नन्हा चमकदार रोबोट जो बगीचे में एक गिलहरी को मूंगफली खिला रहा है, 3D पिक्सार शैली',
      style: '3d_render',
      ratio: '1:1',
    },
    {
      titleHi: 'अंतरिक्ष योद्धा',
      textHi: 'गहरे अंतरिक्ष में उड़ता हुआ भविष्य का भारतीय अंतरिक्ष यात्री, चमकता कवच, सितारे और नेबुला, सिनेमैटिक',
      style: 'cinematic',
      ratio: '9:16',
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        const newImg: GeneratedImage = {
          id: Date.now().toString(),
          imageUrl: data.imageUrl,
          prompt: prompt.trim(),
          enhancedPrompt: data.enhancedPrompt,
          style: data.style,
          aspectRatio: data.aspectRatio,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          seed: data.seed,
        };
        setCurrentImage(newImg);
        setGallery((prev) => [newImg, ...prev]);
      }
    } catch (err) {
      console.error('Image generate error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      // Direct download or open in high-res tab
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `AAB_AI_Art_${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      // Fallback
      window.open(url, '_blank');
    }
  };

  const handleCopyPrompt = (p: string) => {
    navigator.clipboard.writeText(p);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8">
      {/* Header */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-600/30">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isHi ? 'AI फोटो जनरेटर' : 'AI Photo Generator'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                8K Ultra HD
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {isHi
                ? 'आदित्य अशोक बाघ द्वारा प्रस्तुत असीमित फ्री टेक्स्ट-टू-इमेज जनरेटर'
                : 'Unlimited free high-fidelity text-to-image engine by Aditya Ashok Bagh'}
            </p>
          </div>
        </div>

        {/* Free API engine badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{isHi ? '100% फ्री न्यूरल इंजन' : '100% Free Neural Engine'}</span>
        </div>
      </div>

      {/* Preset Inspiration Pills */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-purple-400" />
          <span>{isHi ? 'त्वरित कला विचार (क्लिक करके बनाएं)' : 'Inspiration Prompts (Click to Use)'}</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {samplePrompts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(sp.textHi);
                setStyle(sp.style);
                setAspectRatio(sp.ratio);
              }}
              className="text-left p-3 rounded-xl bg-slate-900/60 hover:bg-pink-950/30 border border-slate-800 hover:border-pink-500/30 transition-all text-xs group"
            >
              <div className="font-bold text-white group-hover:text-pink-300 mb-0.5">
                {sp.titleHi}
              </div>
              <p className="text-[11px] text-slate-400 truncate">{sp.textHi}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Form */}
      <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-purple-500/20 space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              {isHi ? 'अपनी पसंद का दृश्य लिखें (हिंदी या अंग्रेजी में)' : 'Describe Your Visual (Hindi or English)'} *
            </label>
            <span className="text-[11px] text-slate-400">
              {isHi ? 'विस्तारपूर्वक विवरण बेहतर परिणाम देता है' : 'Descriptive prompts yield best results'}
            </span>
          </div>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="जैसे: नीयन रोशनी से जगमगाता भविष्य का भारतीय शहर, बादलों में तैरती गाड़ियां, 8k यथार्थवादी कला..."
            className="w-full rounded-xl bg-slate-900/80 border border-purple-500/30 p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-400 resize-none"
          />
        </div>

        {/* Style selection */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-pink-400" />
            <span>{isHi ? 'कला की शैली (Art Style)' : 'Visual Style'}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {styles.map((s) => {
              const isSelected = style === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 border-pink-400 text-white shadow-md shadow-pink-600/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{s.icon}</span>
                  <span className="truncate">{s.labelHi}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Ratio className="w-4 h-4 text-purple-400" />
            <span>{isHi ? 'पहलू अनुपात (Aspect Ratio)' : 'Aspect Ratio'}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {aspectRatios.map((r) => {
              const isSelected = aspectRatio === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setAspectRatio(r.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold">{r.label}</div>
                  <div className="text-[10px] opacity-75">{r.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || loading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{isHi ? 'तस्वीर बनाई जा रही है... (5-8 सेकंड)' : 'Synthesizing 8K Artwork...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>{isHi ? '✨ AI फोटो जनरेट करें (निःशुल्क)' : '✨ Generate AI Artwork (Free)'}</span>
            </>
          )}
        </button>
      </div>

      {/* Current Result Showcase */}
      {currentImage && (
        <div className="glass-card rounded-3xl p-5 sm:p-7 border border-pink-500/30 space-y-4 shadow-2xl shadow-purple-950/40 animate-in fade-in-50 duration-300">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              {currentImage.style} • {currentImage.aspectRatio}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownload(currentImage.imageUrl)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-pink-600/30 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isHi ? 'डाउनलोड करें' : 'Download'}</span>
              </button>
              <button
                onClick={() => setFullscreenImage(currentImage.imageUrl)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                title="फुलस्क्रीन देखें"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Generated Image Frame */}
          <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-purple-500/20 flex items-center justify-center group">
            <img
              src={currentImage.imageUrl}
              alt={currentImage.prompt}
              className="w-full h-auto max-h-[520px] object-contain rounded-2xl"
              loading="lazy"
            />
          </div>

          {/* Prompt details */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start justify-between gap-3">
            <p className="line-clamp-2">
              <span className="font-bold text-pink-300">प्रॉम्प्ट: </span>
              {currentImage.prompt}
            </p>
            <button
              onClick={() => handleCopyPrompt(currentImage.prompt)}
              className="p-1 text-slate-400 hover:text-white shrink-0"
              title="प्रॉम्प्ट कॉपी करें"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Gallery of Recent Generations */}
      {gallery.length > 1 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-400" />
            <span>{isHi ? 'हाल ही में जनरेट की गई कलाकृतियाँ' : 'Recent Creations'}</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {gallery.slice(1, 7).map((item) => (
              <div
                key={item.id}
                onClick={() => setCurrentImage(item)}
                className="relative rounded-xl overflow-hidden aspect-square border border-slate-800 hover:border-pink-500/50 cursor-pointer group transition-all"
              >
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                  <p className="text-[10px] text-white line-clamp-1">{item.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen modal */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen preview"
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
