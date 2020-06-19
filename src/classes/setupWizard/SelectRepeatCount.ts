import WizardSteps from "./WizardStepsInterface";
import StepsBase from "./StepsBase";
import { isNumber } from "util";

export default class SelectLanguage extends StepsBase implements WizardSteps {
   public readonly hasSaveableData: boolean = true;
   public readonly configDataKey: string = "numberOfRepeats";
   private maxRepeats: number = 30;

   public readonly header: string = `
******************************************
    SELECT REPETITIONS PER PLAYTHROUGH
******************************************
   `
   public readonly description: string = `In a single playthrough, the generated file will play the following in sequence:
   
1. The sentence in English, and then in the target language.
2. Each individual word in English, and then the target language.
3. The full sentence again in English, and then the target language.

Please note that the 2nd step is the longest, since it is looped for every word.

In this step you will set a global value of how many times the sentences and words will repeat in English and the target language. I recommend a setting of 2 or 3 to strike a balance between hearing each part repeatedly for memorization and practice, without becoming excessively routine and boring on a single playthrough.

However, any value from 1 to ${this.maxRepeats} may be selected.
   `

   public readonly promptMessage: string = `Enter the number of repeats you would like to use.
   `

   public readonly invalidInputMessage: string = `Invalid value. Please enter a value between 1 and ${this.maxRepeats}
   `;


   /**** Duck Typed methods ****/

   public validateInput(userInput: string) {
      // coerce to number. Then check if the number is between 1 and maxRepeats
      const numberSuspect = Number(userInput);
      const isNumber = Number.isNaN(numberSuspect) === false;

      if (isNumber && 
         numberSuspect > 0 && 
         numberSuspect <= this.maxRepeats
         ) {
            return true;
         }

      return false;
   }


}