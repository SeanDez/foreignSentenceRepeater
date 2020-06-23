import path from "path";
import fs from "fs";

// dependent classes
import Sentence from "./Sentence";

export default class BuildOrchestrator {
   // --------------- Instance Properties
   public qualifiedSentences: Array<Sentence>;

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
      this.makeSentenceFolder(sentence);
   }

   // --------------- Internal Methods

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
   getTranslation(sentence: Sentence) {
      
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