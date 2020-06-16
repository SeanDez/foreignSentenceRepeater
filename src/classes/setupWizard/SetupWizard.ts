import WizardSteps from "./WizardStepsInterface";
import ConfigData from "./ConfigDataInterface";
import fs from "fs";
import path from "path";


/* SetupWizard will loop through child classes that employ some of these processes

(some) children: overview, setupRole, setupTTSApi, setupTranslateApi, 
*/


/* Takes an array of steps. Runs them in sequence
   todo Have this code reviewed
*/
export default class SetupWizard {
   private steps: Array<WizardSteps>;
   private sentenceFilePath: string;
   
   constructor(allSteps: Array<WizardSteps>) {
      this.steps = allSteps;
      this.sentenceFilePath = path.join(__dirname, "../../../sentences.json");
   }

   // duck type the checkers
 
   /* Handle looping of the step logic
      Each step will explain. Some will validate input
   */
   public run(): void {
      // run all steps. Compile into config object
      const configData = this.steps.reduce(
         (accumulator: Partial<ConfigData>, currentStepInstance: WizardSteps): Partial<ConfigData> => {
         // instruct and ask for feedback
         currentStepInstance.explain();

         // loop until a valid input is returned
         // exitChars are valid inputs and also handled
         const validatedUserInput: string = this.getValidInput(currentStepInstance);

         // blocks until valid file is found, on file validation steps
         if (currentStepInstance.needsFileValidation) {
            currentStepInstance.validateFile();
         }

         // return a k/v pair for steps with important inputs
         if (currentStepInstance.hasSaveableData) {
            return {
               [currentStepInstance.configDataKey] : validatedUserInput
            };
         } 
      }, {}) as ConfigData; // assert return type on .reduce()

      // save
      // no check is needed. Intentionally overwrites any current config
      this.save(configData);

      // create sentence file (if it doesn't already exist)
      this.createSentenceFile();
   }

   

   // --------------- Helper methods

   /* create and add data to the config file
   */
   private save(
      configFileData: ConfigData
      , filePath: string = path.join(__dirname, "../../../configuration.json")
      ): void {
      // __dirname will be transpiled to the current directory
      fs.writeFile(
         filePath
         , JSON.stringify(configFileData)
         , "utf8"
         , error => {
            if (error) {
               console.log(error);
               return;
            }
         }
      );

      // assumed successful
      console.log("Your configuration has been saved to \"configuration.json\" in the project root");
   }

   // need also, data to tell if the wizard has returnable data
   
   /* Main function is to loop until an input is deemed valid
      Validator contained in the object itself, accesed via duck typing
   */
   private getValidInput(configStep: WizardSteps): string {
      let continueLooping = true;

      while (continueLooping === true) {
         const rawInput: string = configStep.prompt();

         // check for an exit value
         this.exitCheck(rawInput);

         const inputIsValid: boolean = configStep.validateInput(rawInput);

         if (inputIsValid) {
            continueLooping = false;
            return rawInput;
         } else {
            console.log(configStep.invalidInputMessage)
         }
      }
   }

   public exitCheck(userInput: string) {
      const normalizedUserInput = userInput.trim().toLowerCase();
      enum exitCodes { exit = "exit", quit = "quit" }

      if (normalizedUserInput === exitCodes.exit ||
          normalizedUserInput === exitCodes.quit
          ) {
          process.exit();
      }
  }

  private createSentenceFile() {
     fs.writeFileSync(this.sentenceFilePath, "Put all sentences (and phrases) to be translated here, one per line.");
  }

}