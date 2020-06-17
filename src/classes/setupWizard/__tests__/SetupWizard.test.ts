import WizardSteps from "../WizardStepsInterface";
import ConfigData from "../ConfigDataInterface";

import SetupWizard from "../SetupWizard";
import StepsBase from "../StepsBase";

// --------------- File Scoped setup

// Extend Stepsbase to expose methods used in the main orchestrator
class SetupWizardExtended extends SetupWizard {
   public saveExt(data: ConfigData, filePath: string): void {
      return this.save(data, filePath);   
   }

   public getValidInputExt(configStep: WizardSteps): string {
      return this.getValidInput(configStep);
   }

   public createSentenceFileExt() {
      return this.createSentenceFile();
   }
}


// test class to use as argument

class NothingToSave extends StepsBase {
   public hasSaveableData: boolean = true;
   public needsFileValidation: boolean = true;

}

class SavesLanguageCode extends StepsBase {
   public hasSaveableData: boolean = true;
   public configDataKey: string = "languageCode"

}

class SavesNumberOfRepeats extends StepsBase {
   public hasSaveableData: boolean = true;
   public configDataKey: string = "numberOfRepeats"
}


test("validates input and ends loop", () => {
   /**** Setup ****/
   const testInstance = new NothingToSave();
   const setupWizard = new SetupWizardExtended([testInstance]);
   jest.spyOn(testInstance, "prompt")
      .mockImplementation(() => "test input");

   /**** Execute & Assert ****/
   const returnValue = setupWizard.getValidInputExt(testInstance);

   expect(returnValue).toStrictEqual("test input");

   /**** Teardown ****/

});


// testing only the public interface will reduce technical debt from testing each private internal

// todo mock the file saving function
// todo mock the prompt functions to auto-return a value
// that is all that's needed. The dummy classes will do the rest
describe("run()", () => {
   test.skip("successful configData capture from reduce()", () => {

   })

   test.skip("successful save and sentence file build", () => {

   });

})