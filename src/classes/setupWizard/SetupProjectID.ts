import StepsBase from "./StepsBase";
import WizardSteps from "./WizardStepsInterface";

export default class SetupProjectID extends StepsBase implements WizardSteps {
   public readonly hasSaveableData: boolean = true;
   public readonly configDataKey: string = "projectId";

   protected header: string = `
*************************************  
         CONFIGURE PROJECT ID
*************************************
`

   protected description: string = `In this step you will find, and then enter your Google Cloud project ID. 
   
   This page has instructions on how you can find this ID: https://support.google.com/googleapi/answer/7014113?hl=en
   `;

   protected promptMessage: string = `Please type or copy/paste your project ID, and press ENTER to continue:
   `;

   public readonly invalidInputMessage: string = `
   That is an invalid project ID. Valid IDs are all lowercase letters, numbers, and hyphens. They start with a letter, and are 6 to 30 characters in length.
   `;

   /**** Duck Typed Methods ****/

   public validateInput(rawUserInput: string): boolean {
      const upperCaseRegex: RegExp = /[A-Z]/;
      const hasUpperCaseChar: boolean = upperCaseRegex.test(rawUserInput);

      const hasNonWordCharBesidesHyphen: boolean = (/[^\w-]/.test(rawUserInput));

      const startsWithLetter = (/[a-z]/.test(rawUserInput[0]));

      const tooShort = rawUserInput.length <= 5;
      const tooLong = rawUserInput.length >= 31;

      if (startsWithLetter === false ||
         hasNonWordCharBesidesHyphen || hasUpperCaseChar ||
         tooShort || tooLong
         ) {
            return false;
         }

      return true;
   }

}