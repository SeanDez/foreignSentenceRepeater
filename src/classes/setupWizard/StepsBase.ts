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
       return readLine.question(this.promptMessage);
    }

    /* Does only a basic exit check
    */
    public validateInput(rawUserInput: string): boolean {
        this.exitCheck(rawUserInput);

        // if not exited
        return true;
    }


    /**** Helpers ****/

    public exitCheck(userInput: string) {
        const normalizedUserInput = userInput.trim().toLowerCase();
        enum exitCodes { exit = "exit", quit = "quit" }

        if (normalizedUserInput === exitCodes.exit ||
            normalizedUserInput === exitCodes.quit
            ) {
            process.exit();
        }
    }

}