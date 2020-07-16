import fs, { writeFile } from 'fs';
import path from 'path';
import util from 'util';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

import { voiceGender, audioEncoding } from './minorTypes';
import AudioRequest from '../classes/sentenceBuilder/AudioRequestInterface';

import {
  audioParentFolderPath, silenceFolderPath, oneSecondPause, twoSecondPause,
  threeSecondPause, fourSecondPause, fiveSecondPause,
} from '../globals';

import WordFile from '../classes/sentenceBuilder/WordFile';

// --------------- Shared Options for Audio Request

const sharedAudioRequestOptions = {
  voice: { ssmlGender: voiceGender.male },
  audioConfig: { audioEncoding: 'OGG_OPUS' as audioEncoding },
};

// --------------- Standalone functions

/*
   Silence files are kept in {rootDir}/silences.

   Delays from 1 to 12 seconds are available in 1
   second increments

   Note: The audio combiner adds 2 seconds
*/
export function calculatePauseDuration(wordCount: number)
: number {
  // word 1 gets 2 seconds automatically from the audio combiner.
  // this means all values are low by 2 seconds
  let pauseDuration = wordCount - 1;
  if (pauseDuration > 12) pauseDuration = 12;

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

/*
    send a text-to-speech request
    catches the audio stream. Saves to file
 */
export async function fetchAndWriteAudio(
  request: Readonly<AudioRequest>,
  fileNameAndPath: string,
) : Promise<ReturnType<typeof TextToSpeechClient.prototype.synthesizeSpeech>> {
  const textToSpeech = new TextToSpeechClient();
  const writeFileAsync = util.promisify(writeFile);

  try {
    const [audioResponse] = await textToSpeech.synthesizeSpeech(request);
    await writeFileAsync(fileNameAndPath, audioResponse.audioContent!);
  } catch (error) { console.log(error); }
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
) {
  const audioRequest: AudioRequest = {
    ...sharedAudioRequestOptions,
    voice: {
      ...sharedAudioRequestOptions.voice,
      languageCode,
    },
    input: { text: translationText },
  };

  return audioRequest;
}
