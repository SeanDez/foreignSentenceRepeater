import fs, { writeFile } from 'fs';
import path from 'path';
import util from 'util';

import { voiceGender, audioEncoding } from './minorTypes';
import AudioRequest from '../classes/sentenceBuilder/AudioRequestInterface';

import {
  audioParentFolderPath, silenceFolderPath, oneSecondPause, twoSecondPause,
  threeSecondPause, fourSecondPause, fiveSecondPause, googleApiKeyFilePath,
} from '../globals';

import WordFile from '../classes/sentenceBuilder/WordFile';

// --------------- Shared Options for Audio Request

const sharedAudioRequestOptions = {
  audioConfig: { audioEncoding: 'OGG_OPUS' as audioEncoding },
};

// --------------- Standalone functions

/*
   Silence files are kept in {rootDir}/silences.

   Delays from 1 to 12 seconds are available in 1
   second increments

   Note: The audio combiner adds 2 seconds
*/
export function calculateMainPauseDuration(wordCount: number)
: number {
  // word 1 gets 2 seconds automatically from the audio combiner.
  // this means all values are low by 2 seconds
  let pauseDuration = wordCount - 1;
  pauseDuration = Math.max(1, pauseDuration);
  pauseDuration = Math.min(12, pauseDuration);

  return pauseDuration;
}

export function parseFileContents(filepath = path.join(__dirname, '../../../sentences.txt')): Array<string> {
  const sentenceCandidates = fs
    .readFileSync(filepath)
    .toString()
    .split('\n');

  return sentenceCandidates;
}

/*
  used to exit a user input loop
*/
export function isDone(userInput: string): boolean {
  if (userInput === '-d' || userInput === '--done') {
    return true;
  }

  return false;
}

export function setAudioOrderFromWordFileObjects(wordFiles: Array<WordFile>): Array<string> {
  const finalAudioStructure: string[] = [];

  wordFiles.forEach((wordFile) => {
    const hasBeginningPause = wordFile.beforePausePadding > 0;
    if (hasBeginningPause) {
      const beginningPauseFile = path.join(silenceFolderPath, `${wordFile.beforePausePadding}.ogg`);
      finalAudioStructure.push(beginningPauseFile);
    }

    finalAudioStructure.push(wordFile.fullFilePath);

    const hasEndingPause = wordFile.beforePausePadding > 0;
    if (hasEndingPause) {
      const endingPauseFile = path.join(silenceFolderPath, `${wordFile.afterPausePadding}.ogg`);
      finalAudioStructure.push(endingPauseFile);
    }
  });

  return finalAudioStructure;
}

export function createAudioRequest(
  languageCode: string,
  translationText: string,
  gender: voiceGender,
) {
  const audioRequest: AudioRequest = {
    ...sharedAudioRequestOptions,
    voice: {
      ssmlGender: gender,
      languageCode,
    },
    input: { text: translationText },
  };

  return audioRequest;
}
