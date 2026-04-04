/**
 * Play text using the Web Speech API (SpeechSynthesis)
 */
export const playTTS = (text: string, lang: string = 'en-US') => {
  if (typeof window === 'undefined') return;
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis API not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // Sometimes finding specific voices makes it sound better, but default is usually fine
  // const voices = window.speechSynthesis.getVoices();
  // const englishVoice = voices.find(v => v.lang.startsWith('en'));
  // if (englishVoice) utterance.voice = englishVoice;

  window.speechSynthesis.speak(utterance);
};
