import fs from 'fs';
import path from 'path';
import readLine from 'readline-sync';
import tmp from 'tmp';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import * as dotenv from 'dotenv';

import Sentence from './Sentence';
import Utilities from '../Utilities';
import ConfigData from '../setupWizard/ConfigDataInterface';
import ForeignPhraseDefinitionPair from './ForeignPhraseDefinitionPairInterface';
import { translationDirection, voiceGender, audioEncoding } from '../../helpers/minorTypes';
import WordFile, { contentTypes } from './WordFile';
import AudioRequest from './AudioRequestInterface';

import {
  audioParentFolderPath, silenceFolderPath, oneSecondPause, twoSecondPause,
  threeSecondPause, fourSecondPause, fiveSecondPause, googleApiKeyFilePath,
} from '../../globals';

import {
  parseFileContents, isDone, createAudioRequest,
  setAudioOrderFromWordFileObjects, calculateMainPauseDuration,
} from '../../helpers/AudioMakerHelpers';

const { Translate } = require('@google-cloud/translate').v2;
const { TranslationServiceClient } = require('@google-cloud/translate');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);
dotenv.config();
tmp.setGracefulCleanup();

// --------------- Main Class

export default class AudioMaker {
  // --------------- Constructor
  constructor(
     private configData: Readonly<ConfigData>,
     private sentence: Sentence,
     private filePrefix: number = 1,
  ) {
    this.configData = configData;
    this.sentence = sentence;
  }

  // --------------- Public Methods

  public makeSentenceFolder(): string {
    const subfolderPath = path.join(audioParentFolderPath, this.sentence.folderName);

    fs.mkdirSync(subfolderPath, { recursive: true });
    console.log('subfolderPath', subfolderPath);

    return subfolderPath;
  }

  /*
      Makes an audio of the sentence, in the sentence's subfolder
  */
  public async makeSentenceTrack(): Promise<void> {
    /** ** Setup Audio Options *** */
    let foreignSentenceText;
    try {
      foreignSentenceText = await this.textTranslate(
        this.sentence.englishVersion,
        translationDirection.toForeign,
      );
    } catch (error) {
      throw new Error(error);
    }

    const foreignAudioRequest = createAudioRequest(
      this.configData.languageCode, foreignSentenceText, voiceGender.male,
    );

    const englishText = this.sentence.englishVersion;
    const englishAudioRequest = createAudioRequest(
      'en', englishText, voiceGender.male,
    );

    /** ** Create 1st sentence audio *** */
    const tempFolder: string = tmp.dirSync({ unsafeCleanup: true }).name;

    const foreignAudioName = `${this.filePrefix} - ${foreignSentenceText}.ogg`;
    const foreignAudioTempPath = path.join(`${tempFolder}`, foreignAudioName);

    const englishAudioName = `${this.filePrefix} - ${this.sentence.folderName}.ogg`;
    const englishAudioTempPath = path.join(tempFolder, englishAudioName);

    await this.fetchAndWriteAudio(foreignAudioRequest, foreignAudioTempPath);
    await this.fetchAndWriteAudio(englishAudioRequest, englishAudioTempPath);

    /** ** Add Pause *** */
    const mainPauseDuration: number = calculateMainPauseDuration(this.sentence.englishWordCount);
    const pauseFilePath = path.join(silenceFolderPath, `${mainPauseDuration}.ogg`);

    /** ** Setup final audio file structure *** */
    const singlePassStructure = [englishAudioTempPath, pauseFilePath,
      foreignAudioTempPath, threeSecondPause];

    const endStructure = singlePassStructure;
    for (let i = 1; i <= this.configData.numberOfRepeats - 1; i += 1) {
      const repeatStructure = [englishAudioTempPath, twoSecondPause,
        foreignAudioTempPath, threeSecondPause];

      endStructure.concat(repeatStructure);
    }

    /** ** Save To Production Subfolder *** */
    const finalSaveFolderPath: string = path.join(audioParentFolderPath, this.sentence.folderName);

    this.combineAndSave(
      endStructure,
      finalSaveFolderPath,
      { prefix: this.filePrefix.toString() },
    );
  }

