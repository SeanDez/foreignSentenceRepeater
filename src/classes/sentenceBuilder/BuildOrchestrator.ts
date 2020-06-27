import path from "path";
import fs from "fs";
import readLine from "readline-sync";

import ConfigData from "../setupWizard/ConfigDataInterface";
import ForeignWordDefinitionPair from "./ForeignWordDefinitionPairInterface";
import Utilities from "../Utilities";

const {TranslationServiceClient} = require('@google-cloud/translate');

// dependent classes
import Sentence from "./Sentence";

enum translationDirection { toForeign, toEnglish }

export default class BuildOrchestrator {
   // --------------- Instance Properties
   public qualifiedSentences: Array<Sentence>;
   private configData: ConfigData;

   // --------------- Constructor
   constructor() {
      this.configData = this.setConfigData();
   }

   // --------------- Public Methods

   public parseValidateAndPrintSentenceCount(filePath: string = undefined): void {
      const sentenceCandidates = this.parseSentenceFile();
      this.validateSentenceCandidates(sentenceCandidates);
      this.printCountOfValidSentences();
   }

   public checkForExistingFolder(sentence: Sentence): boolean {
      const {folderName} = sentence;

      return fs.existsSync(path.join(__dirname, `../../../audioCourse/${folderName}`));
   }

   public async makeFolderAndAudioFile(sentence: Sentence): Promise<void> {
      // make folder IF not already there
      // start a loop to parse all foreign words and attach definitions
         // do this in another class 
      this.makeSentenceFolder(sentence);

      // get foreign language text for the full english sentence
      const foreignText: string = await this.textTranslate(sentence.englishVersion, translationDirection.toEnglish);

      // get all foreign word and english definition pairs
      const wordDefinitionPairs: Array<ForeignWordDefinitionPair> = await Utilities.loopUntilFalse(this.getForeignWordAndDefinition);
   }

   // --------------- Internal Methods

   protected setConfigData(): ConfigData {
      // read config file
      const configData = JSON.parse(
         path.join(__dirname, 
            "../../../configuration.json"
         )
      );

      // set it to the config property
      const moddedConfig: Partial<{
         languageCode: string
         , numberOfRepeats: number
      }> = Object.keys(configData).reduce((moddedObject, currentKey) => {
         if (currentKey = "numberOfRepeats") {
            return {
               ...moddedObject
               , currentKey : Number(configData[currentKey])
            }
         }

         return {
            currentKey : configData[currentKey]
         }
      }, {})

      return moddedConfig as ConfigData;
   }

   protected parseSentenceFile(filepath = path.join(__dirname, "../../../sentences.txt")): Array<string> {
      const sentenceCandidates = fs
         .readFileSync(filepath)
         .toString()
         .split("\n");

      return sentenceCandidates;
   }

   protected makeSentenceFolder(sentence: Sentence): void {
      fs.mkdirSync(path.join(__dirname, "../../../audioCourse/", sentence.folderName));
   }

   /**** Audio file creation ****/

   public async textTranslate(wordPhraseSentence: string, direction: translationDirection): Promise<string> {
      const translationClient = new TranslationServiceClient();

      // setup target and source language
      let sourceLanguage: string;
      let targetLanguage: string;
      if (direction === translationDirection.toEnglish) {
         sourceLanguage = this.configData.languageCode;
         targetLanguage = "en";
      } else if (direction === translationDirection.toForeign) {
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
      }

   }
   
   /* 
   Asks for the foreign word
   
   Gets a definition, asks for confirmation or an adjustment.
   Returns an object with the foreign word and definition pair
   
   Returns false if user marks "done" commands
   */
   protected async getForeignWordAndDefinition()
      : Promise<ForeignWordDefinitionPair | false> {
      console.log("Please copy and paste the (next) foreign word in the sentence here. Or type -d or --done when all words in the sentence have been specified.")
      const userInput = readLine.question();

      const userHasExited = this.isDone(userInput);
      if (userHasExited) return false;

      // translate foreign to english
      const foreignWord = userInput;

      const googleOfferedDefinition: string = await this.textTranslate(
         foreignWord, translationDirection.toEnglish
      );

      console.log("Type your own contextual definition for this word now. It will be used during audio translation. Or, press ENTER without typing anything to accept the following default definition from Google Translate:")
      console.log(googleOfferedDefinition);
      const userDefinition: string = readLine.question();

      let acceptedDefinition = googleOfferedDefinition;
      if (userDefinition !== "") {
         acceptedDefinition = userDefinition;
      } 

      // shape the object and return it
      const foreignWordDefinitionPair: ForeignWordDefinitionPair = {
         foreignWord
         , englishDefinition: acceptedDefinition
      }

      return foreignWordDefinitionPair;
   }


   private isDone(userInput: string): boolean {
      if (userInput === "-d" || userInput === "--done") {
         return true;
      }

      return false;
   }


   /* Assigns instance property `qualifiedSentences`
      If length is greater than 1 the sentence/phrase passes 
   */
   protected validateSentenceCandidates(candidates: string[]) {
      const passedTheTest: Sentence[] = candidates.map(candidate => {
         if (candidate.length >= 2) {
            return new Sentence(candidate);
         }
      });

      this.qualifiedSentences = passedTheTest;
   }

   protected printCountOfValidSentences() {
      console.log(`${this.qualifiedSentences} valid sentences (more than one character long) were found and parsed.`);
   }

}