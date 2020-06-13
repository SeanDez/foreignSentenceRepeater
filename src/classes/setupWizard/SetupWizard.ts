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
   
   constructor(allSteps: Array<WizardSteps>) {
      this.steps = allSteps;
   }

   // duck type the checkers
 
   /* Handle looping of the step logic
      Each step will explain. Some will validate input
   */
   run(): ConfigData {
      const configData = this.steps.reduce((accumulator: Partial<ConfigData>, currentStepInstance: WizardSteps): Partial<ConfigData> => {
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
         } else {
            currentStepInstance.prompt();
         }
      }, {}) as ConfigData; // assert the method return type

      return configData;
   }
   

   // --------------- Helper methods

   /* create and add data to the config file
   */
   private save(configFileData: {
      languageCode : string
      , numberOfRepeats : string
   }): void {
      // __dirname will be transpiled to the current directory
      fs.writeFile(
         path.join(__dirname, "../../../configuration.json")
         , JSON.stringify(configFileData)
         , "utf8"
         , error => {
            if (error) {
               console.log(error);
            }
         }
      );
   }

   // need also, data to tell if the wizard has returnable data
   
   /* Main function is to loop until an input is deemed valid
      Validator contained in the object itself, accesed via duck typing
   */
   private getValidInput(configStep: WizardSteps): string {
      let continueLooping = true;

      while (continueLooping === true) {
         const rawInput: string = configStep.prompt();
         const inputIsValid: boolean = configStep.validateInput(rawInput);

         if (inputIsValid) {
            continueLooping = false;
            return rawInput;
         } else {
            console.log(configStep.invalidInputMessage)
         }
      }
   }

   /* 0 is a success exit code
   */
   private exit() { process.exit(0); }


}