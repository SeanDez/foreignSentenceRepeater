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



const {TranslationServiceClient} = require('@google-cloud/translate');


export default class AudioMaker {
   // --------------- Properties
   private configData: ConfigData
   private sentence: Sentence;

   // --------------- Constructor
   constructor(configData: ConfigData, sentence: Sentence) {
      this.configData = configData;
      this.sentence = sentence;
   }

   // --------------- Public Methods

   public makeSentenceFolder(): string {
      const subfolderPath = path.join(__dirname, "../../../audioCourse/", this.sentence.folderName);

      fs.mkdirSync(subfolderPath);

      return subfolderPath;
   }


   /* 
      Makes an audio of the sentence, in the sentence's subfolder
   */
   public async makeSentenceTrack(numberOfRepeats: number, prefix: string): Promise<void> {

      /**** Setup Audio Options ****/

      // define audio options (including text)
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
         throw Error(error);
      }

      const foreignAudioOptions = {
         ...sharedOptions
         , voice : { 
            ...sharedOptions.voice
            , languageCode : this.configData.languageCode 
         }
         , input : {text : foreignSentenceText}
      }

      const englishText = this.sentence.englishVersion;

      const englishAudioOptions = {
         ...sharedOptions
         , voice : { 
            ...sharedOptions.voice
            , languageCode : "en" 
         }
         , input : {text : englishText}
      }

      /**** Create 1st sentence audios ****/

      const tempFolder = tmp.dirSync({unsafeCleanup: true});
      
      const foreignAudioName = `${prefix} - ${foreignSentenceText}.ogg`;
      const foreignAudioTempPath = `${tempFolder}${foreignAudioName}`

      const englishAudioName = `${prefix} - ${this.sentence.folderName}.ogg`;
      const englishAudioTempPath = `${tempFolder}${englishAudioName}`
      
      this.fetchAndWriteAudio(foreignAudioOptions, foreignAudioTempPath);
      this.fetchAndWriteAudio(englishAudioOptions, englishAudioTempPath);
      // 1 level files saved to temp folder now


      /**** Add Pause ****/
      // 2 for 1st word, plus 1 per word thereafter
      let mainPauseDuration: number = 2 + this.sentence.foreignWordCount;
      if (mainPauseDuration > 12) { mainPauseDuration = 12 }
      const pauseFilePath = `${silenceFolderPath}/${mainPauseDuration}.ogg`;
      

      /**** Setup audio structure ****/
      const singlePassStructure = [englishAudioTempPath, pauseFilePath, foreignAudioTempPath, threeSecondPause];
      let endStructure = singlePassStructure;

      // if repeats are > 1, add another round of sentence repeats with a (much) shorter middle pause
      for (let i = 1; i <= numberOfRepeats - 1; i++) {
         const repeatStructure = [englishAudioTempPath, twoSecondPause, foreignAudioTempPath, threeSecondPause];

         endStructure.concat(repeatStructure);
      }

      /**** Save To Production Subfolder ****/
      
      const finalSaveFolderPath: string = path.join(audioParentFolderPath, this.sentence.folderName);


