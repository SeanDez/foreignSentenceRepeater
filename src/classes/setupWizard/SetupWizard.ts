import WizardSteps from "./WizardStepsInterface";
import ConfigData from "./ConfigDataInterface";
import fs from "fs";
import path from "path";


/* SetupWizard will loop through child classes that employ some of these processes

(some) children: overview, setupRole, setupTTSApi, setupTranslateApi, 
*/


/* Takes an array of steps. Runs them in sequence
*/
export default class SetupWizard {
   // --------------- Properties
   private steps: Array<WizardSteps>;
   
   constructor(allSteps: Array<WizardSteps>) {
      this.steps = allSteps;
   }

   
   // --------------- Public Methods
 
   /* Handle looping of the step logic
      Each step will explain. Some will validate input
   */
   public initialSetup(): ConfigData {
      // run all steps. Compiles steps with returnable k/v pairs into a config object

      const configData = this.steps.reduce(
         (accumulator: Partial<ConfigData>, currentStepInstance: WizardSteps): Partial<ConfigData> => {
         console.log("accumulator", accumulator);

         // instruct
         currentStepInstance.explain();

         // loop until a valid input is returned
         // exit code is also handled
         const validatedUserInput: string = this.getValidInput(currentStepInstance);
         console.log('validatedUserInput', validatedUserInput);

         // blocks until valid file is found, on file validation steps
         if (currentStepInstance.needsFileValidation) {
            currentStepInstance.validateFile();
         }

         // return a k/v pair for steps with important inputs
         const returnObject = {...accumulator};

         if (currentStepInstance.hasSaveableData) {
            Object.assign(returnObject, {
               [currentStepInstance.configDataKey] : validatedUserInput
            });
         } 

         return returnObject;
      }, {}) as ConfigData; // assert return type on .reduce()

      console.log('full object: configData', configData)
      return configData;
   }

   

   // --------------- Helper methods

   /* Main function is to loop until an input is deemed valid
      Validator is contained in the object itself, accesed via duck typing
   */
   protected getValidInput(configStep: WizardSteps): string {
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


   private exitCheck(userInput: string) {
      const normalizedUserInput = userInput.trim().toLowerCase();
      enum exitCodes { exit = "exit", quit = "quit" }

      if (normalizedUserInput === exitCodes.exit ||
          normalizedUserInput === exitCodes.quit
          ) {
          process.exit();
      }
  }

}