  public async makeWordAudioFiles(): Promise<void> {
    // sets data to this.sentence.foreignPhraseDefinitionPairs
    await this.gatherAllForeignWordsAndDefinitionsFromUser();

    /** ** Build word def audios to temp directory *** */
    const tempFolder: string = tmp.dirSync({ unsafeCleanup: true }).name;

    await this.buildWordDefinitionAudiosToTempFolder(tempFolder);

    const tempFileNames: Array<string> = fs.readdirSync(tempFolder);

    /** ** Convert from filenames to WordFile objects  *** */
    const wordFileObjects: Array<WordFile> = tempFileNames.map(
      (fileName) => new WordFile(fileName, tempFolder),
    );

    /** ** Setup order of files to be combined, including silences *** */
    const finalAudioOrder: string[] = setAudioOrderFromWordFileObjects(wordFileObjects);

    /** ** Build Single Production File *** */
    const productionFileName = '2 - all words and definitions.ogg';
    const finalSaveFolderPath: string = path.join(audioParentFolderPath, this.sentence.folderName);

    this.combineAndSave(
      finalAudioOrder,
      finalSaveFolderPath,
      { fullFileName: productionFileName },
    );
  }

  /*
      Copies file to same folder with a different filename

      @param copiedFileName. Should contain the full filename including extension
   */
  public duplicateTrack(
    prefixMatcher: string,
    copiedFileName: string,
  ): void {
    const targetAudioFolder = path.join(audioParentFolderPath, this.sentence.folderName);

    const audioFileNames: string[] = fs.readdirSync(targetAudioFolder);

    const regexMatcherFromBeginning: RegExp = new RegExp(`^${prefixMatcher}`);

    const targetFile: string | undefined = audioFileNames.find(
      (filename) => regexMatcherFromBeginning.test(filename),
    );

    let sourceFileNameAndPath: string;
    if (typeof targetFile !== 'undefined') {
      sourceFileNameAndPath = path.join(targetAudioFolder, targetFile);
    }
    const copiedFileNameAndPath = path.join(targetAudioFolder, copiedFileName);

    fs.copyFileSync(sourceFileNameAndPath!, copiedFileNameAndPath);
  }

  // --------------- Internal Methods

  protected async textTranslate(
    wordPhraseOrSentence: string,
    direction: translationDirection,
  ) : Promise<string> {
    console.log(`inside text translate for wps: ${wordPhraseOrSentence}`);
    const basicTranslate = new Translate({
      projectId: this.configData.projectId || process.env.GOOGLE_PROJECT_ID,
      keyFilename: googleApiKeyFilePath,
    });

    let sourceLanguage: string;
    let targetLanguage: string;
    if (direction === translationDirection.toEnglish) {
      sourceLanguage = this.configData.languageCode;
      targetLanguage = 'en';
    } else {
      sourceLanguage = 'en';
      targetLanguage = this.configData.languageCode;
    }

    try {
      let [translations] = await basicTranslate.translate(
        wordPhraseOrSentence, targetLanguage,
      );

      translations = Array.isArray(translations) ? translations : [translations];

      return translations[0].normalize();
    } catch (error) {
      throw new Error(error);
    }
  }

  /*
    send a text-to-speech request
    catches the audio stream. Saves to file
 */
  protected async fetchAndWriteAudio(
    request: Readonly<AudioRequest>,
    fileNameAndPath: string,
  ) : Promise<ReturnType<typeof TextToSpeechClient.prototype.synthesizeSpeech>> {
    const textToSpeech = new TextToSpeechClient({
      keyFilename: googleApiKeyFilePath,
      projectId: this.configData.projectId || process.env.GOOGLE_PROJECT_ID,
    });

    try {
      const [audioResponse] = await textToSpeech.synthesizeSpeech(request);
      await fs.promises.writeFile(fileNameAndPath, audioResponse.audioContent!);
    } catch (error) { console.log(error); }
  }

