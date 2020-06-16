import SetupWizard from "../SetupWizard";
import WizardSteps from "../WizardStepsInterface";

// test class to use as argument
class TestStep implements WizardSteps {
   public hasSaveableData: boolean;
   public needsFileValidation: boolean;

   constructor(
      hasSaveableData: boolean
      , needsFileValidation: boolean
   ) {
      this.hasSaveableData = hasSaveableData;
      this.needsFileValidation = needsFileValidation;
   }

   public explain(): string|void {

   }

   public prompt(): string {
      return "prompt message";
   }

   public validateInput(userInput: string): boolean {
      if (userInput === "matches test") {
         return true;
      }

      return false;
   }

   public validateFile(filePath: string) {

   }

   public format(userInput: string): boolean|void {

   }
}


test("saves a config file", () => {
   /**** Setup ****/
   const setupWizard = new SetupWizard([new TestStep(false, false)]);

   /**** Execute & Assert ****/
   

   /**** Teardown ****/

});

