import foresignWordDefinitionPair from "./ForeignPhraseDefinitionPairInterface";
import ForeignWordDefinitionPair from "./ForeignPhraseDefinitionPairInterface";

export default class Sentence {
   // --------------- Properties

   public englishVersion: string;
   public folderName: string;
   public foreignWordDefinitionPairs: ForeignWordDefinitionPair[]= []; 


   // --------------- Constructor
   // immediately builds its folder name representation
   // this is used at a higher level for a check, and create
   constructor(originalSentence: string) {
      this.englishVersion = originalSentence;
      this.buildFolderName();
   }

   public buildFolderName(): void {
      const capitalized = this.capitalizeAllWords();
      const noUnsafeCharacters = this
         .stripNonWordFolderCharacters();
      this.folderName = noUnsafeCharacters;
   }

   // --------------- Internal methods

   protected capitalizeAllWords() {
      const words: string[] = this.englishVersion.split(" ");

      // capitalize
      const capitalizedWords = words.map(word => {
         return word[0].toUpperCase() + word.substring(1);
      })

      return capitalizedWords.join(" ");
   }

   protected stripNonWordFolderCharacters() {
      let testString = this.englishVersion;
      const allNonWordCharacters = /\W/g;

      testString = testString.replace(allNonWordCharacters, "");

      return testString;
   }

   
   
}