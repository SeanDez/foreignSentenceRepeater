import { instructions, pressEnter, instructionsType } from "../data/supportData";



export default class ArgumentParser {
   protected commandLineArgs: string[];
   protected instructions: instructionsType;

   constructor(argV: string[]) {
      this.commandLineArgs = argV;
      this.instructions = instructions
   }

   // ---------------  Public Methods


   // ---------------  Helpers

   protected countArgs() {}

   public parse() {
      // look for a flag in position 1
      // first two args are always "node" and {path}
      const arg1 = this.commandLineArgs[2];

      switch (arg1) {
         case "-i":
         case "--information": 
         case undefined: {
            console.log("this is the i/undefined case.")
            console.log('arg1', arg1);
            console.log('instructions', this.instructions.description);
            break;
         }

         case "-c":
         case "--configure": {

            break;
         }

         case "-b":
         case "--build": {

            break;
         }

         default: {
            // todo check for a sentence string
            // else respond: false argument
         }
      }

      // todo if no flag, test for a phrase/sentence
   }
}