      this.combineAndSave(
         endStructure
         , finalSaveFolderPath
         , prefix
      )
   }

   public makeAllWordAudios() {}


   /* 
      Copies file to same folder with a different filename

      @param copiedFileName. Should contain the full filename including extension
   */
   public duplicateTrack(
      prefixMatcher: string
      , copiedFileName: string): void {

      const targetAudioFolder = `${audioParentFolderPath}${this.sentence.folderName}`;

      // readDirSync returns file names, not file paths
      const audioFileNames: string[] = fs.readdirSync(targetAudioFolder);
      
      const regexMatcherFromBeginning: RegExp = new RegExp(`^${prefixMatcher}`);
      
      const targetFile: string = audioFileNames.filter(filename => {
         const matchFound: boolean = regexMatcherFromBeginning.test(filename);
         
         return matchFound;
      })[0]; // returns first match only!

      const sourceFileNameAndPath = `${targetAudioFolder}/${targetFile}`;
      const copiedFileNameAndPath = `${targetAudioFolder}/${copiedFileName}`;

      fs.copyFileSync(sourceFileNameAndPath, copiedFileNameAndPath);
   }


   // --------------- Internal Methods

   public parseFileContents(filepath = path.join(__dirname, "../../../sentences.txt")): Array<string> {
      const sentenceCandidates = fs
         .readFileSync(filepath)
         .toString()
         .split("\n");

      return sentenceCandidates;
   }


   public async textTranslate(
      wordPhraseSentence: string
      , direction: translationDirection): Promise<string> {
      const translationClient = new TranslationServiceClient();

      // setup target and source language
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
         , contents: [wordPhraseSentence]
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
         throw Error(error.details);
      }

   }
   
   protected makeForeignAudio(englishText: string) {
      const textToSpeech = new TextToSpeechClient();

      const options = {
         input: { text: 1 }
         , voice: { languageCode: 1, ssmlGender: 1 }
         , audioConfig: { audioEncoding: "OGG" }
      }

   }

   public async autoGetForeignSentence(
      sentence: Sentence): Promise<ForeignPhraseDefinitionPair> {
      const foreignTranslation = await this.textTranslate(sentence.englishVersion, translationDirection.toEnglish);

      return {
         foreignPhrase : foreignTranslation
         , englishDefinition : sentence.englishVersion
      }
   }

   /* 
   Asks for the foreign word
   
   Gets a definition, asks for confirmation or an adjustment.
   Returns an object with the foreign word and definition pair
   
   Returns false if user marks "done" commands
   */
   public async getForeignWordAndDefinition()
      : Promise<ForeignPhraseDefinitionPair | false> {
      console.log("Please copy and paste the (next) foreign word in the sentence here. Or type -d or --done when all words in the sentence have been specified.")
      const userInput = readLine.question();

      const userHasExited = this.isDone(userInput);
      if (userHasExited) return false;

      // translate foreign to english
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
      Silence files are kept in {rootDir}/silences. 
      Delays from 1 to 12 seconds are available in 1 
      second increments

      ** Note: The audio combiner adds 2 seconds
   */
   public calculatePauseDuration(wordCount: number) {
      // word 1 gets 2 seconds automatically from the audio combiner.
      // this means all values are low by 2 seconds
      let pauseDuration = wordCount - 1;
      if (pauseDuration > 12) pauseDuration = 12;

      return pauseDuration;
   }


   // --------------- Internal Methods

   /* 
      send a text-to-speech request
      catch the audio stream. Save to file
   */
   protected async fetchAndWriteAudio(request: {
      input : { text : string }
      , voice : { languageCode : string, ssmlGender: voiceGender }
      , audioConfig : { 
         audioEncoding : "AUDIO_ENCODING_UNSPECIFIED" | "LINEAR16" | "MP3" | "OGG_OPUS" }
   }, fileNameAndPath: string)
      : Promise<ReturnType<typeof TextToSpeechClient.prototype.synthesizeSpeech>> {

      const textToSpeech = new TextToSpeechClient();
      const writeFileAsync = util.promisify(writeFile);

      try {
         const [audioResponse] = await textToSpeech.synthesizeSpeech(request);
         await writeFileAsync(fileNameAndPath, audioResponse.audioContent!);
      }
      catch(error) { console.log(error); }
   }
   
   /* 
      save an array of audios to a folder
   */
   protected combineAndSave(
      audiosAndPauseFiles: Array<string>
      , savePath: string
      , filePrefix: string
   ): void {
      const finalFileSavePath = `${savePath}/${filePrefix} - ${this.sentence.folderName}.ogg`;

      audioConcat(audiosAndPauseFiles)
         .concat(finalFileSavePath)
         .on("start", (command: any) => {
            console.log(`ffmpeg build process started on file: ${finalFileSavePath}`);
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


}