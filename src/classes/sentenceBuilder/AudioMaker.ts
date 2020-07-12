import fs, { writeFile } from "fs";
import path from "path";
import util from "util";
import readLine from "readline-sync";
import { audioParentFolderPath, silenceFolderPath, oneSecondPause, twoSecondPause, threeSecondPause, fourSecondPause, fiveSecondPause } from "../../globals";
const audioConcat = require("audioconcat");
const tmp = require("tmp");

import Sentence from "./Sentence";
import Utilities from "../Utilities";
import ConfigData from "../setupWizard/ConfigDataInterface";
import ForeignPhraseDefinitionPair from "./ForeignPhraseDefinitionPairInterface";
import {translationDirection, voiceGender, audioEncoding} from "../minorTypes";
import {TextToSpeechClient} from "@google-cloud/text-to-speech";
import WordFile, {contentTypes} from "./WordFile";


const {TranslationServiceClient} = require('@google-cloud/translate');


export default class AudioMaker {
   // --------------- Properties
   private configData: Readonly<ConfigData>;
   private sentence: Sentence;

   
   // --------------- Constructor
   constructor(configData: Readonly<ConfigData>, sentence: Sentence) {
      this.configData = configData;
      this.sentence = sentence;
   }


   // --------------- Public Methods

   /* 
      Silence files are kept in {rootDir}/silences. 
      
      Delays from 1 to 12 seconds are available in 1 
      second increments

      Note: The audio combiner adds 2 seconds
   */
  public calculatePauseDuration(wordCount: number)
  : number {
      // word 1 gets 2 seconds automatically from the audio combiner.
      // this means all values are low by 2 seconds
      let pauseDuration = wordCount - 1;
      if (pauseDuration > 12) pauseDuration = 12;

      return pauseDuration;
   }

   public makeSentenceFolder(): string {
      const subfolderPath = path.join(audioParentFolderPath, this.sentence.folderName);

      fs.mkdirSync(subfolderPath);

      return subfolderPath;
   }


   /* 
      Makes an audio of the sentence, in the sentence's subfolder
   */
   public async makeSentenceTrack(prefix: string): Promise<void> {

      /**** Setup Audio Options ****/
      const sharedOptions = {
         voice : { ssmlGender : voiceGender.male }
         , audioConfig : {audioEncoding : "OGG_OPUS" as audioEncoding }
      }

      let foreignSentenceText;
      try {
         foreignSentenceText = await this.textTranslate(
            this.sentence.englishVersion
            , translationDirection.toForeign);   
      }
      catch(error) { 
         console.log(error); 
         throw new Error(error);
      }

      const foreignAudioRequest = {
         ...sharedOptions
         , voice : { 
            ...sharedOptions.voice
            , languageCode : this.configData.languageCode 
         }
         , input : {text : foreignSentenceText}
      }


      const englishText = this.sentence.englishVersion;
      const englishAudioRequest = {
         ...sharedOptions
         , voice : { 
            ...sharedOptions.voice
            , languageCode : "en" 
         }
         , input : {text : englishText}
      }

      /**** Create 1st sentence audio ****/
      const tempFolder = tmp.dirSync({unsafeCleanup: true});
      
      const foreignAudioName = `${prefix} - ${foreignSentenceText}.ogg`;
      const foreignAudioTempPath = path.join(`${tempFolder}`, foreignAudioName);

      const englishAudioName = `${prefix} - ${this.sentence.folderName}.ogg`;
      const englishAudioTempPath = path.join(tempFolder, englishAudioName);
      
      this.fetchAndWriteAudio(foreignAudioRequest, foreignAudioTempPath);
      this.fetchAndWriteAudio(englishAudioRequest, englishAudioTempPath);
      // 1 level files saved to temp folder now


      /**** Add Pause ****/
      // 2 for 1st word, plus 1 per word thereafter
      let mainPauseDuration: number = 2 + this.sentence.foreignWordCount;
      if (mainPauseDuration > 12) { mainPauseDuration = 12 }
      const pauseFilePath = path.join(silenceFolderPath, `${mainPauseDuration}.ogg`);
      

      /**** Setup final audio file structure ****/
      const singlePassStructure = [englishAudioTempPath, pauseFilePath, foreignAudioTempPath, threeSecondPause];

      let endStructure = singlePassStructure;
      for (let i = 1; i <= this.configData.numberOfRepeats - 1; i++) {
         const repeatStructure = [englishAudioTempPath, twoSecondPause, foreignAudioTempPath, threeSecondPause];

         endStructure.concat(repeatStructure);
      }

      /**** Save To Production Subfolder ****/
      const finalSaveFolderPath: string = path.join(audioParentFolderPath, this.sentence.folderName);


      this.combineAndSave(
         endStructure
         , finalSaveFolderPath
         , {prefix}
      )
   }


