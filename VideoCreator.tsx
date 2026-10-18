import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Copy,
  Check,
  Film,
  Camera,
  Layers,
  Info,
  Clock,
  Radio,
  Share2,
} from 'lucide-react';
import { VideoProject, VideoScene } from '../types';
import { speakText, stopSpeech } from '../utils/speech';

interface VideoCreatorProps {
  language: 'hi' | 'en';
}

export const VideoCreator: React.FC<VideoCreatorProps> = ({ language }) => {
  const isHi = language === 'hi';

  const [topic, setTopic] = useState('भारत का अंतरिक्ष मिशन: चंद्रयान से गगनयान तक');
  const [style, setStyle] = useState('cinematic');
  const [durationSeconds, setDurationSeconds] = useState(30);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [videoLang, setVideoLang] = useState<'hi' | 'en'>('hi');

  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<VideoProject | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [audioVoiceoverEnabled, setAudioVoiceoverEnabled] = useState(true);
  const [copied, setCopied] = useState(false);

  const timerRef = useRef<any>(null);

  const styles = [
    { id: 'cinematic', labelHi: 'सिनेमैटिक फ़िल्म (Cinematic Film)' },
    { id: 'documentary', labelHi: 'डॉक्यूमेंट्री (Epic Documentary)' },
    { id: 'futuristic', labelHi: 'साइ-फ़ाई / नीयन (Sci-Fi Futuristic)' },
    { id: 'advertisement', labelHi: 'आकर्षक विज्ञापन (High-Energy Ad)' },
  ];

  const presets = [
    {
      topic: 'भारत का अंतरिक्ष मिशन: चंद्रयान से गगनयान तक',
      style: 'cinematic',
      duration: 30,
    },
    {
      topic: '2050 में एआई और मानव जीवन: एक दिन की झलक',
      style: 'futuristic',
      duration: 30,
    },
    {
      topic: 'प्राचीन भारतीय योग और आधुनिक विज्ञान का संगम',
      style: 'documentary',
      duration: 30,
    },
    {
      topic: 'सफलता की राह: कभी हार न मानने का संकल्प',
      style: 'cinematic',
      duration: 15,
    },
  ];

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return;

    // Reset player
    stopSpeech();
    setIsPlaying(false);
    setCurrentSceneIdx(0);
    setSceneProgress(0);
    setLoading(true);

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          style,
          durationSeconds,
          aspectRatio,
          language: videoLang,
        }),
      });

      const data = await res.json();
      if (data.data) {
        setProject(data.data);
      }
    } catch (err) {
      console.error('Video creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Playback simulation engine
  useEffect(() => {
    if (!isPlaying || !project || !project.scenes.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const currentScene = project.scenes[currentSceneIdx];
    const sceneDur = (currentScene?.duration || 6) * 1000;
    const intervalTime = 100;
    const step = (intervalTime / sceneDur) * 100;

    // Trigger voiceover at beginning of scene
    if (audioVoiceoverEnabled && currentScene?.voiceover) {
      speakText(currentScene.voiceover, videoLang);
    }

    timerRef.current = setInterval(() => {
      setSceneProgress((prev) => {
        if (prev >= 100) {
          // Advance to next scene or loop
          if (currentSceneIdx < project.scenes.length - 1) {
            setCurrentSceneIdx((curr) => curr + 1);
            return 0;
          } else {
            setIsPlaying(false);
            stopSpeech();
            return 100;
          }
        }
        return prev + step;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSceneIdx, project, audioVoiceoverEnabled, videoLang]);

  const togglePlay = () => {
    if (!project) return;
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeech();
    } else {
      if (sceneProgress >= 100 && currentSceneIdx >= project.scenes.length - 1) {
        setCurrentSceneIdx(0);
        setSceneProgress(0);
      }
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    stopSpeech();
    setIsPlaying(false);
    setCurrentSceneIdx(0);
    setSceneProgress(0);
  };

  const handleCopyScript = () => {
    if (!project) return;
    const script = `शीर्षक: ${project.title}\nलॉगलाइन: ${project.logline}\nमूड: ${project.mood}\nसंगीत सुझाव: ${project.backgroundMusicSuggestion}\n\nदृश्य विवरण (Scenes):\n${project.scenes
      .map(
        (s) =>
          `[दृश्य ${s.sceneNumber}] (${s.duration}s - ${s.shotType})\nविजुअल: ${s.visualDescription}\nसंवाद/वॉइसओवर: "${s.voiceover}"\nSFX: ${s.sfx}\nकैमरा: ${s.cameraMotion}`
      )
      .join('\n\n')}\n\n---\nनिर्माता: ${project.creatorSignature}`;
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentScene = project?.scenes[currentSceneIdx];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8">
      {/* Header */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isHi ? 'AI वीडियो क्रिएटर स्टूडियो' : 'AI Video Creator Studio'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                PRO Studio
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {isHi
                ? 'आदित्य अशोक बाघ द्वारा प्रस्तुत संपूर्ण मल्टी-सीन वीडियो एवं स्टोरीबोर्ड जनरेटर'
                : 'Cinematic storyboard director & interactive simulator by Aditya Ashok Bagh'}
            </p>
          </div>
        </div>

        {/* Identification of API Badge */}
        <div className="flex flex-col sm:items-end gap-1">
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>लाइव सिमुलेशन प्लेयर सक्रिय</span>
          </span>
          <span className="text-[10px] text-slate-400">
            Veo / External Video API Ready
          </span>
        </div>
      </div>

      {/* Preset Ideas */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-purple-400" />
          <span>{isHi ? 'लोकप्रिय वीडियो विचार (क्लिक करें)' : 'Trending Video Concepts'}</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTopic(p.topic);
                setStyle(p.style);
                setDurationSeconds(p.duration);
              }}
              className="text-left p-3 rounded-xl bg-slate-900/60 hover:bg-purple-950/30 border border-slate-800 hover:border-purple-500/30 transition-all text-xs group"
            >
              <div className="font-bold text-white group-hover:text-purple-300 mb-0.5">
                {p.topic}
              </div>
              <div className="text-[11px] text-slate-400">{p.duration}s • {p.style}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Video Generation Config Form */}
      <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-purple-500/20 space-y-4">
        {/* Topic Input */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-semibold text-slate-200">
            {isHi ? 'वीडियो का विषय या स्क्रिप्ट आइडिया' : 'Video Concept or Title'} *
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="जैसे: भारत का गगनयान मिशन, एआई का भविष्य, सफलता की सच्ची कहानी..."
            className="w-full rounded-xl bg-slate-900/80 border border-purple-500/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Style */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              {isHi ? 'वीडियो शैली (Style)' : 'Video Style'}
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-xl bg-slate-900/80 border border-purple-500/30 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
            >
              {styles.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900">
                  {s.labelHi}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              {isHi ? 'अवधि (Duration)' : 'Duration'}
            </label>
            <select
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(parseInt(e.target.value, 10))}
              className="w-full rounded-xl bg-slate-900/80 border border-purple-500/30 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
            >
              <option value={15} className="bg-slate-900">15 सेकंड (Reel / Short)</option>
              <option value={30} className="bg-slate-900">30 सेकंड (Commercial)</option>
              <option value={45} className="bg-slate-900">45 सेकंड (Story Preview)</option>
              <option value={60} className="bg-slate-900">60 सेकंड (Full Trailer)</option>
            </select>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              {isHi ? 'पहलू अनुपात (Ratio)' : 'Aspect Ratio'}
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full rounded-xl bg-slate-900/80 border border-purple-500/30 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
            >
              <option value="16:9" className="bg-slate-900">16:9 (YouTube / TV)</option>
              <option value="9:16" className="bg-slate-900">9:16 (Reels / Shorts / Android)</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>{isHi ? 'वीडियो स्टोरीबोर्ड एवं दृश्य रचे जा रहे हैं...' : 'Directing Video Project...'}</span>
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                <span>{isHi ? '✨ संपूर्ण AI वीडियो प्रोजेक्ट बनाएं' : '✨ Generate AI Video Project'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Video Player & Project Showcase */}
      {project && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Main Video Screen Player Simulator */}
          <div className="glass-card rounded-3xl p-4 sm:p-6 border border-purple-500/30 space-y-4 shadow-2xl shadow-purple-950/40">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                  {project.mood} • {project.aspectRatio} • {project.totalDurationSeconds}s
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">{project.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAudioVoiceoverEnabled(!audioVoiceoverEnabled)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    audioVoiceoverEnabled
                      ? 'bg-purple-900/60 text-purple-200 border-purple-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title={audioVoiceoverEnabled ? 'आवाज चालू है' : 'आवाज बंद है'}
                >
                  {audioVoiceoverEnabled ? <Volume2 className="w-4 h-4 text-pink-400" /> : <VolumeX className="w-4 h-4" />}
                  <span className="hidden sm:inline">वॉयसओवर</span>
                </button>

                <button
                  onClick={handleCopyScript}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'कॉपी हो गया' : 'स्क्रिप्ट कॉपी'}</span>
                </button>
              </div>
            </div>

            {/* Video Viewport Frame */}
            <div
              className={`relative overflow-hidden rounded-2xl bg-black border border-purple-500/30 flex items-center justify-center mx-auto ${
                project.aspectRatio === '9:16'
                  ? 'max-w-xs aspect-[9/16]'
                  : 'w-full aspect-video'
              }`}
            >
              {currentScene && (
                <>
                  <img
                    src={currentScene.frameImageUrl}
                    alt={currentScene.visualDescription}
                    className={`w-full h-full object-cover transition-transform duration-1000 ${
                      isPlaying ? 'scale-105' : 'scale-100'
                    }`}
                  />
                  {/* Subtle cinema vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

                  {/* Top Scene Tracker */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-white drop-shadow-md">
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 font-bold">
                      दृश्य {currentScene.sceneNumber} / {project.scenes.length}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 font-medium">
                      {currentScene.shotType}
                    </span>
                  </div>

                  {/* On-screen Subtitles in Hindi */}
                  <div className="absolute bottom-6 left-4 right-4 text-center">
                    <p className="inline-block px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-purple-500/30 text-white font-semibold text-xs sm:text-sm drop-shadow-md shadow-lg leading-relaxed">
                      "{currentScene.voiceover}"
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Player Controls */}
            <div className="space-y-3 pt-2">
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 transition-all duration-100"
                    style={{
                      width: `${
                        ((currentSceneIdx + sceneProgress / 100) / project.scenes.length) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>
                    सीन {currentSceneIdx + 1}: {currentScene?.duration}s ({currentScene?.cameraMotion})
                  </span>
                  <span>कुल अवधि: {project.totalDurationSeconds}s</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleRestart}
                  className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                  title="पुनः प्रारंभ करें"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-600/40 hover:scale-105 transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                  <span>{isPlaying ? 'रोकें (Pause)' : 'वीडियो चलाएं (Play)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Scene by Scene Storyboard Cards */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>{isHi ? 'स्टोरीबोर्ड एवं सीन विवरण' : 'Storyboard Breakdown'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.scenes.map((scene, idx) => (
                <div
                  key={scene.sceneNumber}
                  onClick={() => {
                    setCurrentSceneIdx(idx);
                    setSceneProgress(0);
                    if (audioVoiceoverEnabled) {
                      speakText(scene.voiceover, videoLang);
                    }
                  }}
                  className={`p-4 rounded-2xl glass-card border transition-all cursor-pointer ${
                    currentSceneIdx === idx
                      ? 'border-purple-400 bg-purple-950/40 shadow-lg shadow-purple-900/30'
                      : 'border-slate-800 hover:border-purple-500/30'
                  }`}
                >
                  <div className="relative rounded-xl overflow-hidden aspect-video mb-3 border border-slate-700">
                    <img
                      src={scene.frameImageUrl}
                      alt={scene.visualDescription}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-bold text-white border border-white/20">
                      दृश्य {scene.sceneNumber} ({scene.duration}s)
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-purple-300 flex items-center justify-between">
                      <span>{scene.shotType}</span>
                      <span className="text-[10px] text-slate-400">{scene.cameraMotion}</span>
                    </div>

                    <p className="text-slate-300 leading-relaxed line-clamp-2">
                      {scene.visualDescription}
                    </p>

                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-pink-200">
                      <span className="font-bold text-pink-400">संवाद: </span>"{scene.voiceover}"
                    </div>

                    <div className="text-[10px] text-slate-400 truncate">
                      <span className="text-slate-500">SFX:</span> {scene.sfx}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* External Veo AI Prompt Export Card */}
          {project.veoPromptExport && (
            <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-purple-500/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Film className="w-3.5 h-3.5" />
                  <span>Google Veo / External AI Video Generator Prompt:</span>
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(project.veoPromptExport || '');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 font-mono text-[11px]">
                {project.veoPromptExport}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
