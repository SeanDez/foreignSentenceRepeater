
export default class Sentence {
   public englishVersion: string;
   private folderName: string;

   // --------------- Constructor
   constructor(originalSentence: string) {
      this.englishVersion = originalSentence;
   }

   buildFolderName() {
      const capitalized = this.capitalizeAllWords();
      const unsafeCharsExcludedIncludingSpaces = this
         .stripNonWordFolderCharacters();
      this.folderName = unsafeCharsExcludedIncludingSpaces;
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