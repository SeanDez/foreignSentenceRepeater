/* Null means "absence of value" and best fits
*/
export default interface WizardSteps {
   hasSaveableData: boolean
   , needsFileValidation: boolean
   , readonly invalidInputMessage?: string
   , readonly configDataKey?: string
   , readonly promptMessage?: string
   , explain(): string|void
   , prompt(): string
   , validateInput(userInput?: string): boolean
   , validateFile?(filePath?: string): boolean|void
   , format?(userInput: string): boolean|void
}








