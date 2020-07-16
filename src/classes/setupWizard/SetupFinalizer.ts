import path from 'path';
import fs from 'fs';
import ConfigData from './ConfigDataInterface';

export default class SetupFinalizer {
  // --------------- Properties

   private sentenceFilePath: string;

   private header: string = `
***********************************************
 SETUP COMPLETE. NEXT STEPS: SENTENCES & BUILD 
***********************************************   
   `

   private description: string = `Your project has been configured! Now you just need to define some sentences and build your audios.

I recommend building only 1 to 5 sentences or phrases to start. Starting with a small batch, you can verify the format is as you want before building out your full course. 

To add sentences or phrases, open sentences.txt in the project root and add them. Each line denotes a new sentence/phrase to be placed in a unique subfolder and built.
   
After saving your file, run "node compiled/index.js --build" (or -b) from the project root to build your audios.
   `

   // --------------- Constructor
   constructor() {
     this.sentenceFilePath = path.join(__dirname, '../../../sentences.txt');
   }

   // --------------- Public Methods

   /* create and add data to the config file
   */
   public save(
     configFileData: ConfigData,
     filePath: string = path.join(__dirname, '../../../configuration.json'),
   ): boolean {
     // __dirname will be transpiled to the current directory
     fs.writeFile(
       filePath,
       JSON.stringify(configFileData, null, '\t'),
       'utf8',
       (error) => {
         if (error) {
           console.log(error);
           return false;
         }
       },
     );

     console.log(`
Configuration settings saved.
      `);

     return true;
   }

   public createSentenceFile(): boolean {
     try {
       fs.writeFileSync(
         this.sentenceFilePath,
         'Put all sentences (and phrases) to be translated here, one per line.',
       );

       console.log(
         '"sentences.txt" has been created in the project root.',
       );

       return true;
     } catch (error) {
       console.log(error);
       return false;
     }
   }

   public printFinalInstructions() {
     console.log(this.header);
     console.log(this.description);
   }
}
