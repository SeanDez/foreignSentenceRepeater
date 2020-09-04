export enum contentTypes { foreignWord, englishDefinition }

/*
   This class is used to add important metadata

   The metadata will be used in an AutoMaker subprocess to stiche together the audio file correctly

   Properties needed: content type (foreign / definition), pauseAdjustment
   before/after, middle pause
*/
export default class WordFile {
   // --------------- Properties
   public readonly contentType: contentTypes | null;

   public readonly middlePause: number;

   public readonly beforePausePadding: number;

   public readonly afterPausePadding: number;

   public readonly fileName: string;

   public readonly folderPath: string;

   public readonly fullFilePath: string;

   constructor(
     fileName: string,
     folderPath: string,
     middlePause: number = 3,
     beforePausePadding: number = 0,
     afterPausePadding: number = 3,
   ) {
     this.fileName = fileName;
     this.contentType = this.getContentTypeFromFileName();
     this.folderPath = folderPath;
     this.middlePause = Math.ceil(middlePause);
     this.beforePausePadding = Math.ceil(beforePausePadding);
     this.afterPausePadding = Math.ceil(afterPausePadding);

     this.fullFilePath = this.setFullFolderPath();
   }

   // --------------- Public methods

   // --------------- Internal methods

   private setFullFolderPath() {
     return `${this.folderPath}/${this.fileName}`;
   }

   private getContentTypeFromFileName() {
     // grab the first number
     const firstNumberPattern: RegExp = /^\d+/;
     const potentialMatch: RegExpMatchArray | null = this.fileName.match(firstNumberPattern);

     if (Array.isArray(potentialMatch)) {
       const firstNumber: number = Number(potentialMatch[0]);

       // if it ends with 2 it's a definition. Else, a foreign word
       const numberIsEven = firstNumber % 2 === 0;

       if (numberIsEven) {
         return contentTypes.englishDefinition;
       }

       return contentTypes.foreignWord;
     }

     throw new Error('Number not pattern matched in word filename');
   }
}