   public async makeWordAudioFile(): Promise<void> {
      // sets data to this.sentence.foreignPhraseDefinitionPairs
      await this.gatherAllForeignWordsAndDefinitionsFromUser();

      /**** Build word def audios to temp directory ****/
      const tempFolder: ReturnType<typeof tmp.dirSync> = tmp.dirSync({unsafeCleanup : true});

      this.buildWordDefinitionAudiosToTempFolder(tempFolder);

      const tempFileNames: Array<string> = fs.readdirSync(tempFolder);
      
      /**** Convert from filenames to WordFile objects  ****/
      const wordFileObjects: Array<WordFile> = tempFileNames.map(fileName => {
         return new WordFile(fileName, tempFolder);
      });

      /**** Setup order of files to be combined, including silences ****/
      const finalAudioOrder: string[] = this.setAudioOrderFromWordFileObjects(wordFileObjects);


      /**** Build Single Production File ****/
      const productionFileName = `2 - all words and definitions.ogg`;
      const finalSaveFolderPath: string = path.join(audioParentFolderPath, this.sentence.folderName);
      const fullSavePath = path.join(finalSaveFolderPath, productionFileName);

      this.combineAndSave(
         finalAudioOrder
         , fullSavePath
         , {name: productionFileName}
      )
   }


   /* 
      Copies file to same folder with a different filename

      @param copiedFileName. Should contain the full filename including extension
   */
   public duplicateTrack(
      prefixMatcher: string
      , copiedFileName: string): void {

      const targetAudioFolder = path.join(audioParentFolderPath, this.sentence.folderName);

      const audioFileNames: string[] = fs.readdirSync(targetAudioFolder);
      
      const regexMatcherFromBeginning: RegExp = new RegExp(`^${prefixMatcher}`);
      
      const targetFile: string = audioFileNames.filter(filename => {
         const matchFound: boolean = regexMatcherFromBeginning.test(filename);
         
         return matchFound;
      })[0]; // returns first match only!

      const sourceFileNameAndPath = path.join(targetAudioFolder, targetFile);
      const copiedFileNameAndPath = path.join(targetAudioFolder, copiedFileName);

      fs.copyFileSync(sourceFileNameAndPath, copiedFileNameAndPath);
   }


   // --------------- Internal Methods

   protected parseFileContents(filepath = path.join(__dirname, "../../../sentences.txt")): Array<string> {
      const sentenceCandidates = fs
         .readFileSync(filepath)
         .toString()
         .split("\n");

      return sentenceCandidates;
   }


   protected async textTranslate(
         wordPhraseOrSentence: string
         , direction: translationDirection
      ) : Promise<string> {
      const translationClient = new TranslationServiceClient();

      let sourceLanguage: string;
      let targetLanguage: string;
      if (direction === translationDirection.toEnglish) {
         sourceLanguage = this.configData.languageCode;
         targetLanguage = "en";
      } else {
         sourceLanguage = "en";
         targetLanguage = this.configData.languageCode;
      }

      const options = {
         parent: `projects/${this.configData.projectId}`
         , contents: [wordPhraseOrSentence]
         , mimeType: 'text/plain'
         , sourceLanguageCode: sourceLanguage
         , targetLanguageCode: targetLanguage
      }

      try {
         const [response] = await translationClient.translateText(options);
         const {translations}: { translations: string[] } = response;
         return translations[0];
      }
      catch (error) {
         console.error(error.details)
         throw new Error(error.details);
      }

   }
   

