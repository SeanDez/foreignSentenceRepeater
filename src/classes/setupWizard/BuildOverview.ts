import StepsBase from "./StepsBase";
import WizardSteps from "./WizardStepsInterface";

import readLine from "readline-sync";

export default class BuildOverview extends StepsBase implements WizardSteps {
   // --------------- Instance Properties
   
   protected readonly header: string = `
***********************************   
       AUDIO BUILDER WIZARD
***********************************
   `;

   protected readonly description: string = `This is the final step before your audio course is built.

After you continue, you will be asked to identify each foreign word in the translated sentence. Then you must provide a translation in English for each word. The script was designed this way to allow you to choose the best definition for the given context. This does increase the effort for a word by word identification and definition though.

Translations can be found on the Google Translate page: https://translate.google.com/

** When you're done selecting foreign words and definition pairs for a sentence, type "--done" without quotes. This will move you to the next sentence until all are finished. **

At that point your audio course can be found in /audioCourse. Enjoy!

You can type "quit" or "exit" at any time to exit the build wizard before finishing every sentence.  
   `;

   protected readonly promptMessage: string = `Press ENTER to begin word selection and definition...
   `

}