/* Null means "absence of value" and best fits
*/
export default interface WizardSteps {
   hasSaveableData: boolean
   , needsFileValidation: boolean
   , readonly invalidInputMessage?: string
   , readonly configDataKey?: string

   , explain(): void
   , prompt(): string
   , validateInput(userInput?: string): boolean
   , validateFile?(filePath?: string): boolean|void
}








