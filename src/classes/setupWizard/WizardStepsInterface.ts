/* Null means "absence of value" and best fits
*/
export default interface WizardSteps {
   hasSaveableData: boolean
   , explain(): string|void
   , validate?(userResponse?: string): boolean|void
   , format?(userResponse: string): boolean|void
}