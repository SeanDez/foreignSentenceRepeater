import readLine from "readline-sync";

export default abstract class StepsBase {
    public hasSaveableData: boolean = false;
    public needsFileValidation: boolean = false;

    protected readonly header: string = `
******************************************
    FOREIGN SENTENCE AUDIO TRANSLATOR 
******************************************
`;

    protected readonly promptMessage: string = `Press any key to continue...
`;


    /**** Constructor ****/
    
    /**** Duck Typed Methods ****/

    public prompt() {
       return readLine.keyIn();
    }

    /* Does only a basic exit check
    */
    public validateInput(rawUserInput: string): boolean {
        this.exitCheck(rawUserInput);

        // if not exited
        return true;
    }


    /**** Helpers ****/

    /* THIS METHOD OVERWRIDES ALL .keyIn() INPUTS THAT START WITH Q (or the passed argument)
        
    No language code interferes
    https://cloud.google.com/translate/docs/languages

    .prompt and .question are also compatible
    */
    public exitCheck(userInput: string, exitChar: string = "q") {
        const normalizedUserInput = userInput.trim().toLowerCase();

        if (normalizedUserInput === exitChar) {
            process.exit();
        }
    }

}