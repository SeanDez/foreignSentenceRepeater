import WizardSteps from "./WizardStepsInterface";
import fs from "fs";
import path from "path";


/* SetupWizard will loop through child classes that employ some of these processes

(some) children: overview, setupRole, setupTTSApi, setupTranslateApi, 
*/


/* Takes an array of steps. Runs them in sequence
   todo Have this code reviewed
*/
export default class SetupWizard {
   protected steps: Array<WizardSteps>;
   
   constructor(allSteps: Array<WizardSteps>) {
      this.steps = allSteps;
   }

   // duck type the checkers
 
   /* Handle looping of the step logic
      Each step will explain. Some will validate input
   */
   run() {

      const configData = {};

      this.steps.forEach(async configStep => {
         // capture the answer
         const rawUserResponse: string|void = await configStep.explain();

         // if a string was returned, validate and save
         if (typeof rawUserResponse === "string") {
            const isValidated: boolean|void = configStep.validate(rawUserResponse);
            
            if (isValidated && configStep.hasSaveableData) { 
               // convert to kv pair
               const formattedForConfiguration = configStep.format(rawUserResponse);

               // save to local object
               Object.assign(configData, formattedForConfiguration);
            }
         }
      })

      return configData;
   }

   /* create and add data to the config file
   */
   save(configFileData: {
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


}