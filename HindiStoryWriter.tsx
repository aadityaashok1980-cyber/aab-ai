import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Download,
  RotateCcw,
  Users,
  Award,
  Clock,
  Compass,
  Bookmark,
  BookMarked,
} from 'lucide-react';
import { HindiStory } from '../types';
import { speakText, stopSpeech } from '../utils/speech';

interface HindiStoryWriterProps {
  language: 'hi' | 'en';
}

export const HindiStoryWriter: React.FC<HindiStoryWriterProps> = ({ language }) => {
  const isHi = language === 'hi';

  const [topic, setTopic] = useState('ईमानदार बालक और सोने का सिक्का');
  const [genre, setGenre] = useState('प्रेरणादायक');
  const [moral, setMoral] = useState('सच्चाई और ईमानदारी से बड़ी कोई दौलत नहीं');
  const [characters, setCharacters] = useState('आर्यन (एक गरीब लेकिन कर्मठ छात्र), मोहन (दुकानदार)');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');

  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<HindiStory | null>(null);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const genres = [
    { id: 'प्रेरणादायक', labelHi: 'प्रेरणादायक (Moral/Inspirational)', icon: '🌟' },
    { id: 'बाल कथा', labelHi: 'बाल कथा (Children Story)', icon: '🧸' },
    { id: 'पौराणिक एवं ऐतिहासिक', labelHi: 'पौराणिक / ऐतिहासिक (Mythological)', icon: '🛕' },
    { id: 'विज्ञान कथा', labelHi: 'विज्ञान कथा (Sci-Fi / Futuristic)', icon: '🚀' },
    { id: 'रहस्य एवं रोमांच', labelHi: 'रहस्य एवं रोमांच (Mystery/Adventure)', icon: '🔍' },
    { id: 'हास्य एवं व्यंग्य', labelHi: 'हास्य एवं व्यंग्य (Comedy/Humor)', icon: '😄' },
  ];

  const presets = [
    {
      topic: 'ईमानदार बालक और सोने का सिक्का',
      genre: 'प्रेरणादायक',
      characters: 'आर्यन (छात्र), मोहन (दुकानदार)',
      moral: 'सच्चाई और ईमानदारी ही मनुष्य का सबसे बड़ा धन है।',
    },
    {
      topic: 'पहाड़ों की गुप्त गुफा और जादुई नीलम',
      genre: 'रहस्य एवं रोमांच',
      characters: 'विक्रम (साहसी खोजकर्ता), माया (पहाड़ी गाइड)',
      moral: 'लोभ विनाश का कारण है, संतुष्टि ही सच्चा सुख है।',
    },
    {
      topic: 'वर्ष 2090 का साइबर बनारस और नन्हा रोबोट चिन्नू',
      genre: 'विज्ञान कथा',
      characters: 'चिन्नू (रोबोट), पंडित रामप्रसाद',
      moral: 'तकनीक कितनी भी विकसित हो जाए, मानवीय प्रेम और संस्कार हमेशा सर्वोपरि रहेंगे।',
    },
    {
      topic: 'चतुर खरगोश और अहंकारी राजा',
      genre: 'बाल कथा',
      characters: 'चीकू (खरगोश), शेर सिंह (वनराज)',
      moral: 'बुद्धि और सूझबूझ से बड़े से बड़ा संकट भी टाला जा सकता है।',
    },
  ];

  const handleGenerateStory = async () => {
    if (!topic.trim() || loading) return;

    stopSpeech();
    setSpeaking(false);
    setLoading(true);

    try {
      const res = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          genre,
          moral,
          characters,
          length,
          language: 'hi',
        }),
      });

      const json = await res.json();
      if (json.data) {
        setStory(json.data);
      }
    } catch (err) {
      console.error('Story generate error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakStory = () => {
    if (!story) return;
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      const fullText = `${story.title}। ${story.synopsis}। ${story.storyParagraphs.join(' ')}। कहानी की सीख: ${story.moral}`;
      speakText(fullText, 'hi', () => {
        setSpeaking(false);
      });
    }
  };

  const handleCopyStory = () => {
    if (!story) return;
    const fullText = `शीर्षक: ${story.title}\nशैली: ${story.genre}\n\nमुख्य पात्र:\n${story.characters.join('\n')}\n\nसारांश:\n${story.synopsis}\n\nकहानी:\n${story.storyParagraphs.join('\n\n')}\n\nसीख (Moral):\n${story.moral}\n\n---\nAAB AI हिंदी कहानी लेखक (निर्माता: आदित्य अशोक बाघ)`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadStory = () => {
    if (!story) return;
    const fullText = `शीर्षक: ${story.title}\nशैली: ${story.genre}\n\nमुख्य पात्र:\n${story.characters.join('\n')}\n\nसारांश:\n${story.synopsis}\n\nकहानी:\n${story.storyParagraphs.join('\n\n')}\n\nसीख:\n${story.moral}\n\n---\nजनरेट किया गया: AAB AI (Aditya Ashok Bagh)`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${story.title.replace(/\s+/g, '_')}_AAB_AI.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8">
      {/* Title & Badge */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isHi ? 'AI हिंदी कहानी लेखक' : 'AI Hindi Story Writer'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                {isHi ? 'शुद्ध हिंदी' : 'Pure Hindi'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {isHi
                ? 'आदित्य अशोक बाघ द्वारा तैयार किया गया सांस्कृतिक एवं नैतिक कहानी रचनाकार'
                : 'Cultural & moral Hindi story generator crafted by Aditya Ashok Bagh'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>100% फ्री इंजन</span>
          </span>
        </div>
      </div>

      {/* Preset Story Ideas */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-purple-400" />
          <span>{isHi ? 'लोकप्रिय विषय (एक क्लिक में चुनें)' : 'Popular Presets (1-Click)'}</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTopic(p.topic);
                setGenre(p.genre);
                setCharacters(p.characters);
                setMoral(p.moral);
              }}
              className="text-left p-3 rounded-xl bg-slate-900/60 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 transition-all text-xs text-slate-300 group"
            >
              <div className="font-bold text-white group-hover:text-purple-300 mb-1 flex items-center justify-between">
                <span>{p.topic}</span>
                <span className="text-[10px] text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded">
                  {p.genre}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">सीख: {p.moral}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Story Configuration Form */}
      <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-purple-500/20 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Topic */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              {isHi ? 'कहानी का विषय या केंद्रीय विचार' : 'Story Topic or Theme'} *
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="जैसे: सच्चा मित्र, अंतरिक्ष यात्रा, एक गरीब किसान का संघर्ष..."
              className="w-full rounded-xl bg-slate-900/80 border border-purple-500/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Genre */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              {isHi ? 'कहानी की शैली (Genre)' : 'Story Genre'}
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full rounded-xl bg-slate-900/80 border border-purple-500/30 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
            >
              {genres.map((g) => (
                <option key={g.id} value={g.id} className="bg-slate-900 text-white">
                  {g.icon} {g.labelHi}
                </option>
              ))}
            </select>
          </div>

          {/* Length */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              {isHi ? 'कहानी का आकार (Story Length)' : 'Story Length'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['short', 'medium', 'long'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLength(l)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    length === l
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {l === 'short'
                    ? isHi ? 'लघु (300 शब्द)' : 'Short (300w)'
                    : l === 'medium'
                    ? isHi ? 'मध्यम (600 शब्द)' : 'Medium (600w)'
                    : isHi ? 'दीर्घ (1000 शब्द)' : 'Long (1000w)'}
                </button>
              ))}
            </div>
          </div>

          {/* Main Characters */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              {isHi ? 'मुख्य पात्र (Characters)' : 'Main Characters'}
            </label>
            <input
              type="text"
              value={characters}
              onChange={(e) => setCharacters(e.target.value)}
              placeholder="जैसे: राहुल (बालक), बूढ़ा साधु, नटखट तोता..."
              className="w-full rounded-xl bg-slate-900/80 border border-purple-500/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Moral */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              {isHi ? 'कहानी की मुख्य सीख (Moral Lesson)' : 'Key Moral Lesson'}
            </label>
            <input
              type="text"
              value={moral}
              onChange={(e) => setMoral(e.target.value)}
              placeholder="जैसे: सच्चाई की जीत होती है, एकता में बल है..."
              className="w-full rounded-xl bg-slate-900/80 border border-purple-500/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            onClick={handleGenerateStory}
            disabled={!topic.trim() || loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>{isHi ? 'कहानी रची जा रही है... कृपया प्रतीक्षा करें' : 'Crafting Hindi Story...'}</span>
              </>
            ) : (
              <>
                <BookOpen className="w-5 h-5" />
                <span>{isHi ? '✨ संपूर्ण हिंदी कहानी लिखें' : '✨ Generate Hindi Story'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Story Display */}
      {story && (
        <div className="glass-card rounded-3xl p-6 sm:p-9 border border-purple-500/30 space-y-6 shadow-2xl shadow-purple-950/40 animate-in fade-in-50 duration-300">
          {/* Story Header */}
          <div className="border-b border-purple-500/20 pb-5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {story.genre}
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{story.readingTimeMinutes} मिनट का वाचन</span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 leading-tight">
              {story.title}
            </h3>

            {/* Synopsis */}
            <p className="text-sm sm:text-base text-purple-200/90 italic bg-purple-950/40 p-3 rounded-xl border-l-4 border-purple-500">
              "{story.synopsis}"
            </p>
          </div>

          {/* Characters Cards */}
          {story.characters && story.characters.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>मुख्य पात्र</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {story.characters.map((c, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-pink-500" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Story Narrative Paragraphs */}
          <div className="space-y-4 pt-2">
            {story.storyParagraphs.map((para, idx) => (
              <p
                key={idx}
                className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal tracking-wide text-justify indent-6"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Moral Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/40 flex items-start gap-3 shadow-lg">
            <Award className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                कहानी की सीख (Moral Lesson):
              </span>
              <p className="text-sm sm:text-base font-semibold text-white mt-0.5">
                {story.moral}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-purple-500/20">
            <button
              onClick={handleSpeakStory}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                speaking
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                  : 'bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/30'
              }`}
            >
              {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{speaking ? 'वाचन रोकें' : 'कहानी सुनें (Audio)'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyStory}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'कॉपी हो गई' : 'कॉपी करें'}</span>
              </button>

              <button
                onClick={handleDownloadStory}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>डाउनलोड (.txt)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
