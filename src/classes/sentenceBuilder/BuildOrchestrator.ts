import path from 'path';
import fs from 'fs';

import Sentence from './Sentence';
import AudioMaker from './AudioMaker';
import ConfigData from '../setupWizard/ConfigDataInterface';

// --------------- Standalone functions

export function parseSentenceFile(filepath = path.join(__dirname, '../../../sentences.txt')): Array<string> {
  const sentenceCandidates = fs
    .readFileSync(filepath)
    .toString()
    .split('\n');

  return sentenceCandidates;
}

export function checkForExistingFolder(sentence: Sentence): boolean {
  const { folderName } = sentence;
  const suspectFolderPath = path.join(__dirname, '../../../audioCourse', folderName);

  return fs.existsSync(suspectFolderPath);
}

const defaultConfigFilePath = path.join(__dirname, '../../../configuration.json');

export function setConfigData(configFile = defaultConfigFilePath): ConfigData {
  const fileContents = fs.readFileSync(configFile, 'utf-8');
  const configData: ConfigData = JSON.parse(fileContents);

  const moddedConfig: Partial<{
      languageCode: string
      , numberOfRepeats: number
   }> = Object.keys(configData).reduce((moddedObject, currentKey) => {
     if (currentKey === 'numberOfRepeats') {
       return {
         ...moddedObject,
         [currentKey as keyof ConfigData]: Number(configData[currentKey]),
       };
     }

     return {
       ...moddedObject,
       [currentKey as keyof ConfigData]: configData[currentKey as keyof ConfigData],
     };
   }, {});

  return moddedConfig as ConfigData;
}

// --------------- Main Class

export default class BuildOrchestrator {
   // --------------- Instance Properties
   private configData: ConfigData;

   public qualifiedSentences: Array<Sentence> = [];

   // --------------- Constructor
   constructor() {
     this.configData = setConfigData();
     this.qualifiedSentences = this.setQualifiedSentences();
   }

   // --------------- Public Methods

   /*
      This method controls the high level creation of each subfolder, along with audio contents
   */
   public async makeFolderAndAudioFiles(
     sentence: Sentence,
   ): Promise<void> {
     const audioMaker = new AudioMaker(this.configData, sentence);
     console.log('about to make sentence folder....');
     audioMaker.makeSentenceFolder();

     await audioMaker.makeWordAudioFiles();

     // make first sentence track
     const leadSentencePrefix = '1';
     await audioMaker.makeSentenceTrack(leadSentencePrefix);

     // make the final reinforcement sentence
     const repeatSentenceFileName = '3-repeat-sentence.ogg:';
     audioMaker.duplicateTrack(leadSentencePrefix, repeatSentenceFileName);
   }

   public printCountOfValidSentences(): void {
     console.log(`${this.qualifiedSentences.length} valid sentences (more than one character long) were found and parsed.`);
   }

   // --------------- Internal Methods

   protected setQualifiedSentences(): Sentence[] {
     const sentenceCandidates: string[] = parseSentenceFile();
     const validated: Sentence[] = this.validateAndSetSentenceCandidates(sentenceCandidates);
     return validated;
   }

   /* Assigns instance property `qualifiedSentences`
      If length is greater than 1 the sentence/phrase passes
   */
   protected validateAndSetSentenceCandidates(candidates: string[]) {
     const passedAndUndefined: Array<Sentence | null> = candidates
       .map((candidate) => {
         if (candidate.length >= 2) {
           return new Sentence(candidate);
         }

         return null;
       });

     const passedTest: Sentence[] = passedAndUndefined
       .filter((item: Sentence | null): item is Sentence => item !== undefined);

     if (Array.isArray(this.qualifiedSentences)) {
       return passedTest;
     }

     throw Error('Error: No qualified sentences found');
   }
}
