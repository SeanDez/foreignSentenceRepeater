import WizardSteps from "./WizardStepsInterface";
import StepsBase from "./StepsBase";
import readLine from "readline-sync";
import fs from "fs";
import path from "path";

export default class SetupRole extends StepsBase implements WizardSteps {
   /**** Properties ****/
   public needsFileValidation: boolean = true;
   
   public readonly header: string = `
*************************************  
 SETUP GOOGLE CLOUD CREDENTIALS FILE
*************************************

   `

   protected readonly description: string = `To use this app, you will need a Google Cloud account. 
   
1. Sign up on this page: cloud.google.com/gcp/
   
2. Next, please follow the steps on this page to create a service account role and obtain a key file: https://cloud.google.com/iam/docs/creating-managing-service-account-keys

3. Save the key file to the project root as googleCredentials.json. Make sure spelling is exact, including the capital C! 
`

   public readonly promptMessage: string = `Press any key to verify that your googleCredentials.json file is present and continue...
   `

   private readonly validationFailedMessage: string = `Credentials file not found in project root...`


   /**** Duck Typed methods ****/

   public validateFile(): void {
      while (true) {
         const fileExists: boolean = this.checkForCredentialsFile();

         if (fileExists) {
            return; // the only exit path
         } else {
            console.log(this.validationFailedMessage);
            
            // ask them to fix the issue again before the loop resets and does another check
            this.prompt(); 
         }
      }
   }


   /**** Workers ****/

  protected checkForCredentialsFile(
     filePath = path.join(__dirname, "../../../googleCredentials.json"))
     : boolean {

      return fs.existsSync(filePath);
   }

}