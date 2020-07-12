import foresignWordDefinitionPair from "./ForeignPhraseDefinitionPairInterface";
import ForeignPhraseDefinitionPair from "./ForeignPhraseDefinitionPairInterface";

export default class Sentence {
   // --------------- Properties

   public englishVersion: string;
   public folderName: string;
   public foreignPhraseDefinitionPairs: ForeignPhraseDefinitionPair[]= []; 
   public foreignWordCount: number = this.foreignPhraseDefinitionPairs.length;


   // --------------- Constructor
   // immediately builds its folder name representation
   // this is used at a higher level for a check, and create
   constructor(originalSentence: string) {
      this.englishVersion = originalSentence;
      this.folderName = this.buildFolderName();
   }

   public buildFolderName(): string {
      const capitalized = this.capitalizeAllWords();
      const noUnsafeCharacters = this
         .stripNonWordFolderCharacters();
      return noUnsafeCharacters;
   }

   // --------------- Internal methods

   protected capitalizeAllWords(): string {
      const words: string[] = this.englishVersion.split(" ");

      // capitalize
      const capitalizedWords = words.map(word => {
         return word[0].toUpperCase() + word.substring(1);
      })

      return capitalizedWords.join(" ");
   }

   protected stripNonWordFolderCharacters(): string {
      let testString = this.englishVersion;
      const allNonWordCharacters: RegExp = /\W/g;

      testString = testString.replace(allNonWordCharacters, "");

      return testString;
   }

   
   
}