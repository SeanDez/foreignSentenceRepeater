

/* SetupWizard will loop through child classes that employ some of these processes

(some) children: overview, setupRole, setupTTSApi, setupTranslateApi, 
*/
interface WizardSteps {
   explain(): string|false
   , validate?(): boolean
   , save?(userResponse: string): boolean
}


/* Takes an array of steps. Runs them in sequence
   todo Have this code reviewed
*/
class SetupWizard {
   protected steps: Array<WizardSteps>;
   
   constructor(allSteps: Array<WizardSteps>) {
      this.steps = allSteps;
   }

   // duck type the checkers
 
   run() {
   // explain
   // validate
   // save'

   this.steps.forEach(async configStep => {
      // capture the answer
      const userResponse: string|false = await configStep.explain();

      // if a string was returned, validate and save
      if (typeof userResponse === "string") {
         const isValidated: boolean = configStep.validate();
         
         if (isValidated) configStep.save(userResponse);
      }

   })

   // 

   }


}