   /* 
      Asks for the foreign word
      
      Gets a definition, asks for confirmation or an adjustment.

      Returns an object with the foreign word and definition pair
      
      Returns false if user marks "done" commands
   */
   protected async getForeignWordAndDefinition()
      : Promise<ForeignPhraseDefinitionPair | false> {
      console.log("Please copy and paste the (next) foreign word in the sentence here. Or type -d or --done when all words in the sentence have been specified.")
      const userInput = readLine.question();

      const userHasExited = this.isDone(userInput);
      if (userHasExited) return false;

      const foreignWord = userInput;

      const googleOfferedDefinition: string = await this.textTranslate(
         foreignWord
         , translationDirection.toEnglish
      );

      console.log("Type your own contextual definition for this word now. It will be used during audio translation. Or, press ENTER without typing anything to accept the following default definition from Google Translate:")
      console.log(googleOfferedDefinition);
      const userDefinition: string = readLine.question();

      let acceptedDefinition = googleOfferedDefinition;
      if (userDefinition !== "") {
         acceptedDefinition = userDefinition;
      } 

      // shape the object and return it
      const foreignPhraseDefinitionPair: ForeignPhraseDefinitionPair = {
         foreignPhrase: foreignWord
         , englishDefinition: acceptedDefinition
      }

      return foreignPhraseDefinitionPair;
   }


   /* 
      meant for phrase/sentence
   */
   private isDone(userInput: string): boolean {
      if (userInput === "-d" || userInput === "--done") {
         return true;
      }

      return false;
   }


