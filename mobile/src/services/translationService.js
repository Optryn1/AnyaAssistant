// src/services/translationService.js

import axios from 'axios';
import { DEEPL_API_KEY } from '../utils/constants';
import { logError } from '../utils/helper';

/**
 * Translates text to European Portuguese.
 * @param {string} text 
 * @returns {string} Translated text
 */
export const translateToPortuguese = async (text) => {
  try {
    const response = await axios.post('https://api-free.deepl.com/v2/translate', null, {
      params: {
        auth_key: DEEPL_API_KEY,
        text,
        target_lang: 'PT-PT'
      }
    });
    return response.data.translations.map(t => t.text).join(' ');
  } catch (error) {
    logError(error);
    return text; // Fallback to original text if translation fails
  }
};

/**
 * (Optional) Translates text from European Portuguese to English if needed.
 * Useful for certain processes or integrations.
 * @param {string} text 
 * @returns {string} Translated text
 */
export const translateToEnglish = async (text) => {
  try {
    const response = await axios.post('https://api-free.deepl.com/v2/translate', null, {
      params: {
        auth_key: DEEPL_API_KEY,
        text,
        target_lang: 'EN'
      }
    });
    return response.data.translations.map(t => t.text).join(' ');
  } catch (error) {
    logError(error);
    return text; // Fallback to original text if translation fails
  }
};
