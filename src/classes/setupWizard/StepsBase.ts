import readLine from "readline-sync";

export default abstract class StepsBase {
    public hasSaveableData: boolean = false;
    public needsFileValidation: boolean = false;
    protected description: string = ``;

    protected readonly header: string = `
******************************************
    FOREIGN SENTENCE AUDIO TRANSLATOR 
******************************************
`;

    protected readonly promptMessage: string = `Press any key to continue...
`;

    
    /**** Duck Typed DEFAULT Methods ****/

    public explain() {
        if (this.description) {
            console.log(this.description);
        }
    }

    public prompt() {
       return readLine.question(this.promptMessage);
    }

    /* Does only a basic exit check
    */
    public validateInput(rawUserInput: string): boolean {
        // if not exited
        return true;
    }


    /**** Helpers ****/



}