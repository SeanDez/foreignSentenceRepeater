import ConfigData from "./setupWizard/ConfigDataInterface";
import SetupWizard from "./setupWizard/SetupWizard";
import SetupFinalizer from "./setupWizard/SetupFinalizer";

// step instances
import ConfigOverview from "./setupWizard/ConfigOverview";
import SetupRole from "./setupWizard/SetupRole";
import EnableApis from "./setupWizard/EnableApis";
import SelectLanguage from "./setupWizard/SelectLanguage";
import SelectRepeatCount from "./setupWizard/SelectRepeatCount";
import BuildOverview from "./setupWizard/BuildOverview";

// build related
import BuildOrchestrator from "./sentenceBuilder/BuildOrchestrator";
import Sentence from "./sentenceBuilder/Sentence";


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
               new ConfigOverview()
               , new SetupRole()
               , new EnableApis()
               , new SelectLanguage()
               , new SelectRepeatCount()
            ]);
            
            // instruct on google cloud setup, gather config data
            const configData = setupWizard.initialSetup();

            // save & create files
            const setupFinalizer = new SetupFinalizer();
            const successfulSave: boolean = setupFinalizer.save(configData);
            const sentenceFileCreated: boolean = setupFinalizer.createSentenceFile();

            // print final instructions
            if (successfulSave && sentenceFileCreated) {
               setupFinalizer.printFinalInstructions();
            }

            break;
         }

         case "-b":
         case "--build": {
            // parse sentence file and print count of valid ones
            const buildOrchestrator = new BuildOrchestrator();
            buildOrchestrator.parseValidateAndPrintSentenceCount();

            // print instructions for usage
            // parse sentence file. Print data about valid sentence and phrase count
            const setupWizard = new SetupWizard([new BuildOverview]);

            // run build process on all qualified sentences
            buildOrchestrator.qualifiedSentences.forEach(Sentence => {
               const folderExists = buildOrchestrator.checkForExistingFolder(Sentence);

               if (folderExists === false) {
                  buildOrchestrator.buildFolderAndAudioFile(Sentence);
               }
            });


            console.log(`Your foreign translation audio course has been built. Happy learning! 

You can add more sentences or phrases at any time and rerun the build process to add to your course.`)

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