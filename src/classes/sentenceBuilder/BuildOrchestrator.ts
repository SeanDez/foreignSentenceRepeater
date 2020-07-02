import path from "path";
import fs from "fs";
import readLine from "readline-sync";
const audioConcat = require("audioconcat");

// dependent classes
import {translationDirection} from "../minorTypes";
import Sentence from "./Sentence";
import Utilities from "../Utilities";
import AudioMaker from "./AudioMaker";
import ConfigData from "../setupWizard/ConfigDataInterface";
import ForeignPhraseDefinitionPair from "./ForeignPhraseDefinitionPairInterface";


export default class BuildOrchestrator {
   // --------------- Instance Properties
   private configData: ConfigData;
   public qualifiedSentences: Array<Sentence>;

   // --------------- Constructor
   constructor() {
      this.configData = this.setConfigData();
      this.setQualifiedSentences();
   }

   // --------------- Public Methods

   /* 
      This method controls the high level creation of each subfolder, along with audio contents

   */
   public async makeFolderAndAudioFile(
      sentence: Sentence
      ): Promise<void> {
      
      // make folder IF not already there
      // start a loop to parse all foreign words and attach definitions
         // do this in another class 
      
      const audioMaker = new AudioMaker(this.configData, sentence);
      const subFolderPath = audioMaker.makeSentenceFolder();
      const tempFolderPath = fs.mkdtempSync(subFolderPath);
      audioMaker.makeSentenceAudio(tempFolderPath, this.configData.numberOfRepeats);
      audioMaker.makeAllWordAudios(tempFolderPath);
      audioMaker.combineAll(tempFolderPath);
      audioMaker.cleanUp(tempFolderPath);
      
   }

   public printCountOfValidSentences() {
      console.log(`${this.qualifiedSentences} valid sentences (more than one character long) were found and parsed.`);
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


   protected setQualifiedSentences(filePath: string = undefined): void {
      const sentenceCandidates: string[] = this.parseSentenceFile();
      this.validateAndSetSentenceCandidates(sentenceCandidates);
   }


   public parseSentenceFile(filepath = path.join(__dirname, "../../../sentences.txt")): Array<string> {
      const sentenceCandidates = fs
         .readFileSync(filepath)
         .toString()
         .split("\n");

      return sentenceCandidates;
   }

   /* Assigns instance property `qualifiedSentences`
      If length is greater than 1 the sentence/phrase passes 
   */
   protected validateAndSetSentenceCandidates(candidates: string[]): void {
      const passedTheTest: Sentence[] = candidates.map(candidate => {
         if (candidate.length >= 2) {
            return new Sentence(candidate);
         }
      });

      this.qualifiedSentences = passedTheTest;
   }

   public checkForExistingFolder(sentence: Sentence): boolean {
      const {folderName} = sentence;

      return fs.existsSync(path.join(__dirname, `../../../audioCourse/${folderName}`));
   }

}