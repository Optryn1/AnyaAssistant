import Tts from 'react-native-tts';

export const speakText = (text) => {
  Tts.setDefaultLanguage('pt-PT');
  Tts.speak(text);
};
