import { HfInference } from '@huggingface/inference';
import { HUGGINGFACE_API_KEY } from '../utils/constants';

const hf = new HfInference(HUGGINGFACE_API_KEY);

export const getAnswerFromContext = async (context, question) => {
  const response = await hf.question({
    model: 'distilbert-base-uncased-distilled-squad',
    context,
    question
  });

  return response.answer;
};
