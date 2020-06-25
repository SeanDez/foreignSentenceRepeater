import path from "path";
import fs from "fs";

import ConfigData from "../setupWizard/ConfigDataInterface";

const {TranslationServiceClient} = require('@google-cloud/translate');

// dependent classes
import Sentence from "./Sentence";

export default class BuildOrchestrator {
   // --------------- Instance Properties
   public qualifiedSentences: Array<Sentence>;
   private configData: {
      languageCode: string
      , numberOfRepeats: number
   }

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

      return fs.existsSync(path.join(__dirname, `../../../audioCourse/${folderName}`))
   }

   public makeFolderAndAudioFile(sentence: Sentence) {
      // make folder IF not already there
      // get text translation
      // start a loop to parse all foreign words and attach definitions
         // do this in another class 
      this.makeSentenceFolder(sentence);

      const foreignText = this.textTranslate(sentence);

      

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

   // translate
   public async textTranslate(wordPhraseSentence: Sentence) {
      // access the right property for the variable to be used for translation
      let englishText: string;
      if (wordPhraseSentence instanceof Sentence) {
         englishText = wordPhraseSentence.englishVersion;
      }


      const translationClient = new TranslationServiceClient();

      const options = {
         parent: `projects/projectIdHere`
         , contents: [englishText]
         , mimeType: 'text/plain'
         , targetLanguageCode: this.configData.languageCode
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
   
   // start word asking loop


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