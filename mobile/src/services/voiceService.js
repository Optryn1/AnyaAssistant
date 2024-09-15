// src/services/voiceService.js

import Voice from 'react-native-voice';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

export const useVoiceService = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechError = onSpeechErrorHandler;

    // Start listening initially for the wake word
    startListeningForWakeWord();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResultsHandler = (event) => {
    const spokenText = event.value[0].toLowerCase();
    if (!isListening && spokenText.includes('anya')) {
      Alert.alert("Anya Ativada", "Como posso ajudar?");
      setIsListening(true);
      Voice.stop(); // Stop listening for wake word
      startListening(); // Start listening for user query
    } else if (isListening) {
      setTranscribedText(spokenText);
      Voice.stop();
    }
  };

  const onSpeechErrorHandler = (error) => {
    console.error("Voice Recognition Error: ", error);
    Alert.alert("Erro", "Ocorreu um erro no reconhecimento de voz.");
    setIsListening(false);
  };

  const startListeningForWakeWord = async () => {
    try {
      await Voice.start('pt-PT'); // Listen in European Portuguese
    } catch (error) {
      console.error("Failed to start Voice recognition: ", error);
    }
  };

  const startListening = async () => {
    try {
      await Voice.start('pt-PT'); // Listen for user query
    } catch (error) {
      console.error("Failed to start Voice recognition: ", error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
      startListeningForWakeWord(); // Restart listening for wake word
    } catch (error) {
      console.error("Failed to stop Voice recognition: ", error);
    }
  };

  return { startListening, stopListening, transcribedText, isListening };
};
