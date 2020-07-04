import ConfigData from "./ConfigDataInterface";

/* Null means "absence of value" and best fits
*/
export default interface WizardSteps {
   readonly hasSaveableData: boolean
   , readonly needsFileValidation: boolean
   , readonly invalidInputMessage?: string | undefined
   , readonly configDataKey?: keyof ConfigData

   , explain(): void
   , prompt(): string
   , validateInput(userInput?: string | undefined): boolean
   , validateFile?(filePath?: string | undefined): boolean | void
}








