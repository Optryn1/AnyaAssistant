import { Alert } from 'react-native';

export const getFeedback = (correct) => {
  if (!correct) {
    Alert.alert(
      "A resposta da Anya não ajudou",
      "Quer ajudar a Anya a corrigir o erro?",
      [{ text: "Sim" }, { text: "Não" }]
    );
  }
};
