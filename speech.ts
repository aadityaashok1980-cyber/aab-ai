// Speech Synthesis helper for Hindi & English voice playback
export const speakText = (
  text: string,
  language: 'hi' | 'en' = 'hi',
  onEnd?: () => void
): (() => void) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return () => {};
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean text from markdown symbols
  const clean = text
    .replace(/[#*`_~\[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) return () => {};

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  // Try to find a Hindi voice if requested
  const voices = window.speechSynthesis.getVoices();
  if (language === 'hi') {
    const hindiVoice = voices.find((v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.lang.includes('IN'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
      utterance.lang = hindiVoice.lang;
    } else {
      utterance.lang = 'hi-IN';
    }
  } else {
    const engVoice = voices.find((v) => v.lang.startsWith('en'));
    if (engVoice) {
      utterance.voice = engVoice;
      utterance.lang = engVoice.lang;
    } else {
      utterance.lang = 'en-US';
    }
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
