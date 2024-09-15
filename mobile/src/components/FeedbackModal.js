// src/components/FeedbackModal.js

import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { speakText } from '../services/textToSpeechService';
import { getFeedback } from '../services/feedbackService';

const FeedbackModal = ({ visible, onClose, onFeedback }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Feedback</Text>
          <Text>A resposta da Anya ajudou?</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Sim"
              onPress={() => {
                onFeedback(true);
                onClose();
              }}
            />
            <Button
              title="Não"
              onPress={() => {
                onFeedback(false);
                onClose();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  modalContainer: {
    width:300,
    padding:20,
    backgroundColor:'#fff',
    borderRadius:10,
    alignItems:'center'
  },
  title: {
    fontSize:18,
    fontWeight:'bold',
    marginBottom:10
  },
  buttonContainer: {
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    marginTop:20
  }
});

export default FeedbackModal;
