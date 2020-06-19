import ConfigData from "./setupWizard/ConfigDataInterface";
import SetupWizard from "./setupWizard/SetupWizard";

// step instances
import Overview from "./setupWizard/Overview";
import SetupRole from "./setupWizard/SetupRole";
import EnableApis from "./setupWizard/EnableApis";
import SelectLanguage from "./setupWizard/SelectLanguage";

export default class ArgumentParser {
   protected commandLineArgs: string[];

   constructor(argV: string[]) {
      this.commandLineArgs = argV;
   }

   // ---------------  Public Methods


   // ---------------  Helpers

   protected countArgs() {}

   public parse() {
      // look for a flag in position 1
      // first two args are always "node" and {path}
      const arg1 = this.commandLineArgs[2];

      switch (arg1) {
         case "-c":
         case "--configure": {

            // run setup wizard
            const setupWizard: InstanceType<typeof SetupWizard>= new SetupWizard([
               new Overview()
               , new SetupRole()
               , new EnableApis()
               , new SelectLanguage()
            ])
            
            // instruct on google cloud setup, gather config data
            const configData = setupWizard.run();

            setupWizard.save(configData);
            setupWizard.createSentenceFile();
            break;
         }

         case "-b":
         case "--build": {

            break;
         }

         // It is expected that this case also catches undefined
         default: {
            console.log(
`Please run this script with the -c or --configure flag to configure your project using the setup wizard. 

Or use the -b or --build flag to build the audio files and subfolders
            
`);
         }
      }
   }
}