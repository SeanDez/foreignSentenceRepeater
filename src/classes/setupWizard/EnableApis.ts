import StepsBase from "./StepsBase";
import WizardSteps from "./WizardStepsInterface";

export default class EnableApis extends StepsBase implements WizardSteps {
   protected readonly description: string = `
***********************************
            Enable APIs
***********************************

For this step, you will need to log into Google Cloud and select the project you just created in the prior step. The project can be selected in the topmost nav bar, next to the Google Cloud logo (if it is not already chosen).

The next step is to enable two APIs: Translation, and Text-to-Speech.

Please go to the following pages and click the "Enable" button on each one:

1. https://console.cloud.google.com/apis/library/translate.googleapis.com

2. https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
`

   public readonly promptMessage: string = `After both APIs have been enabled, type "enabled" (without quotes) and press ENTER to continue to the next step...
   `

   public readonly invalidInputMessage: string = `
   
"enabled" (without quotes) was not entered.
`;

   constructor() { super(); }

   /**** Duck Typed Methods ****/

   public validateInput(rawUserInput: string): boolean {
      const normalizedInput = rawUserInput.trim().toLowerCase();

      if (normalizedInput === "enabled") {
         return true;
      }

      return false;
   }

}