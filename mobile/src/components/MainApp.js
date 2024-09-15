// src/components/MainApp.js

import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useVoiceService } from '../services/voiceService';
import { speakText } from '../services/textToSpeechService';
import { getAnswerFromContext } from '../services/qaService';
import { searchGoogle, scrapeWebsite } from '../services/scrapingService';
import { translateToPortuguese, translateToEnglish } from '../services/translationService';
import AnswerComponent from './AnswerComponent';
import FeedbackModal from './FeedbackModal';
import { logError, cleanScrapedText } from '../utils/helper';

const MainApp = () => {
  const { startListening, stopListening, transcribedText, isListening } = useVoiceService();
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');

  useEffect(() => {
    if (!isListening && transcribedText) {
      handleQuestion(transcribedText);
    }
  }, [isListening, transcribedText]);

  const handleQuestion = async (question) => {
    setLoading(true);
    setCurrentQuestion(question);

    try {
      // Step 1: Search Google in English
      const searchResults = await searchGoogle(question);
      if (searchResults.length === 0) {
        speakText("Desculpe, não encontrei resultados relevantes.");
        setLoading(false);
        return;
      }

      // Step 2: Scrape websites
      const scrapedContents = await Promise.all(
        searchResults.map(url => scrapeWebsite(url))
      );

      // Step 3: Clean and concatenate scraped text
      const cleanedText = scrapedContents.map(text => cleanScrapedText(text)).join(' ');

      // Step 4: Translate to European Portuguese
      const translatedText = await translateToPortuguese(cleanedText);

      // Step 5: Get answer from context using HuggingFace
      const extractedAnswer = await getAnswerFromContext(translatedText, question);

      if (extractedAnswer) {
        setAnswer(extractedAnswer);
        speakText(extractedAnswer);
        setFeedbackVisible(true);
      } else {
        speakText("Desculpe, não tenho a resposta certa.");
      }
    } catch (error) {
      logError(error);
      speakText("Ocorreu um erro ao processar sua pergunta.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (isPositive) => {
    if (isPositive) {
      // Positive feedback: Add to dataset
      await addDataToDataset({ question: currentQuestion, answer });
    } else {
      // Negative feedback: Initiate correction process
      speakText("Quer ajudar a Anya a corrigir o erro?");
      // Implement correction collection here
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Falar com Anya" onPress={startListening} />
      <Text style={styles.instructions}>
        {isListening ? "Anya está a ouvir..." : "Diga 'Anya' para ativar"}
      </Text>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {answer !== '' && <AnswerComponent answer={answer} question={currentQuestion} />}
      {/* Feedback Modal is integrated within AnswerComponent */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:20
  },
  instructions: {
    marginTop:20,
    fontSize:16
  }
});

export default MainApp;
