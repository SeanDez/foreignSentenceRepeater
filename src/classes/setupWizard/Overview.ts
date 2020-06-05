import StepsBase from "./StepsBase";
import WizardSteps from "./WizardStepsInterface";
import readLine from "readline-sync";

export default class Overview extends StepsBase implements WizardSteps {
   public prompt: string = `Ready to setup your project? Press any key to begin the setup wizard (You may exit at any time with CTRL+V).
   `;

   public description: string = `OVERVIEW

This app will accept a series of sentences, and output subfolders matching the sentence. 

* Each subfolder will have audio files that speak the sentence in English. 

* The foreign language version of the sentence will be then spoken X number of times (X is user defined).

* Next comes word drilling. Each word in the sentence will then be stated once in English, then X number of times as well.

* Finally, the full sentence will repeat again, in English and then X number of times in the foreign language

All audio files are saved in .ogg format.
`;

   constructor() {
      super()
   }

   public explain(): void {
      console.log(this.header);
      console.log(this.description);

      // the answer is discarded
      readLine.keyIn(this.prompt);
   }

}