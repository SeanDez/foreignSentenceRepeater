/* Null means "absence of value" and best fits
*/
export default interface WizardSteps {
   readonly hasSaveableData: boolean
   , readonly needsFileValidation: boolean
   , readonly invalidInputMessage?: string
   , readonly configDataKey?: string

   , explain(): void
   , prompt(): string
   , validateInput(userInput?: string): boolean
   , validateFile?(filePath?: string): boolean|void
}








