import StepsBase from "./StepsBase";


class Overview extends StepsBase {
   public prompt: `
   
   Ready to setup your project? Press Enter to begin the wizard.
   
   `
   public description: string = `

   OVERVIEW

   This app will accept a series of sentences, and output subfolders matching the sentence. 

   * Each subfolder will have audio files that speak the sentence in English. 

   * The foreign language version of the sentence will be then spoken X number of times (X is user defined).

   * Next comes word drilling. Each word in the sentence will then be stated once in English, then X number of times as well.

   * Finally, the full sentence will repeat again, in English and then X number of times in the foreign language

   All audio files are saved in .ogg format.

   `;

   public explain() {}

   public validate() {}

   public save() {}

}