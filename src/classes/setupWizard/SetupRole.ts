import WizardSteps from "./WizardStepsInterface";
import StepsBase from "./StepsBase";
import readLine from "readline-sync";
import fs from "fs";

export default class SetupRole extends StepsBase implements WizardSteps {

   private description: string = `To use this app, you will need a Google Cloud account. 
   
1. Sign up on this page: cloud.google.com/gcp/
   
2. Next, please follow the steps on this page to create a service account role and obtain a key file: https://cloud.google.com/iam/docs/creating-managing-service-account-keys

3. Save the key file to the project root as googleCredentials.json. Make sure spelling is exact, including the capital C! 
`

   protected prompt: string = `Once you have saved the key file as googleCredentials.json, press any key to validate your file is present and continue...
   `

   public explain() {
      console.log(this.description);
      console.log(this.prompt);
   }

   /* checks for existing google credentials file 
   */
   public validate(filePath = "../../../googleCredentials.json"): boolean {
      return fs.existsSync(filePath);
   }
}