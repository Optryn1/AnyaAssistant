// src/services/datasetService.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Octokit } from '@octokit/rest';
import { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } from '../utils/constants';
import { bufferToString, logError } from '../utils/helper';

const octokit = new Octokit({ auth: GITHUB_TOKEN });

/**
 * Loads the dataset from GitHub.
 * @returns {Array<Object>} Dataset
 */
export const loadDataset = async () => {
  try {
    const response = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: 'dataset.json',
    });

    const content = bufferToString(response.data.content);
    return JSON.parse(content);
  } catch (error) {
    logError(error);
    return [];
  }
};

/**
 * Saves the dataset to GitHub.
 * @param {Array<Object>} dataset 
 */
export const saveDataset = async (dataset) => {
  try {
    const content = Buffer.from(JSON.stringify(dataset, null, 2)).toString('base64');

    // Get the SHA of the existing file to update it
    const { data: existingFile } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: 'dataset.json',
    });

    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: 'dataset.json',
      message: 'Updating dataset',
      content,
      sha: existingFile.sha, // Required to update existing files
    });
  } catch (error) {
    logError(error);
  }
};

/**
 * Adds new data to the dataset and saves it.
 * @param {Object} newData 
 */
export const addDataToDataset = async (newData) => {
  try {
    const dataset = await loadDataset();
    dataset.push(newData);
    await saveDataset(dataset);
  } catch (error) {
    logError(error);
  }
};
