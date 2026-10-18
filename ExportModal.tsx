import React, { useState } from 'react';
import {
  X,
  Download,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Server,
  Cloud,
  Globe,
  Sparkles,
  ShieldCheck,
  FolderArchive,
  ArrowRight,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'hi' | 'en';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isHi = language === 'hi';
  const [activeTab, setActiveTab] = useState<'download' | 'render' | 'vercel' | 'commands'>('download');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const renderCommand = `npm install && npm run build\nnpm start`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] glass-card rounded-3xl border border-purple-500/40 shadow-2xl shadow-purple-950/60 flex flex-col overflow-hidden bg-[#0c0e24]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-purple-500/20 flex items-center justify-between bg-gradient-to-r from-purple-950/50 via-slate-900/60 to-blue-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>{isHi ? 'AAB AI प्रोजेक्ट एक्सपोर्ट एवं फ्री होस्टिंग' : 'Export & Free Hosting Guide'}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Free
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isHi ? 'सोर्स कोड डाउनलोड करें और वेबसाइट को मुफ्त में लाइव करें' : 'Download source files and publish for free'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center border-b border-purple-500/20 bg-slate-900/40 px-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('download')}
            className={`py-3 px-3.5 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'download'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isHi ? 'डाउनलोड ZIP' : 'Download ZIP'}</span>
          </button>

          <button
            onClick={() => setActiveTab('render')}
            className={`py-3 px-3.5 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'render'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Render (मुफ़्त)</span>
          </button>

          <button
            onClick={() => setActiveTab('vercel')}
            className={`py-3 px-3.5 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'vercel'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Vercel (मुफ़्त)</span>
          </button>

          <button
            onClick={() => setActiveTab('commands')}
            className={`py-3 px-3.5 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'commands'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{isHi ? 'लोकल रन कमांड' : 'Local Run'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-200">
          {/* TAB 1: DOWNLOAD ZIP */}
          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-blue-950/60 border border-purple-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">
                      {isHi ? 'संपूर्ण सोर्स कोड पैकेज (.zip)' : 'Full Source Code Bundle (.zip)'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {isHi
                        ? 'इसमें React, Express, Tailwind और सभी 5 AI टूल्स शामिल हैं'
                        : 'Includes React frontend, Express server, and all 5 AI features'}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                    55 KB
                  </span>
                </div>

                <a
                  href="/api/download-zip"
                  download="AAB-AI-Source-Code.zip"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isHi ? 'सोर्स कोड डाउनलोड करें (Click to Download)' : 'Download Source Code (.ZIP)'}</span>
                </a>
              </div>

              {/* Steps to export via AI Studio UI */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h5 className="font-bold text-purple-300 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{isHi ? 'Google AI Studio से एक्सपोर्ट करने के चरण:' : 'Steps to Export via AI Studio UI:'}</span>
                </h5>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-xs">
                  <li>{isHi ? 'स्क्रीन के ऊपर दाईं ओर "Export" बटन पर क्लिक करें।' : 'Click the "Export" button at the top-right of AI Studio.'}</li>
                  <li>{isHi ? '"Download ZIP" चुनें अथवा सीधे अपने GitHub अकाउंट में पुश करें।' : 'Select "Download ZIP" or push directly to your GitHub repository.'}</li>
                  <li>{isHi ? 'जिप फाइल को अपने कंप्यूटर में Extract (Unzip) करें।' : 'Extract the zip file to your local computer.'}</li>
                </ol>
              </div>

              {/* Artifacts notification */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  {isHi
                    ? 'AI Studio के "Artifacts" टैब में विस्तृत EXPORT_AND_DEPLOYMENT_GUIDE.md फ़ाइल उपलब्ध करा दी गई है।'
                    : 'A detailed EXPORT_AND_DEPLOYMENT_GUIDE.md is saved in the Artifacts tab for you.'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: RENDER HOSTING */}
          {activeTab === 'render' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200">
                {isHi
                  ? 'Render.com पर फुल-स्टैक Node + Express + React ऐप्स 100% मुफ्त में होस्ट होते हैं।'
                  : 'Render.com provides 100% free hosting for full-stack Node + Express + React applications.'}
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white text-xs">1. कोड को GitHub पर डालें</div>
                  <div className="text-slate-400 text-[11px]">
                    github.com पर नया रिपॉजिटरी बनाएं और अपना कोड पुश करें।
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white text-xs">2. Render.com पर Web Service बनाएं</div>
                  <div className="text-slate-400 text-[11px]">
                    Render पर लॉगिन करें &rarr; New Web Service चुनें &rarr; GitHub रिपॉजिटरी लिंक करें।
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-bold text-white text-xs">3. बिल्ड व स्टार्ट सेटिंग्स:</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-black/50 border border-slate-800">
                      <span className="text-slate-400 block">Build Command:</span>
                      <code className="text-cyan-300">npm install && npm run build</code>
                    </div>
                    <div className="p-2 rounded bg-black/50 border border-slate-800">
                      <span className="text-slate-400 block">Start Command:</span>
                      <code className="text-purple-300">npm start</code>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white text-xs">4. एनवायरनमेंट वेरिएबल:</div>
                  <div className="text-slate-400 text-[11px]">
                    <code className="text-yellow-300">GEMINI_API_KEY</code> = (aistudio.google.com से प्राप्त मुफ्त की)
                  </div>
                </div>
              </div>

              <a
                href="https://render.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                <span>Render.com खोलें</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* TAB 3: VERCEL HOSTING */}
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-200">
                {isHi
                  ? 'Vercel दुनिया का सबसे तेज़ और मुफ्त सर्वरलेस प्लेटफॉर्म है।'
                  : 'Vercel is the fastest free cloud platform for modern React web apps.'}
              </div>

              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                <li>
                  <span className="font-bold text-white">vercel.com पर लॉगिन करें</span> और GitHub से लिंक करें।
                </li>
                <li>
                  <span className="font-bold text-white">Add New Project</span> पर क्लिक करके अपना रिपॉजिटरी चुनें।
                </li>
                <li>
                  <span className="font-bold text-white">Environment Variables</span> में <code className="text-yellow-300">GEMINI_API_KEY</code> जोड़ें।
                </li>
                <li>
                  <span className="font-bold text-white">Deploy</span> पर क्लिक करें—1 मिनट में आपकी साइट <code className="text-cyan-300">https://aab-ai.vercel.app</code> पर लाइव हो जाएगी!
                </li>
              </ol>

              <a
                href="https://vercel.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                <span>Vercel.com खोलें</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* TAB 4: LOCAL RUN */}
          {activeTab === 'commands' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                {isHi
                  ? 'अपने कंप्यूटर (VS Code / Terminal) में चलाने के लिए निम्नलिखित कमांड्स चलाएं:'
                  : 'Run the following commands on your computer to test locally:'}
              </p>

              <div className="p-4 rounded-xl bg-black border border-slate-800 relative group font-mono text-xs">
                <pre className="text-cyan-300 whitespace-pre-wrap">
{`# 1. अनज़िप किए गए फोल्डर में जाएं
cd aab-ai

# 2. डिपेंडेंसीज इंस्टॉल करें
npm install

# 3. डेवलपमेंट सर्वर शुरू करें
npm run dev`}
                </pre>
                <button
                  onClick={() => handleCopy(`npm install\nnpm run dev`, 'cmd')}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title="कमांड कॉपी करें"
                >
                  {copiedText === 'cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>लोकल URL:</span>
                <code className="text-purple-300 font-bold">http://localhost:3000</code>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-500/20 bg-slate-900/60 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            निर्माता: <strong className="text-purple-300">आदित्य अशोक बाघ</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
          >
            {isHi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
