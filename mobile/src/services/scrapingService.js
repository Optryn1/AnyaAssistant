// src/services/scrapingService.js

import axios from 'axios';
import cheerio from 'cheerio';
import SerpApi from 'google-search-results';
import { SERP_API_KEY } from '../utils/constants';
import { logError } from '../utils/helper';

const search = new SerpApi.GoogleSearch(SERP_API_KEY);

/**
 * Searches Google for the query in English and returns top relevant websites.
 * @param {string} query 
 * @returns {Array<string>} List of website URLs
 */
export const searchGoogle = async (query) => {
  try {
    const results = await search.json({
      q: query,
      hl: "en",  // Search in English
      num: 5     // Number of results to fetch
    });
    return results.organic_results.map(result => result.link);
  } catch (error) {
    logError(error);
    return [];
  }
};

/**
 * Scrapes the specified elements from the website.
 * @param {string} url 
 * @returns {string} Scraped text
 */
export const scrapeWebsite = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let text = '';

    $('h1, h2, h3, h4, h5, h6, p, span').each((i, elem) => {
      text += $(elem).text() + '\n';
    });

    return text;
  } catch (error) {
    logError(error);
    return '';
  }
};