   /* 
      send a text-to-speech request
      catch the audio stream. Save to file
   */
   protected async fetchAndWriteAudio(
      request: Readonly<{
         input : { text : string }
         , voice : { languageCode : string, ssmlGender: voiceGender }
         , audioConfig : { 
            audioEncoding : "AUDIO_ENCODING_UNSPECIFIED" | "LINEAR16" | "MP3" | "OGG_OPUS" }
      }>
      , fileNameAndPath: string
   ) : Promise<ReturnType<typeof TextToSpeechClient.prototype.synthesizeSpeech>> {

      const textToSpeech = new TextToSpeechClient();
      const writeFileAsync = util.promisify(writeFile);

      try {
         const [audioResponse] = await textToSpeech.synthesizeSpeech(request);
         await writeFileAsync(fileNameAndPath, audioResponse.audioContent!);
      }
      catch(error) { console.log(error); }
   }

   
   protected setAudioOrderFromWordFileObjects(wordFiles: Array<WordFile>): Array<string> {
      const finalAudioStructure: string[] = [];

      wordFiles.forEach(wordFile => {
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


   /* 
      save an array of audios to a production folder

      argument 3 takes a prefix, or full filename/extension
   */
   protected combineAndSave <NamingOption extends {prefix: string, name: string}> (
      audiosAndPauseFiles: Array<string>
      , savePath: string
      , fileNameOptions : 
         Pick<NamingOption, "prefix"> |
         Pick<NamingOption, "name">
   ) : void {
      let finalFileSavePath: string;
      
      // used to save sentence files
      if ("prefix" in fileNameOptions) {
         finalFileSavePath = path.join(savePath, `${fileNameOptions.prefix} - ${this.sentence.folderName}.ogg`);
      } else {
         finalFileSavePath = path.join(savePath, name);
      }

      audioConcat(audiosAndPauseFiles)
         .concat(finalFileSavePath)
         .on("start", (command: any) => {
            console.log(`ffmpeg build process started on file at: ${finalFileSavePath}`);
         })
         .on("end", (output: any) => {
            console.log(`Sucessfully created file at: ${finalFileSavePath}`);
         })
         .on("error", (error: any, stdout: any, stderr: any) => {
            console.log('error', error);
            console.log('stdout', stdout);
            console.log('stderr', stderr);
         });
   }

 
   protected buildWordDefinitionAudiosToTempFolder(
      tempFolder: ReturnType<typeof tmp.dirSync>
   ) : void {
      let pairNumber: number = 1;

      this.sentence.foreignPhraseDefinitionPairs.forEach(wordDefinitionPair => {
         /**** Setup request object ****/
         const sharedRequestOptions = {
            voice : { ssmlGender : voiceGender.female }
            , audioConfig : { audioEncoding : "OGG_OPUS" as audioEncoding }
         }

         const foreignWordOptions = {
            ...sharedRequestOptions
            , voice : {
               ...sharedRequestOptions.voice
               , languageCode : this.configData.languageCode
            }
            , input : {text: wordDefinitionPair.foreignPhrase}
         }


         const englishDefinitionOptions = {
            ...sharedRequestOptions
            , voice : {
               ...sharedRequestOptions.voice
               , languageCode : "en"
            }
            , input : {text: wordDefinitionPair.englishDefinition}
         }

         /**** Setup file names & paths ****/

         // foreign words are assigned 1 in the second slot
         // english words are assigned 2
         // this lines them up for orderly file combination.
         const foreignWordFileName = `${pairNumber}1 - foreign word - ${wordDefinitionPair.englishDefinition}.ogg`;
         const foreignWordFullPath = path.join(tempFolder, foreignWordFileName);

         const englishDefinitionFileName = `${pairNumber}2 - definition - ${wordDefinitionPair.englishDefinition}.ogg`;
         const englishDefinitionFullPath = path.join(tempFolder, foreignWordFileName);


         /**** Translate and save file based on number of repeats ****/
         for (let i = 1; i <= this.configData.numberOfRepeats; i++) {
            this.fetchAndWriteAudio(foreignWordOptions, foreignWordFullPath);
            this.fetchAndWriteAudio(englishDefinitionOptions, englishDefinitionFullPath);
   
            /**** Increment the counter ****/
            pairNumber += 1;   
         }

         // increment again in preparation for next file targets
         pairNumber++;
      });

   }

   protected userExited(userInput: string): boolean {
      if (userInput === "-d" ||
         userInput === "--done"
      ) {
         return true;
      }

      return false;
   }

   /* 
      Pushes all gathered data to: this.sentence.foreignPhraseDefinitionPairs
   */
   protected async gatherAllForeignWordsAndDefinitionsFromUser() : Promise<void> {
      enum sequentialAdjectives {
         first = "first"
         , next = "next"
      }
      let sequentialAdjective: sequentialAdjectives = sequentialAdjectives.first;
      let continueLooping: boolean = true;

      while (continueLooping) {
         console.log(`Please enter the ${sequentialAdjective} foreign language word and press ENTER.`)
         
         if (sequentialAdjective === sequentialAdjectives.next) {
            console.log(`Or type "--done" or "-d" (no quotes) to complete word definitions for this sentence.`);
         }

         const foreignWordUserInput: string = readLine.question();

         // flip adjective after first usage
         if (sequentialAdjective === sequentialAdjectives.first) {
            sequentialAdjective = sequentialAdjectives.next;
          }

         /**** Exit Check ****/
         const userExited: boolean = this.userExited(foreignWordUserInput);

         if (userExited) {
            continueLooping = false;
         }
         else {
            /**** Fetch a Google Translation ****/
            const googlesuggestedTranslation: string = await this.textTranslate(foreignWordUserInput, translationDirection.toEnglish);

            /**** Ask user to accept, or override the default translation ****/
            console.log(`The translation returned by Google for ${foreignWordUserInput} is: ${googlesuggestedTranslation}`);
            console.log(`Press ENTER (without entering any text) to accept this translation. Or, type your own custom definition, and press ENTER.`);

            const definitonUserInput = readLine.question();

            let acceptedDefinition;
            if (definitonUserInput === "") {
               acceptedDefinition = googlesuggestedTranslation;
            } else {
               acceptedDefinition = definitonUserInput;
            }

            const wordDefinitionPair: ForeignPhraseDefinitionPair = {
               foreignPhrase : foreignWordUserInput
               , englishDefinition : acceptedDefinition
            };

            this.sentence.foreignPhraseDefinitionPairs.push(wordDefinitionPair);
         }
      }
   }

}