  /*
      Asks for the foreign word

      Gets a definition, asks for confirmation or an adjustment.

      Returns an object with the foreign word and definition pair

      Returns false if user marks "done" commands
   */
  protected async getForeignWordAndDefinition()
      : Promise<ForeignPhraseDefinitionPair | false> {
    console.log('Please copy and paste the (next) foreign word in the sentence here. Or type -d or --done when all words in the sentence have been specified.');
    const userInput = readLine.question();

    const userHasExited = isDone(userInput);
    if (userHasExited) return false;

    const foreignWord = userInput;

    const googleOfferedDefinition: string = await this.textTranslate(
      foreignWord,
      translationDirection.toEnglish,
    );

    console.log('Type your own contextual definition for this word now. It will be used during audio translation. Or, press ENTER without typing anything to accept the following default definition from Google Translate:');
    console.log(googleOfferedDefinition);
    const userDefinition: string = readLine.question();

    let acceptedDefinition = googleOfferedDefinition;
    if (userDefinition !== '') {
      acceptedDefinition = userDefinition;
    }

    // shape the object and return it
    const foreignPhraseDefinitionPair: ForeignPhraseDefinitionPair = {
      foreignPhrase: foreignWord,
      englishDefinition: acceptedDefinition,
    };

    return foreignPhraseDefinitionPair;
  }

  /*
      save an array of audios to a production folder

      argument 3 takes a prefix, or full filename/extension
   */
  protected combineAndSave <NamingOption extends {prefix: string, fullFileName: string}>(
    audiosAndPauseFiles: Array<string>,
    savePath: string,
    fileNameOptions :
         Pick<NamingOption, 'prefix'> |
         Pick<NamingOption, 'fullFileName'>,
  ) : void {
    let finalFileSavePath: string;

    // used to save sentence files
    if ('prefix' in fileNameOptions) {
      finalFileSavePath = path.join(savePath, `${fileNameOptions.prefix} - ${this.sentence.folderName}.ogg`);
    } else {
      finalFileSavePath = path.join(savePath, fileNameOptions.fullFileName);
    }

    // pass all audio file paths to fluent ffmpeg
    const fluentFfmpeg = ffmpeg();
    const allFilesAdded: ReturnType<typeof ffmpeg> = audiosAndPauseFiles.reduce(
      (ffmObject, filePath) => ffmObject.addInput(filePath), fluentFfmpeg,
    );

    allFilesAdded
      .on('start', (command: any) => {
        console.log(`ffmpeg build process started on file at: ${finalFileSavePath}`);
        console.log('=====command=====');
        console.log(command);
      })
      .on('end', () => {
        console.log(`Sucessfully created file at: ${finalFileSavePath}`);
      })
      .on('error', (error: any, stdout: any, stderr: any) => {
        console.log('=====error=====');
        console.log(error);
        console.log('=====stdout=====', stdout);
        console.log(stdout);
        console.log('=====stderr=====');
        console.log(stderr);
      });

    const tmpFolder: string = tmp.dirSync({ unsafeCleanup: true }).name;
    allFilesAdded.mergeToFile(finalFileSavePath, tmpFolder);
  }

