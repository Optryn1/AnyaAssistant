// src/utils/helper.js

/**
 * Converts Buffer to string.
 * @param {Buffer} buffer 
 * @returns {string}
 */
export const bufferToString = (buffer) => {
    return Buffer.from(buffer, 'base64').toString('utf-8');
  };
  
  /**
   * Logs errors consistently.
   * @param {Error} error 
   */
  export const logError = (error) => {
    console.error('An error occurred:', error);
  };
  
  /**
   * Cleans and processes scraped text.
   * @param {string} text 
   * @returns {string}
   */
  export const cleanScrapedText = (text) => {
    // Remove extra whitespace, repeated lines, etc.
    return text.replace(/\s+/g, ' ').trim();
  };
  