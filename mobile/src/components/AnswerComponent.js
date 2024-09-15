// src/components/AnswerComponent.js

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import FeedbackModal from './FeedbackModal';
import { getFeedback } from '../services/feedbackService';
import { addDataToDataset } from '../services/datasetService';
import { speakText } from '../services/textToSpeechService';

const AnswerComponent = ({ answer, question }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleFeedback = async (isPositive) => {
    if (isPositive) {
      // Positive feedback: Train the model with the new information
      await addDataToDataset({ question, answer });
    } else {
      // Negative feedback: Ask for correction
      speakText("Quer ajudar a Anya a corrigir o erro?");
      // Here you can implement additional logic to collect corrections
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.answerText}>{answer}</Text>
      <Button title="Dar Feedback" onPress={() => setModalVisible(true)} />
      <FeedbackModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onFeedback={handleFeedback}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin:20,
    padding:10,
    backgroundColor:'#f0f0f0',
    borderRadius:5
  },
  answerText: {
    fontSize:16,
    marginBottom:10
  }
});

export default AnswerComponent;