  protected async buildWordDefinitionAudiosToTempFolder(
    tempFolder: string,
  ) : Promise<void> {
    console.log('inside buildWordDefinitionAudiosToTempFolder');
    let pairNumber: number = 1;

    const foreignPhrasePairs = this.sentence.foreignPhraseDefinitionPairs;

    for (let i = 0; i < foreignPhrasePairs.length; i += 1) {
      /** ** Setup request objects *** */
      const foreignAudioRequest = createAudioRequest(
        this.configData.languageCode, foreignPhrasePairs[i].foreignPhrase, voiceGender.female,
      );

      const englishAudioRequest = createAudioRequest(
        'en', foreignPhrasePairs[i].englishDefinition, voiceGender.female,
      );

      /** ** Setup file names & paths *** */

      // foreign words are assigned 1 in the first position. english words are assigned 2
      const foreignWordFileName = `${pairNumber}1 - foreign word - ${foreignPhrasePairs[i].englishDefinition}.ogg`;
      const foreignWordFullPath = path.join(tempFolder, foreignWordFileName);

      const englishDefinitionFileName = `${pairNumber}2 - definition - ${foreignPhrasePairs[i].englishDefinition}.ogg`;
      const englishDefinitionFullPath = path.join(tempFolder, englishDefinitionFileName);

      /** ** Translate and save *** */
      for (let j = 1; j <= Number(this.configData.numberOfRepeats); j += 1) {
        console.log('attempt to write file to englishDefinitionFullPath', englishDefinitionFullPath);

        await this.fetchAndWriteAudio(foreignAudioRequest, foreignWordFullPath);
        await this.fetchAndWriteAudio(englishAudioRequest, englishDefinitionFullPath);

        pairNumber += 1;
      }

      pairNumber += 1;
    }
  }

  /*
      Pushes all gathered data to: this.sentence.foreignPhraseDefinitionPairs
   */
  protected async gatherAllForeignWordsAndDefinitionsFromUser() : Promise<void> {
    enum sequentialAdjectives { first = 'first', next = 'next' }

    let sequentialAdjective: sequentialAdjectives = sequentialAdjectives.first;
    let continueLooping: boolean = true;

    const sentenceInForeignLanguage: string = await this.textTranslate(
      this.sentence.englishVersion, translationDirection.toForeign,
    );

    while (continueLooping) {
      console.log(`
Current Sentence, ENGLISH: ${this.sentence.englishVersion}`);
      console.log(`Current Sentence, FOREIGN: ${sentenceInForeignLanguage}`);

      console.log(`
Please enter the ${sequentialAdjective} foreign language word and press ENTER.
`);

      if (sequentialAdjective === sequentialAdjectives.next) {
        console.log('Or type "--done" or "-d" (no quotes) to complete word definitions for this sentence.');
      }

      const foreignWordUserInput: string = readLine.question();

      if (sequentialAdjective === sequentialAdjectives.first) {
        sequentialAdjective = sequentialAdjectives.next;
      }

      /** ** Exit Check *** */
      const userExited: boolean = isDone(foreignWordUserInput);
      console.log('userExited', userExited);

      if (userExited) {
        continueLooping = false;
        console.log('the userExited branch');
      } else {
        console.log('the else branch'); // it's like it stops working here

        /** ** Fetch Google Translation *** */
        /* eslint-disable no-await-in-loop */
        const googleSuggestedTranslation: string = await this.textTranslate(
          foreignWordUserInput, translationDirection.toEnglish,
        );
        console.log('googleSuggestedTranslation', googleSuggestedTranslation);

        /** ** Ask user to accept, or override *** */
        console.log(`The translation returned by Google for ${foreignWordUserInput} is: ${googleSuggestedTranslation}`);
        console.log('Press ENTER (without entering any text) to accept this translation. Or, type your own custom definition, and press ENTER.');

        const definitonUserInput = readLine.question();

        let acceptedDefinition;
        if (definitonUserInput === '') {
          acceptedDefinition = googleSuggestedTranslation;
        } else {
          acceptedDefinition = definitonUserInput;
        }

        const wordDefinitionPair: ForeignPhraseDefinitionPair = {
          foreignPhrase: foreignWordUserInput,
          englishDefinition: acceptedDefinition,
        };

        this.sentence.foreignPhraseDefinitionPairs.push(wordDefinitionPair);
      }
    }
  }

  private incrementFilePrefix(): void {
    this.filePrefix += 1;
  }
}
