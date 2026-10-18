import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Info,
  RefreshCw,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { speakText, stopSpeech } from '../utils/speech';

interface ChatViewProps {
  language: 'hi' | 'en';
}

export const ChatView: React.FC<ChatViewProps> = ({ language }) => {
  const isHi = language === 'hi';

  const defaultWelcomeMessage: ChatMessage = {
    id: 'welcome',
    role: 'model',
    text: isHi
      ? `नमस्ते! मैं **AAB AI** हूँ, जिसे **आदित्य अशोक बाघ (Aditya Ashok Bagh)** द्वारा विकसित किया गया है। 🙏\n\nमैं आपकी किस प्रकार सहायता कर सकता हूँ? आप मुझसे किसी भी विषय पर हिंदी या अंग्रेजी में पूछ सकते हैं—जैसे सामान्य ज्ञान, कोडिंग, रचनात्मक विचार, गणित, या तकनीकी समस्याएं!`
      : `Hello! I am **AAB AI**, created by **Aditya Ashok Bagh**. 🙏\n\nHow can I help you today? You can ask me anything in Hindi or English—general knowledge, coding, creative ideas, science, or technical guidance!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    provider: 'AAB AI Live',
  };

  const [messages, setMessages] = useState<ChatMessage[]>([defaultWelcomeMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = isHi
    ? [
        '💡 आर्टिफिशियल इंटेलिजेंस क्या है और यह कैसे काम करता है?',
        '📜 मुझे एक छोटी और प्रेरणादायक हिंदी कहानी सुनाएं',
        '💻 React और TypeScript सीखने का सबसे अच्छा रोडमैप क्या है?',
        '🧘 तनाव मुक्त और स्वस्थ रहने के 5 अचूक नियम बताएं',
      ]
    : [
        '💡 What is Artificial Intelligence and how does it work?',
        '📜 Tell me a short inspiring motivational story',
        '💻 What is the best roadmap to learn modern Web Development?',
        '🧘 Give me 5 proven habits for peak productivity and health',
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    stopSpeech();
    setSpeakingId(null);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: historyPayload,
          language: isHi ? 'hi' : 'en',
        }),
      });

      const data = await res.json();

      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply || (isHi ? 'माफ़ कीजिए, उत्तर प्राप्त नहीं हुआ।' : 'Sorry, no response received.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: data.provider || 'AAB AI',
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: isHi
          ? 'क्षमा करें, सर्वर से संवाद में समस्या हुई। कृपया पुनः प्रयास करें।'
          : 'Sorry, could not connect to server. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'System Error',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      stopSpeech();
      setSpeakingId(null);
    } else {
      setSpeakingId(id);
      speakText(text, isHi ? 'hi' : 'en', () => {
        setSpeakingId(null);
      });
    }
  };

  const handleClear = () => {
    stopSpeech();
    setSpeakingId(null);
    setMessages([defaultWelcomeMessage]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20 lg:pb-6">
      {/* Header bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-purple-500/20 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {isHi ? 'AAB AI चैट' : 'AAB AI Chat'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {isHi ? 'हिंदी डिफ़ॉल्ट' : 'Hindi Default'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isHi
                ? 'आदित्य अशोक बाघ द्वारा संचालित बुद्धिमान संवाद इंजन'
                : 'Intelligent multi-turn AI created by Aditya Ashok Bagh'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-red-950/40 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/30 text-xs font-semibold transition-all"
            title="चैट साफ़ करें"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isHi ? 'साफ़ करें' : 'Clear'}</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-purple-500/20 min-h-[460px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs ${
                  isUser
                    ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-sm'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-sm shadow-purple-600/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 space-y-1.5 text-sm ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white rounded-tr-none shadow-md'
                    : 'bg-[#121533]/90 text-slate-200 border border-purple-500/20 rounded-tl-none shadow-md shadow-purple-950/20'
                }`}
              >
                {/* Provider badge for model */}
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 pb-1 border-b border-purple-500/10 text-[10px] text-purple-300">
                    <span className="font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      {m.provider || 'AAB AI'}
                    </span>
                    <span className="text-slate-400 text-[9px]">{m.timestamp}</span>
                  </div>
                )}

                {/* Message body */}
                <div className="whitespace-pre-wrap leading-relaxed break-words font-normal">
                  {m.text}
                </div>

                {/* Action buttons on bot messages */}
                {!isUser && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-500/10 text-slate-400">
                    <button
                      onClick={() => handleSpeak(m.id, m.text)}
                      className={`p-1 rounded-md hover:bg-slate-700/60 transition-colors ${
                        speakingId === m.id ? 'text-pink-400 bg-pink-950/40' : 'hover:text-slate-200'
                      }`}
                      title={speakingId === m.id ? 'आवाज़ बंद करें' : 'आवाज़ में सुनें'}
                    >
                      {speakingId === m.id ? (
                        <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCopy(m.id, m.text)}
                      className="p-1 rounded-md hover:bg-slate-700/60 hover:text-slate-200 transition-colors"
                      title="कॉपी करें"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 text-white">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#121533]/90 rounded-2xl rounded-tl-none px-4 py-3 border border-purple-500/20 text-slate-300 text-sm flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
              <span>{isHi ? 'AAB AI विचार कर रहा है...' : 'AAB AI is thinking...'}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q.replace(/^[^\w\s\u0900-\u097F]+/, '').trim())}
            className="shrink-0 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-purple-950/60 border border-slate-700/70 hover:border-purple-500/40 text-slate-300 hover:text-purple-200 transition-all text-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="glass-card rounded-2xl p-2 sm:p-2.5 border border-purple-500/30 flex items-center gap-2 shadow-lg shadow-purple-950/30"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isHi
              ? 'यहाँ अपना प्रश्न हिंदी या अंग्रेजी में लिखें...'
              : 'Type your message in Hindi or English...'
          }
          className="flex-1 bg-transparent px-3 py-2 text-white placeholder-slate-400 text-sm focus:outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
        >
          <span>{isHi ? 'भेजें' : 'Send'}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
