// Text-to-speech helper using browser's native Web Speech API

let currentUtterance = null;

export function speakText(text, language = 'en', onEnd = () => {}, onError = () => {}) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    onError('Speech synthesis not supported');
    return false;
  }

  // Cancel any ongoing speech
  stopSpeech();

  const utterance = new SpeechSynthesisUtterance(text);
  currentUtterance = utterance;

  // Language mapping
  utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
  utterance.rate = 0.95; // Slightly slower for clarity
  utterance.pitch = 1.0;

  // Try to find a matching natural voice
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const targetLang = language === 'hi' ? 'hi' : 'en';
    const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(targetLang));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  utterance.onend = () => {
    currentUtterance = null;
    onEnd();
  };

  utterance.onerror = (e) => {
    currentUtterance = null;
    onError(e);
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

export function isSpeaking() {
  return window.speechSynthesis && window.speechSynthesis.speaking;
}
