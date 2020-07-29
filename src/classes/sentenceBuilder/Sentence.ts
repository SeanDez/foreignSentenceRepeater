import ForeignPhraseDefinitionPair from './ForeignPhraseDefinitionPairInterface';

// --------------- Standalone Functions

export function capitalizeAllWords(words: string[]): string {
  const capitalizedWords = words.map((word) => word[0].toUpperCase() + word.substring(1));

  return capitalizedWords.join(' ');
}

export function stripNonWordFolderCharacters(sentence: string): string {
  const allNonWordCharacters: RegExp = /\W/g;
  const updatedSentence = sentence.replace(allNonWordCharacters, '');
  return updatedSentence;
}

function countWords(sentence: string) {
  const words = sentence.split(' ');

  return words.length;
}

// --------------- Main Class

export default class Sentence {
  // --------------- Properties

   public englishVersion: string;

   public folderName: string;

   public foreignPhraseDefinitionPairs: ForeignPhraseDefinitionPair[]= [];

   public englishWordCount: number;

   public foreignWordCount: number = this.foreignPhraseDefinitionPairs.length;

   // --------------- Constructor
   // immediately builds its folder name representation
   // this is used at a higher level for a check, and create
   constructor(originalSentence: string) {
     this.englishVersion = originalSentence;
     this.folderName = this.buildFolderName();
     this.englishWordCount = countWords(this.englishVersion);
   }

   // --------------- Internal methods

   protected buildFolderName(): string {
     const words: string[] = this.englishVersion.split(' ');
     const capitalized = capitalizeAllWords(words);
     const noUnsafeCharacters = stripNonWordFolderCharacters(capitalized);
     return noUnsafeCharacters;
   }
}
