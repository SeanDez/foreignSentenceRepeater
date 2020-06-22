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

   public checkForExistingFolder(sentence: Sentence) {

   }

   public buildFolderAndAudioFile(sentence: Sentence) {
      
   }

   // --------------- Internal Methods

   protected parseSentenceFile(filepath = path.join(__dirname, "../../../sentences.txt")): Array<string> {
      const sentenceCandidates = fs
         .readFileSync(filepath)
         .toString()
         .split("\n");

      return sentenceCandidates;
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