import WizardSteps from "./WizardStepsInterface";
import StepsBase from "./StepsBase";

export default class SelectLanguage extends StepsBase implements WizardSteps {
   /**** Properties ****/
   public readonly hasSaveableData: boolean = true;
   public readonly configDataKey: string = "languageCode";

   protected readonly header: string = `
******************************************
         SELECT LANGUAGE BY CODE 
******************************************
   `

   protected readonly description: string = `Google Cloud's Translate API allows translation between more than 100 languages. In this step you will find the code Google uses to specify the language you wish to translate your sentences into.
   
   Please go to this page to see all of the latest supported languages and their corresponding codes: https://cloud.google.com/translate/docs/languages
   `

   public readonly promptMessage: string = `Please enter the language code of the target message exactly as shown, including any hyphens, and with matching letter casing:
   `

   /**** Duck Typed Methods ****/

   /* Always returns true. But gives a warning message if input is not found in the internal list (below)
   */
   public validateInput(userInput: string): true {
      const matchFound: boolean = this.validLanguageCodes.some(singleCode => {
         return singleCode === userInput;
      })

      if (matchFound === false) {
         console.log(`The language code you entered was not found in this script's internal list. If the language was newly added, this is okay. If the build fails however, please check the language code you entered and update it directly inside configuration.json in the project root.
         `);
      }

      return true;
   }


   // --------------- Data
   
   private readonly validLanguageCodes: Array<string> = [
      'af', 
      'sq', 
      'am', 
      'ar', 
      'hy', 
      'az', 
      'eu', 
      'be', 
      'bn', 
      'bs', 
      'bg', 
      'ca', 
      'ceb', 
      'zh-CN', 
      'zh', 
      'zh-TW', 
      'co', 
      'hr', 
      'cs', 
      'da', 
      'nl', 
      'en', 
      'eo', 
      'et', 
      'fi', 
      'fr', 
      'fy', 
      'gl', 
      'ka', 
      'de', 
      'el', 
      'gu', 
      'ht', 
      'ha', 
      'haw', 
      'he', 
      'iw', 
      'hi', 
      'hmn', 
      'hu', 
      'is', 
      'ig', 
      'id', 
      'ga', 
      'it', 
      'ja', 
      'jv', 
      'kn', 
      'kk', 
      'km', 
      'rw', 
      'ko', 
      'ku', 
      'ky', 
      'lo', 
      'la', 
      'lv', 
      'lt', 
      'lb', 
      'mk', 
      'mg', 
      'ms', 
      'ml', 
      'mt', 
      'mi', 
      'mr', 
      'mn', 
      'my', 
      'ne', 
      'no', 
      'ny', 
      'or', 
      'ps', 
      'fa', 
      'pl', 
      'pt', 
      'pa', 
      'ro', 
      'ru', 
      'sm', 
      'gd', 
      'sr', 
      'st', 
      'sn', 
      'sd', 
      'si', 
      'sk', 
      'sl', 
      'so', 
      'es', 
      'su', 
      'sw', 
      'sv', 
      'tl', 
      'tg', 
      'ta', 
      'tt', 
      'te', 
      'th', 
      'tr', 
      'tk', 
      'uk', 
      'ur', 
      'ug', 
      'uz', 
      'vi', 
      'cy', 
      'xh', 
      'yi', 
      'yo', 
      'zu'
   ]
}